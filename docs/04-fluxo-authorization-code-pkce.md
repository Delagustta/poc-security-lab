# Fluxo Authorization Code com PKCE

Este documento explica o fluxo de autenticação usado nesta POC entre Angular e Keycloak.

## Visão geral

A aplicação Angular é uma SPA, ou seja, roda no navegador do usuário.

Por esse motivo ela é considerada um client público. Ela não consegue guardar um client secret com segurança, porque qualquer segredo enviado para o navegador pode ser inspecionado.

Por isso, o fluxo usado é:

```text
Authorization Code com PKCE
```

Esse é o fluxo recomendado para SPAs modernas.

## Desenho simplificado

```text
Angular
   │
   │ 1. Inicia login com PKCE
   ▼
Keycloak
   │
   │ 2. Autentica o usuário
   ▼
Angular
   │
   │ 3. Recebe authorization code
   ▼
Keycloak
   │
   │ 4. Troca code + verifier por tokens
   ▼
Angular
   │
   │ 5. Carrega perfil do usuário
   ▼
Tela autenticada
```

## Etapa 1: Angular inicia

Quando a aplicação abre, o Angular executa a inicialização do Keycloak.

A configuração usada é:

```text
onLoad: check-sso
pkceMethod: S256
```

O `check-sso` verifica se já existe uma sessão ativa no Keycloak.

Se existir sessão, a aplicação carrega o perfil do usuário.

Se não existir sessão, a aplicação mostra apenas o botão `Entrar`.

## Etapa 2: Usuário clica em Entrar

Quando o usuário clica em `Entrar`, a aplicação chama:

```text
keycloak.login()
```

Esse método é da biblioteca `keycloak-js`.

A aplicação não monta manualmente a URL de login. A biblioteca faz isso.

Ela monta uma URL de autorização parecida com:

```text
http://localhost:8080/realms/realm-test-angular/protocol/openid-connect/auth
```

Com parâmetros como:

```text
client_id=security-lab-angular
redirect_uri=http://localhost:4200
response_type=code
scope=openid
code_challenge=...
code_challenge_method=S256
state=...
nonce=...
```

## Etapa 3: PKCE protege o fluxo

PKCE significa:

```text
Proof Key for Code Exchange
```

Antes do redirecionamento para o Keycloak, a biblioteca gera:

- `code_verifier`: valor secreto temporário;
- `code_challenge`: valor derivado do `code_verifier`.

Com `S256`, o `code_challenge` é gerado usando SHA-256.

O navegador envia o `code_challenge` para o Keycloak, mas não envia o `code_verifier` nesse momento.

O objetivo é provar, mais tarde, que quem está trocando o authorization code por tokens é o mesmo navegador que iniciou o login.

## Etapa 4: Keycloak autentica o usuário

O navegador é redirecionado para a tela de login do Keycloak.

O Keycloak valida:

- username;
- senha;
- se o usuário está habilitado;
- se existe alguma ação obrigatória pendente.

Se o login falhar, o usuário permanece no Keycloak.

Se o login funcionar, o Keycloak cria uma sessão e redireciona de volta para o Angular.

## Etapa 5: Angular recebe um authorization code

Depois do login, o Keycloak redireciona para a aplicação Angular.

O retorno contém um `code`.

Esse `code` não é o access token.

Ele é um código temporário, de vida curta, usado apenas para solicitar tokens ao Keycloak.

Conceitualmente, o retorno é parecido com:

```text
http://localhost:4200/?state=...&session_state=...&code=...
```

## Etapa 6: keycloak-js troca o code por tokens

Depois que o Angular recebe o redirect, o `keycloak-js` continua o fluxo.

Ele envia para o Keycloak:

- authorization code;
- `code_verifier`;
- client ID;
- redirect URI.

O Keycloak compara o `code_verifier` com o `code_challenge` recebido no início do login.

Se a validação passar, o Keycloak devolve os tokens ao adapter.

Nesta POC, os tokens não são exibidos na tela.

## Etapa 7: Aplicação carrega o perfil

Quando o adapter informa que o usuário está autenticado, a aplicação chama:

```text
loadUserProfile()
```

Esse método busca os dados básicos do usuário no Keycloak.

A aplicação converte o perfil para o modelo interno:

```text
Nome
Username
E-mail
```

Depois atualiza o estado usando Signals.

## Etapa 8: Tela reage ao estado

Quando o estado muda para autenticado:

```text
isAuthenticated: true
userInfo: preenchido
```

a tela passa a mostrar:

- botão `Sair`;
- Nome;
- Username;
- E-mail.

Quando o usuário sai:

```text
isAuthenticated: false
userInfo: null
```

a tela volta a mostrar apenas:

- botão `Entrar`.

## O que a biblioteca faz automaticamente

O `keycloak-js` cuida de:

- gerar o `code_verifier`;
- gerar o `code_challenge`;
- montar a URL de autorização;
- redirecionar para o Keycloak;
- processar o retorno com authorization code;
- trocar o code por tokens;
- guardar os tokens internamente;
- informar se o usuário está autenticado;
- carregar o perfil do usuário.

## O que a aplicação faz

A aplicação Angular fica responsável por:

- configurar URL, realm e client ID;
- inicializar o adapter;
- chamar login;
- chamar logout;
- guardar estado de autenticação com Signals;
- exibir ou esconder informações na tela.

## Resumo final

```text
Clique em Entrar
   │
   ▼
keycloak-js gera PKCE
   │
   ▼
Navegador vai para o Keycloak
   │
   ▼
Usuário faz login
   │
   ▼
Keycloak devolve authorization code
   │
   ▼
keycloak-js troca code + verifier por tokens
   │
   ▼
Angular carrega perfil
   │
   ▼
Tela mostra dados do usuário
```
