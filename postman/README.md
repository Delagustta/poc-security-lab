# Postman

Recursos do Postman para testar a POC localmente.

## Estrutura

```text
postman/
├── collections/
│   └── security-lab-admin.postman_collection.json
├── environments/
│   └── local.postman_environment.json
└── README.md
```

## Como importar

1. Abra o Postman.
2. Importe a collection:

```text
postman/collections/security-lab-admin.postman_collection.json
```

3. Importe o environment:

```text
postman/environments/local.postman_environment.json
```

4. Selecione o environment `Security Lab - Local`.

## Organização da collection

```text
01 - Keycloak
├── Authentication
├── Metadata
└── Admin API
    ├── Users
    ├── Groups
    ├── Realm Roles
    ├── Client Roles
    ├── Clients
    ├── Sessions
    └── Events

02 - Backend API

03 - WSO2
├── Gateway
└── Protected APIs
```

A pasta `01 - Keycloak / Authentication` já possui requests para obter token administrativo por password grant, client credentials e refresh token.

Algumas pastas ainda estão vazias porque representam a arquitetura futura da POC.

## Variáveis

O environment local contém:

```text
apiBaseUrl: http://localhost:8081
gatewayBaseUrl: http://localhost:8280
keycloakUrl: http://localhost:8080
realm: realm-test-angular
clientId: security-lab-angular
adminClientId: security-lab-admin
clientSecret: vazio inicialmente
adminUser: admin
adminPassword: vazio inicialmente
accessToken: vazio inicialmente
adminAccessToken: vazio inicialmente
refreshToken: vazio inicialmente
expiresIn: vazio inicialmente
clientUuid: vazio inicialmente
userId: vazio inicialmente
groupId: vazio inicialmente
roleName: vazio inicialmente
```

Para testar endpoints protegidos, preencha a variável `accessToken` com um Access Token válido emitido pelo Keycloak.

As variáveis `adminAccessToken`, `clientUuid`, `userId`, `groupId` e `roleName` serão usadas conforme a pasta `01 - Keycloak / Admin API` evoluir.

Para esta POC, o jeito mais simples é fazer login pelo Angular, abrir o DevTools, localizar a requisição `token` na aba `Network` e copiar o campo `access_token` da resposta.
