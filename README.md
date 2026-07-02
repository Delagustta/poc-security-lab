# POC Security Lab

## Arquitetura da POC

### Objetivo do laboratório

Este laboratório tem como objetivo estudar, de forma incremental, conceitos de autenticação, autorização e proteção de APIs usando Angular, Keycloak, Spring Boot e, futuramente, gerenciamento de APIs.

A etapa atual comprova que uma aplicação Angular consegue autenticar um usuário no Keycloak usando o fluxo Authorization Code com PKCE.

### Tecnologias que serão utilizadas

- Angular 20
- Keycloak 21.1.1
- keycloak-js 21.1.1
- Spring Boot 3.5.x
- Java 21
- WSO2 API Manager (futuramente)

Para esta POC, o servidor Keycloak e a biblioteca `keycloak-js` foram mantidos na mesma versão `21.1.1` para reduzir riscos de incompatibilidade durante o estudo.

### Estrutura atual do projeto

```text
poc-security-lab/
├── frontend/
│   └── security-lab-angular/
│       └── src/
│           └── app/
│               ├── core/
│               │   ├── config/
│               │   └── services/
│               ├── security/
│               │   ├── keycloak/
│               │   ├── auth/
│               │   ├── authorization/
│               │   │   └── directives/
│               │   └── models/
│               ├── pages/
│               │   ├── home/
│               │   ├── profile/
│               │   └── debug/
│               └── app.component.ts
├── backend/
│   └── security-lab-api/
│       └── src/
│           └── main/
│               ├── java/
│               │   └── com/
│               │       └── securitylab/
│               │           ├── config/
│               │           ├── controller/
│               │           └── security/
│               └── resources/
├── docs/
│   ├── 01-keycloak-fundamentos.md
│   ├── 02-ambiente-keycloak.md
│   ├── 03-angular-keycloak-login.md
│   ├── 04-fluxo-authorization-code-pkce.md
│   └── 05-spring-resource-server.md
├── postman/
│   └── security-lab.postman_collection.json
└── README.md
```

### Fluxo inicial

```text
Angular
    │
    ▼
Keycloak
    │
    ▼
Spring Boot Resource Server
```

### Configuração usada no laboratório

Os nomes abaixo são os usados nesta POC. Eles podem ser trocados, desde que a configuração do Keycloak e o arquivo `frontend/security-lab-angular/src/app/security/keycloak/keycloak.config.ts` sejam mantidos sincronizados.

- Realm: `realm-test-angular`
- Client: `security-lab-angular`
- Usuário de exemplo: `user-angular`
- URL do Keycloak: `http://localhost:8080`
- URL do Angular em desenvolvimento: `http://localhost:4200`
- Issuer da API: `http://localhost:8080/realms/realm-test-angular`
- Realm Roles usadas no Angular: `ADMIN`, `FINANCEIRO`
- Client Roles usadas na API: `user`, `admin`

### Trilha de documentação

Siga os documentos nesta ordem:

1. [Keycloak Fundamentos](docs/01-keycloak-fundamentos.md)
2. [Ambiente Keycloak](docs/02-ambiente-keycloak.md)
3. [Angular com Keycloak Login](docs/03-angular-keycloak-login.md)
4. [Fluxo Authorization Code com PKCE](docs/04-fluxo-authorization-code-pkce.md)
5. [Spring Boot Resource Server](docs/05-spring-resource-server.md)

### Comandos principais

Subir o Keycloak usado na POC:

```powershell
docker run --name keycloak-security-lab -p 8080:8080 -e KEYCLOAK_ADMIN=admin -e KEYCLOAK_ADMIN_PASSWORD=admin quay.io/keycloak/keycloak:21.1.1 start-dev
```

Rodar o Angular:

```powershell
cd frontend/security-lab-angular
npm install
npm start
```

Rodar a API Spring Boot:

```powershell
cd backend/security-lab-api
mvn spring-boot:run
```

### Recursos de apoio

Collection Postman:

```text
postman/security-lab.postman_collection.json
```
