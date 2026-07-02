# Angular com Keycloak Login

Este documento explica como a aplicação Angular foi integrada ao Keycloak usando a biblioteca oficial `keycloak-js`.

## Objetivo desta etapa

O objetivo é comprovar que o Angular consegue autenticar um usuário no Keycloak usando Authorization Code com PKCE.

Nesta etapa ainda não foram implementados:

- Interceptors;
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
frontend/security-lab-angular/src/app/security/keycloak/keycloak.config.ts
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

## Organização da camada de segurança

A segurança do frontend fica em:

```text
src/app/security/
```

Arquivos principais:

```text
security/
├── keycloak/
│   ├── keycloak.config.ts
│   └── keycloak.service.ts
├── auth/
│   ├── auth.service.ts
│   └── auth.guard.ts
├── authorization/
│   ├── permission.service.ts
│   ├── role.guard.ts
│   └── directives/
│       ├── has-role.directive.ts
│       └── has-any-role.directive.ts
└── models/
    └── user-info.model.ts
```

## Responsabilidade de cada arquivo

### security/keycloak/keycloak.config.ts

Centraliza a configuração do Keycloak.

Esse arquivo evita espalhar URL, realm e client ID pela aplicação.

### security/models/user-info.model.ts

Define o modelo usado pela UI para exibir os dados básicos do usuário:

```text
Nome
Username
E-mail
```

Nesta etapa, tokens não são exibidos.

### security/auth/auth.service.ts

Mantém o estado de autenticação usando Signals.

Ele sabe:

- se o usuário está autenticado;
- quais dados básicos do usuário devem ser exibidos;
- como limpar o estado quando o usuário sai.

Esse serviço não chama o Keycloak diretamente. Ele apenas guarda estado para a UI.

### security/keycloak/keycloak.service.ts

Encapsula o adapter `keycloak-js`.

Ele é responsável por:

- inicializar o Keycloak;
- iniciar login;
- iniciar logout;
- verificar se o usuário está autenticado;
- carregar o perfil do usuário autenticado;
- converter o perfil do Keycloak para o modelo usado pela aplicação.

### security/authorization/permission.service.ts

Centraliza verificações de autorização no frontend.

Ele lê Realm Roles do Access Token em:

```text
tokenParsed.realm_access.roles
```

Métodos disponíveis:

```text
hasRole(role)
hasAnyRole(roles)
hasAllRoles(roles)
getRoles()
```

As roles são normalizadas para maiúsculas para facilitar comparação e exibição.

### security/authorization/directives

Diretivas estruturais para exibir conteúdo condicionalmente:

```text
*appHasRole
*appHasAnyRole
```

Elas usam o `PermissionService` e evitam espalhar lógica de role pelos templates.

## Inicialização no bootstrap do Angular

A inicialização acontece no arquivo:

```text
src/app/app.config.ts
```

O Angular chama `KeycloakService.initialize()` durante o bootstrap da aplicação.

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
src/app/pages/home/home.page.ts
```

Quando o usuário não está autenticado:

- aparece apenas o botão `Entrar`.

Quando o usuário está autenticado:

- aparece o botão `Sair`;
- aparecem Nome, Username e E-mail.

O botão `Entrar` chama:

```text
KeycloakService.login()
```

O botão `Sair` chama:

```text
KeycloakService.logout()
```

O botão `Mostrar Roles` navega para:

```text
/debug
```

Essa página fica em:

```text
src/app/pages/debug/permission-debug.component.ts
```

Ela mostra as Realm Roles presentes no Access Token.

## Rotas protegidas por autenticação e roles

As rotas atuais são:

```text
/                 Home
/dashboard        Dashboard
/financeiro       Financeiro
/administracao    Administração
/perfil           Perfil
/debug            Debug de permissões
```

Proteções aplicadas:

```text
/dashboard      exige autenticação
/perfil         exige autenticação
/financeiro     exige Realm Role FINANCEIRO
/administracao  exige Realm Role ADMIN
```

O `RoleGuard` lê a role necessária em `route.data.role`.

Exemplo:

```text
data: { role: 'ADMIN' }
```

Na Home, o menu usa o `PermissionService` diretamente para exibir ou esconder os links `Financeiro` e `Administração`. Nenhuma diretiva customizada é usada nesse menu.

## Menu, roles e token atualizado

O menu da Home é uma conveniência visual. Ele usa as roles presentes no Access Token atual para decidir se mostra links como `Financeiro` e `Administração`.

Isso significa que, se uma role for removida diretamente no Keycloak enquanto o usuário ainda está logado, o menu pode continuar exibindo o link até que o Angular receba um token novo ou o usuário faça logout/login.

Mesmo nesse cenário, a rota continua protegida pelo `RoleGuard`.

Exemplo:

```text
1. Usuário faz login com a role FINANCEIRO.
2. A Home mostra o link Financeiro.
3. A role FINANCEIRO é removida no Keycloak.
4. O menu pode continuar mostrando o link por estar usando o token atual.
5. Ao tentar acessar /financeiro, o RoleGuard reavalia a permissão.
6. Sem a role necessária, o usuário é redirecionado para a Home.
```

Esse comportamento reforça uma regra importante: esconder links melhora a experiência, mas não é a segurança principal. A proteção real fica nos guards do frontend e, principalmente, nas validações do backend.

Nesta POC ainda não existe refresh explícito de token durante troca de rota. Em uma evolução futura, a aplicação pode chamar `updateToken` antes de avaliar permissões ou criar uma tela de acesso negado.

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
