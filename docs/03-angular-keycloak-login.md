# Angular com Keycloak Login

Este documento explica como a aplicação Angular foi integrada ao Keycloak usando a biblioteca oficial `keycloak-js`.

## Objetivo desta etapa

O objetivo é comprovar que o Angular consegue autenticar um usuário no Keycloak usando Authorization Code com PKCE.

Nesta etapa ainda não foram implementados:

- Guards;
- Interceptors;
- controle de autorização por roles;
- exibição de tokens;
- chamada para backend.

## Instalação da biblioteca

A biblioteca oficial usada é:

```powershell
npm install keycloak-js@21.1.1 --save-exact
```

Foi usada a versão exata `21.1.1` para manter compatibilidade direta com o container Keycloak `21.1.1` usado no laboratório.

## Configuração do Keycloak no Angular

Arquivo:

```text
frontend/security-lab-angular/src/app/core/auth/keycloak.config.ts
```

Configuração usada:

```text
url: http://localhost:8080
realm: realm-test-angular
clientId: security-lab-angular
```

Esses valores precisam bater com o que foi configurado no console administrativo do Keycloak.

Os nomes podem ser alterados, mas sempre em conjunto:

- se mudar o nome do realm no Keycloak, atualize `realm`;
- se mudar o client ID no Keycloak, atualize `clientId`;
- se mudar a porta ou host do Keycloak, atualize `url`.

## Organização da camada de autenticação

A autenticação fica em:

```text
src/app/core/auth/
```

Arquivos principais:

```text
core/auth/
├── auth-state.service.ts
├── keycloak-auth.service.ts
├── keycloak.config.ts
└── user-info.model.ts
```

## Responsabilidade de cada arquivo

### keycloak.config.ts

Centraliza a configuração do Keycloak.

Esse arquivo evita espalhar URL, realm e client ID pela aplicação.

### user-info.model.ts

Define o modelo usado pela UI para exibir os dados básicos do usuário:

```text
Nome
Username
E-mail
```

Nesta etapa, tokens não são exibidos.

### auth-state.service.ts

Mantém o estado de autenticação usando Signals.

Ele sabe:

- se o usuário está autenticado;
- quais dados básicos do usuário devem ser exibidos;
- como limpar o estado quando o usuário sai.

Esse serviço não chama o Keycloak diretamente. Ele apenas guarda estado para a UI.

### keycloak-auth.service.ts

Encapsula o adapter `keycloak-js`.

Ele é responsável por:

- inicializar o Keycloak;
- iniciar login;
- iniciar logout;
- verificar se o usuário está autenticado;
- carregar o perfil do usuário autenticado;
- converter o perfil do Keycloak para o modelo usado pela aplicação.

## Inicialização no bootstrap do Angular

A inicialização acontece no arquivo:

```text
src/app/app.config.ts
```

O Angular chama `KeycloakAuthService.initialize()` durante o bootstrap da aplicação.

Na inicialização, o adapter é configurado com:

```text
onLoad: check-sso
pkceMethod: S256
checkLoginIframe: false
```

Significado:

- `check-sso`: verifica se já existe sessão no Keycloak, mas não força login automático;
- `pkceMethod: S256`: usa Authorization Code com PKCE;
- `checkLoginIframe: false`: simplifica o laboratório local e evita dependência do iframe de verificação de sessão.

## Comportamento da tela inicial

Arquivo:

```text
src/app/features/home/home.page.ts
```

Quando o usuário não está autenticado:

- aparece apenas o botão `Entrar`.

Quando o usuário está autenticado:

- aparece o botão `Sair`;
- aparecem Nome, Username e E-mail.

O botão `Entrar` chama:

```text
KeycloakAuthService.login()
```

O botão `Sair` chama:

```text
KeycloakAuthService.logout()
```

## Por que usar Signals

Signals foram usados para refletir o estado de autenticação na tela de forma simples.

Quando o serviço altera o estado:

```text
isAuthenticated = true
userInfo = dados do usuário
```

a tela reage automaticamente e passa a exibir as informações do usuário.

Quando o logout acontece:

```text
isAuthenticated = false
userInfo = null
```

a tela volta a mostrar apenas o botão `Entrar`.

## Executar a aplicação Angular

Com o Keycloak já rodando e configurado:

```powershell
cd frontend/security-lab-angular
npm install
npm start
```

Abra:

```text
http://localhost:4200
```

Clique em `Entrar`, faça login no Keycloak e aguarde o retorno para o Angular.

## Problemas comuns

### Invalid redirect_uri

Verifique se o client no Keycloak contém:

```text
Valid redirect URIs: http://localhost:4200/*
```

### CORS ou erro de origem

Verifique:

```text
Web origins: http://localhost:4200
```

### Login funciona, mas logout não retorna para o Angular

Verifique:

```text
Valid post logout redirect URIs: http://localhost:4200/*
```

### Tela volta sem dados do usuário

Confirme se o usuário tem perfil preenchido no Keycloak, principalmente:

```text
Username
Email
First name
Last name
```

### Versão diferente do Keycloak

Para esta POC, prefira manter:

```text
Keycloak Server: 21.1.1
keycloak-js: 21.1.1
```

Versões diferentes podem funcionar por causa do padrão OIDC, mas podem trazer diferenças no adapter, logout, sessão ou tipagens.
