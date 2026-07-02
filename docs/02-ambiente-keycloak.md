# Ambiente Keycloak

Este documento mostra como subir o Keycloak da POC via Docker e quais configurações iniciais devem ser feitas para a aplicação Angular conseguir autenticar usuários.

## Versões da POC

Para reduzir problemas de compatibilidade durante o estudo, esta POC usa a mesma versão para o servidor Keycloak e para o adapter JavaScript.

- Keycloak Server: `21.1.1`
- Biblioteca Angular: `keycloak-js 21.1.1`
- Angular: `20.x`

O Angular 20 funciona com o `keycloak-js` usado na POC porque a integração acontece via adapter JavaScript e protocolo OIDC. A escolha de manter `keycloak-js` e Keycloak Server na mesma versão deixa o laboratório mais previsível.

## Subir o Keycloak com Docker Compose

Na raiz do projeto existe o arquivo:

```text
docker-compose.yml
```

Ele define o container do Keycloak usado na POC:

```yaml
services:
  keycloak:
    image: quay.io/keycloak/keycloak:21.1.1
    container_name: keycloak-security-lab
    command: start-dev
    environment:
      KEYCLOAK_ADMIN: admin
      KEYCLOAK_ADMIN_PASSWORD: admin
    ports:
      - "8080:8080"
```

Para subir o Keycloak, execute na raiz do repositório:

```powershell
docker compose up -d
```

Essa configuração faz o seguinte:

- cria um container chamado `keycloak-security-lab`;
- expõe o Keycloak em `http://localhost:8080`;
- cria o usuário administrador inicial;
- define o usuário admin como `admin`;
- define a senha admin como `admin`;
- inicia o Keycloak com `start-dev`, adequado para laboratório local.

Para acompanhar os logs:

```powershell
docker compose logs -f keycloak
```

Para parar o container:

```powershell
docker compose down
```

Se já existir um container antigo com esse nome, remova antes:

```powershell
docker rm -f keycloak-security-lab
```

Depois suba novamente com:

```powershell
docker compose up -d
```

## Acessar o console administrativo

Abra:

```text
http://localhost:8080
```

Entre no Administration Console usando:

- Username: `admin`
- Password: `admin`

Essas credenciais são apenas para ambiente local de estudo.

## Criar o Realm

No menu do Keycloak:

1. Clique no seletor de realm, normalmente no canto superior esquerdo.
2. Clique em `Create realm`.
3. Informe o nome:

```text
realm-test-angular
```

4. Salve.

Esse é o realm usado nesta POC. O nome pode ser outro, mas nesse caso o arquivo `keycloak.config.ts` da aplicação Angular também precisa ser atualizado.

## Criar o Client Angular

Dentro do realm `realm-test-angular`:

1. Acesse `Clients`.
2. Clique em `Create client`.
3. Configure:

```text
Client type: OpenID Connect
Client ID: security-lab-angular
```

4. Avance.
5. Em capability config, mantenha:

```text
Client authentication: Off
Authorization: Off
Standard flow: On
Direct access grants: Off
Implicit flow: Off
```

Para uma SPA Angular, o client deve ser público. Por isso `Client authentication` fica desligado. A aplicação não deve guardar client secret.

6. Configure as URLs:

```text
Root URL: http://localhost:4200
Home URL: http://localhost:4200
Valid redirect URIs: http://localhost:4200/*
Valid post logout redirect URIs: http://localhost:4200/*
Web origins: http://localhost:4200
```

7. Salve.

## Configurar PKCE

Ainda no client `security-lab-angular`, procure a configuração avançada relacionada a PKCE e use:

```text
Proof Key for Code Exchange Code Challenge Method: S256
```

O PKCE é importante para SPAs porque elas são aplicações públicas e não conseguem proteger um client secret.

## Criar Realm Roles

As Realm Roles são usadas pelo frontend para demonstrar autorização baseada na claim:

```text
realm_access.roles
```

No realm `realm-test-angular`:

1. Acesse `Realm roles`.
2. Clique em `Create role`.
3. Crie a role:

```text
USER
```

4. Crie também a role:

```text
ADMIN
```

5. Crie também a role:

```text
FINANCEIRO
```

Essas roles aparecerão no Access Token dentro de `realm_access.roles` quando forem atribuídas ao usuário.

## Criar Client Roles

Ainda no client `security-lab-angular`, crie as roles que serão usadas pela API Spring Boot:

1. Acesse `Clients`.
2. Abra o client `security-lab-angular`.
3. Acesse a aba `Roles`.
4. Crie a role:

```text
user
```

5. Crie também a role:

```text
admin
```

Essas roles são Client Roles. No token, elas aparecem dentro da claim `resource_access`, agrupadas pelo client `security-lab-angular`.

## Criar um usuário de teste

Dentro do realm `realm-test-angular`:

1. Acesse `Users`.
2. Clique em `Add user`.
3. Crie um usuário, por exemplo:

```text
Username: user-angular
Email: user-angular@example.com
First name: User
Last name: Angular
Email verified: On
Enabled: On
```

4. Salve.
5. Acesse a aba `Credentials`.
6. Defina uma senha, por exemplo:

```text
Password: 123456
Password confirmation: 123456
Temporary: Off
```

7. Salve a senha.

O nome do usuário pode ser outro. O importante é que ele esteja habilitado e tenha uma senha não temporária para facilitar o login no laboratório.

## Associar roles ao usuário

Para testar a tela de permissões do Angular e os endpoints protegidos por role:

1. Acesse `Users`.
2. Abra o usuário `user-angular`.
3. Acesse `Role mapping`.
4. Clique em `Assign role`.
5. Selecione as Realm Roles:

```text
USER
ADMIN
FINANCEIRO
```

6. Filtre por client roles, se necessário.
7. Selecione também as roles do client `security-lab-angular`:

```text
user
admin
```

8. Confirme a associação.

Para testar cenários de acesso negado, remova uma das roles do usuário e gere um novo token.

Diferença importante:

- O frontend lê Realm Roles de `realm_access.roles`.
- O backend lê Client Roles de `resource_access.security-lab-angular.roles`.

## Checklist de configuração

Antes de testar o Angular, confirme:

- O Keycloak está rodando em `http://localhost:8080`.
- O realm `realm-test-angular` existe.
- O client `security-lab-angular` existe dentro desse realm.
- O client está público, sem client secret.
- O Standard Flow está habilitado.
- O PKCE está configurado como `S256`.
- `http://localhost:4200/*` está em Valid Redirect URIs.
- `http://localhost:4200/*` está em Valid Post Logout Redirect URIs.
- `http://localhost:4200` está em Web Origins.
- O usuário de teste existe, está habilitado e tem senha definida.
- As Realm Roles `USER`, `ADMIN` e `FINANCEIRO` existem no realm.
- O usuário de teste possui as Realm Roles necessárias para acessar as rotas protegidas do Angular.
- As Client Roles `user` e `admin` existem no client `security-lab-angular`.
- O usuário de teste possui as roles necessárias para acessar `/user` e `/admin`.

## Relação com a aplicação Angular

A configuração do Angular fica em:

```text
frontend/security-lab-angular/src/app/security/keycloak/keycloak.config.ts
```

Ela deve apontar para os mesmos nomes configurados no Keycloak:

```text
url: http://localhost:8080
realm: realm-test-angular
clientId: security-lab-angular
```
