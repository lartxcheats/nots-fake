# 📱 Sistema de Comprovantes - PWA

App de notificações de comprovantes que funciona no iOS e Android!

## 🚀 Como usar no iPhone/iPad

1. Abra o site no Safari (navegador padrão do iOS)
2. Clique no botão de compartilhar (quadrado com seta)
3. Role para baixo e selecione "Adicionar à Tela de Início"
4. Confirme e o app será instalado
5. Abra o app pela tela inicial
6. Clique em "🔔 Ativar Notificações" e permita
7. Configure o intervalo e clique em "▶️ Iniciar"

## ✨ Funcionalidades

- ✅ Notificações push em segundo plano
- ✅ Funciona offline (PWA)
- ✅ Instalável na tela inicial
- ✅ Notificações automáticas configuráveis
- ✅ Vibração ao receber notificação
- ✅ Interface responsiva para mobile

## 📝 Notas importantes

- No iOS, o app precisa estar instalado na tela inicial para notificações funcionarem melhor
- As notificações aparecem mesmo com o app fechado (se instalado)
- Você pode configurar o intervalo de 5 a 60 segundos
- Os comprovantes são gerados aleatoriamente para teste

## 🔧 Para hospedar

Para usar em produção, você precisa:
1. Hospedar em HTTPS (obrigatório para PWA)
2. Usar um servidor web (pode ser GitHub Pages, Netlify, Vercel, etc.)
3. Os ícones precisam ser arquivos PNG reais (substitua os placeholders)

## 🎨 Personalizações

Edite os arrays em `script.js` para customizar:
- Títulos dos comprovantes
- Nomes dos destinatários
- Valores (atualmente aleatórios entre R$ 10 e R$ 1010)
