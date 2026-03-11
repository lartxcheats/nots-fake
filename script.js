let comprovantes = [];
let autoNotificationInterval = null;
let deferredPrompt = null;
let notificacoesEnviadas = 0;
let notificacoesTotal = 0;

const form = document.getElementById('comprovanteForm');
const notificationArea = document.getElementById('notificationArea');
const comprovantesList = document.getElementById('comprovantesList');
const enableNotificationsBtn = document.getElementById('enableNotifications');
const installAppBtn = document.getElementById('installApp');
const startAutoBtn = document.getElementById('startAuto');
const stopAutoBtn = document.getElementById('stopAuto');
const quantidadeInput = document.getElementById('quantidadeNotif');
const duracaoInput = document.getElementById('duracaoMinutos');
const statusNotif = document.getElementById('statusNotif');

form.addEventListener('submit', (e) => {
    e.preventDefault();
    
    const tipoSelect = document.getElementById('tipoTransferencia').value.split('|');
    const titulo = tipoSelect[0];
    const tipo = tipoSelect[1];
    const valor = parseFloat(document.getElementById('valor').value);
    const destinatario = document.getElementById('destinatario').value;
    
    const comprovante = {
        id: Date.now(),
        titulo,
        tipo,
        valor,
        destinatario,
        timestamp: new Date().toLocaleString('pt-BR')
    };
    
    comprovantes.unshift(comprovante);
    
    mostrarNotificacao(comprovante);
    atualizarLista();
    
    // Enviar notificação REAL do sistema com visual Nubank
    enviarNotificacaoNubank(
        comprovante.titulo,
        `${tipo} ${destinatario}\nR$ ${valor.toFixed(2)}`
    );
    
    form.reset();
});

function mostrarNotificacao(comprovante) {
    const emptyState = notificationArea.querySelector('.empty-state');
    if (emptyState) {
        emptyState.remove();
    }
    
    const notification = document.createElement('div');
    notification.className = 'notification';
    notification.innerHTML = `
        <h3>💙 Mercado Pago</h3>
        <p><strong>${comprovante.titulo}</strong></p>
        <p>${comprovante.tipo} ${comprovante.destinatario} ${comprovante.sufixo || ''}</p>
    `;
    
    notificationArea.insertBefore(notification, notificationArea.firstChild);
    
    setTimeout(() => {
        notification.style.opacity = '0';
        notification.style.transform = 'translateX(100%)';
        setTimeout(() => notification.remove(), 300);
    }, 5000);
}

function atualizarLista() {
    if (comprovantes.length === 0) {
        comprovantesList.innerHTML = '<p class="empty-state">Nenhum comprovante ainda</p>';
        return;
    }
    
    comprovantesList.innerHTML = comprovantes.map(comp => `
        <div class="comprovante-item">
            <h3>${comp.titulo}</h3>
            <p>${comp.tipo || 'De'}: ${comp.destinatario}</p>
            <p>${comp.sufixo || ''}</p>
            <p class="timestamp">📅 ${comp.timestamp}</p>
        </div>
    `).join('');
}

atualizarLista();

// Registrar Service Worker
if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('./service-worker.js')
        .then(reg => console.log('Service Worker registrado'))
        .catch(err => console.log('Erro no Service Worker:', err));
}

// Capturar evento de instalação do PWA
window.addEventListener('beforeinstallprompt', (e) => {
    e.preventDefault();
    deferredPrompt = e;
    installAppBtn.style.display = 'block';
});

// Botão de instalar app
installAppBtn.addEventListener('click', async () => {
    if (!deferredPrompt) return;
    
    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    
    if (outcome === 'accepted') {
        installAppBtn.style.display = 'none';
    }
    deferredPrompt = null;
});

// Ativar notificações
enableNotificationsBtn.addEventListener('click', async () => {
    if (!('Notification' in window)) {
        alert('Seu navegador não suporta notificações');
        return;
    }

    const permission = await Notification.requestPermission();
    
    if (permission === 'granted') {
        enableNotificationsBtn.textContent = '✅ Notificações Ativadas';
        enableNotificationsBtn.disabled = true;
        
        // Notificação de teste com visual Mercado Pago
        enviarNotificacaoMercadoPago('Notificações ativadas', 'Você receberá alertas de transferências');
    } else {
        alert('Permissão negada. Ative nas configurações do navegador.');
    }
});

// Notificações automáticas
startAutoBtn.addEventListener('click', () => {
    const quantidade = parseInt(quantidadeInput.value);
    const duracaoSegundos = parseInt(duracaoInput.value);
    
    if (Notification.permission !== 'granted') {
        alert('Ative as notificações primeiro!');
        return;
    }
    
    if (quantidade < 1 || duracaoSegundos < 5) {
        alert('Configure valores válidos!');
        return;
    }
    
    // Calcular intervalo em milissegundos
    const duracaoMs = duracaoSegundos * 1000;
    const intervalo = duracaoMs / quantidade;
    
    notificacoesEnviadas = 0;
    notificacoesTotal = quantidade;
    
    startAutoBtn.style.display = 'none';
    stopAutoBtn.style.display = 'block';
    quantidadeInput.disabled = true;
    duracaoInput.disabled = true;
    statusNotif.style.display = 'block';
    
    atualizarStatus();
    
    // Enviar primeira notificação imediatamente
    gerarComprovanteAleatorio();
    
    autoNotificationInterval = setInterval(() => {
        if (notificacoesEnviadas >= notificacoesTotal) {
            pararNotificacoes();
            statusNotif.innerHTML = '✅ Todas as notificações foram enviadas!';
            setTimeout(() => {
                statusNotif.style.display = 'none';
            }, 3000);
            return;
        }
        gerarComprovanteAleatorio();
    }, intervalo);
});

stopAutoBtn.addEventListener('click', () => {
    pararNotificacoes();
});

function pararNotificacoes() {
    clearInterval(autoNotificationInterval);
    startAutoBtn.style.display = 'block';
    stopAutoBtn.style.display = 'none';
    quantidadeInput.disabled = false;
    duracaoInput.disabled = false;
    notificacoesEnviadas = 0;
    notificacoesTotal = 0;
}

function atualizarStatus() {
    if (notificacoesTotal > 0) {
        statusNotif.innerHTML = `📊 Enviadas: ${notificacoesEnviadas} de ${notificacoesTotal}`;
    }
}

function gerarComprovanteAleatorio() {
    const mensagens = [
        {
            titulo: 'Você recebeu R$ 19,90',
            tipo: 'O valor que',
            sufixo: 'te transferiu via Pix já está rendendo.',
            remetentes: gerarNomesAleatorios(20)
        }
    ];
    
    const mensagemEscolhida = mensagens[0];
    const remetente = mensagemEscolhida.remetentes[Math.floor(Math.random() * mensagemEscolhida.remetentes.length)];
    
    const valor = '19.90';
    
    const comprovante = {
        id: Date.now(),
        titulo: mensagemEscolhida.titulo,
        tipo: mensagemEscolhida.tipo,
        sufixo: mensagemEscolhida.sufixo,
        valor: valor,
        destinatario: remetente,
        timestamp: new Date().toLocaleString('pt-BR')
    };
    
    comprovantes.unshift(comprovante);
    mostrarNotificacao(comprovante);
    atualizarLista();
    
    // Enviar notificação REAL do sistema com visual Mercado Pago
    enviarNotificacaoMercadoPago(
        comprovante.titulo,
        `${comprovante.tipo} ${comprovante.destinatario} ${comprovante.sufixo}`
    );
    
    notificacoesEnviadas++;
    atualizarStatus();
}

function gerarNomesAleatorios(quantidade) {
    const primeiroNomes = [
        'João', 'Maria', 'Pedro', 'Ana', 'Carlos', 'Juliana', 'Lucas', 'Beatriz',
        'Rafael', 'Camila', 'Thiago', 'Patricia', 'Bruno', 'Amanda', 'Marcos', 'Larissa',
        'Felipe', 'Gabriela', 'Diego', 'Vanessa', 'Rodrigo', 'Tatiana', 'André', 'Carla',
        'Paulo', 'Renata', 'Gustavo', 'Mariana', 'Leonardo', 'Isabela', 'Fernando', 'Leticia',
        'Ricardo', 'Fernanda', 'Vinicius', 'Bruna', 'Marcelo', 'Aline', 'Fabio', 'Priscila',
        'Daniel', 'Natalia', 'Leandro', 'Daniela', 'Guilherme', 'Carolina', 'Henrique', 'Bianca',
        'Matheus', 'Jéssica', 'Alexandre', 'Raquel', 'Renan', 'Viviane', 'Igor', 'Adriana',
        'Caio', 'Luciana', 'Murilo', 'Simone', 'Vitor', 'Elaine', 'Eduardo', 'Cristina'
    ];
    
    const sobrenomes = [
        'Silva', 'Santos', 'Oliveira', 'Souza', 'Costa', 'Ferreira', 'Rodrigues', 'Almeida',
        'Nascimento', 'Lima', 'Araújo', 'Fernandes', 'Carvalho', 'Gomes', 'Martins', 'Rocha',
        'Ribeiro', 'Alves', 'Pereira', 'Monteiro', 'Mendes', 'Barros', 'Freitas', 'Barbosa',
        'Pinto', 'Moreira', 'Cavalcanti', 'Dias', 'Castro', 'Campos', 'Cardoso', 'Teixeira',
        'Correia', 'Vieira', 'Duarte', 'Nunes', 'Ramos', 'Moura', 'Azevedo', 'Lopes'
    ];
    
    const nomes = [];
    for (let i = 0; i < quantidade; i++) {
        const primeiro = primeiroNomes[Math.floor(Math.random() * primeiroNomes.length)];
        const sobrenome = sobrenomes[Math.floor(Math.random() * sobrenomes.length)];
        nomes.push(`${primeiro} ${sobrenome}`);
    }
    
    return nomes;
}

function enviarNotificacaoMercadoPago(titulo, corpo) {
    if (Notification.permission !== 'granted') return;
    
    const options = {
        body: corpo,
        icon: './notification-icon.svg',
        badge: './notification-icon.svg',
        tag: 'mercadopago-' + Date.now(),
        requireInteraction: false,
        silent: false,
        vibrate: [200, 100, 200],
        timestamp: Date.now(),
        data: {
            url: window.location.href
        },
        image: './notification-icon.svg',
        dir: 'ltr',
        lang: 'pt-BR'
    };
    
    if ('serviceWorker' in navigator && navigator.serviceWorker.controller) {
        navigator.serviceWorker.ready.then((registration) => {
            registration.showNotification(titulo, options);
        });
    } else {
        new Notification(titulo, options);
    }
}

// Verificar se já tem permissão
if (Notification.permission === 'granted') {
    enableNotificationsBtn.textContent = '✅ Notificações Ativadas';
    enableNotificationsBtn.disabled = true;
}
