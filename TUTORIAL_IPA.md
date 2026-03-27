# 📱 Tutorial: Transformar em IPA

## Pré-requisitos
- ✅ Node.js instalado
- ✅ Mac com Xcode (para iOS)
- ✅ Conta Apple ID

## Passo a Passo

### 1. Instalar dependências
```bash
npm install
```

### 2. Inicializar Capacitor
```bash
npx cap init
```

### 3. Adicionar plataforma iOS
```bash
npx cap add ios
```

### 4. Copiar arquivos web
```bash
npx cap copy
```

### 5. Abrir no Xcode
```bash
npx cap open ios
```

### 6. No Xcode:
1. Seleciona o projeto no topo
2. Vai em "Signing & Capabilities"
3. Marca "Automatically manage signing"
4. Escolhe seu Apple ID
5. Vai em Product → Archive
6. Clica em "Distribute App"
7. Escolhe "Ad Hoc" ou "Development"
8. Exporta o IPA

### 7. Instalar no iPhone:
- Usa AltStore, Sideloadly ou iMazing
- Arrasta o IPA
- Instala no iPhone

## Para Android (APK):

### 1. Adicionar plataforma Android
```bash
npx cap add android
```

### 2. Abrir no Android Studio
```bash
npx cap open android
```

### 3. No Android Studio:
1. Build → Generate Signed Bundle / APK
2. Escolhe APK
3. Cria uma keystore
4. Gera o APK

## Problemas comuns:

### "Command not found: npx"
- Instala Node.js: https://nodejs.org

### "Xcode not found"
- Instala Xcode da App Store (só no Mac)

### "No provisioning profile"
- Vai em Xcode → Preferences → Accounts
- Adiciona seu Apple ID

### "App não abre no iPhone"
- Vai em Ajustes → Geral → VPN e Gerenciamento de Dispositivos
- Confia no desenvolvedor

## Dicas:

- Para iOS precisa de Mac
- Para Android funciona no Windows
- IPA expira em 7 dias (conta grátis)
- Usa TrollStore se possível (permanente)

## Suporte:
Se tiver dúvida, me chama! 🚀
