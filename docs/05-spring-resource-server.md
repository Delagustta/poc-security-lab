# Spring Boot Resource Server

Este documento explica a primeira versão da API backend da POC.

## Objetivo desta etapa

O objetivo é criar uma API Spring Boot capaz de validar JWTs emitidos pelo Keycloak.

Nesta etapa a API valida Client Roles presentes no JWT. Ela diferencia:

- endpoint público;
- endpoint que exige apenas um token JWT válido;
- endpoints que exigem roles específicas.

Ainda não foram implementados:

- validação de Realm Roles;
- integração do Angular chamando a API.

## Versões e dependências

A API foi criada com:

- Java 21
- Maven
- Spring Boot 3.5.x
- Spring Web
- Spring Security
- OAuth2 Resource Server
- Validation
- Actuator

O projeto fica em:

```text
backend/security-lab-api
```

## Estrutura do pacote

```text
com.securitylab
├── config
├── controller
└── security
```

Responsabilidades:

- `config`: configurações gerais da aplicação;
- `controller`: endpoints HTTP da POC;
- `security`: configuração do Spring Security e conversão de roles do JWT.

## Configuração do issuer

Arquivo:

```text
backend/security-lab-api/src/main/resources/application.yml
```

Issuer configurado:

```text
http://localhost:8080/realms/realm-test-angular
```

Esse valor precisa apontar para o mesmo realm configurado no Keycloak.

Quando a API recebe um JWT, o Spring Resource Server usa esse issuer para descobrir as chaves públicas do Keycloak e validar a assinatura do token.

## Configuração de segurança

Arquivo:

```text
backend/security-lab-api/src/main/java/com/securitylab/security/SecurityConfig.java
```

A configuração usa `SecurityFilterChain`, que é a abordagem moderna do Spring Security.

Não foi usado `WebSecurityConfigurerAdapter`, pois essa abordagem foi removida nas versões modernas do Spring Security.

Regras configuradas:

```text
/public                  permitAll
/actuator/health         permitAll
/actuator/info           permitAll
/authenticated           authenticated
/user                    authenticated + hasRole('USER')
/admin                   authenticated + hasRole('ADMIN')
qualquer outra rota      authenticated
```

O Resource Server foi ativado com validação JWT e um converter customizado:

```text
oauth2ResourceServer().jwt().jwtAuthenticationConverter(...)
```

O converter lê apenas as Client Roles do client `security-lab-angular` dentro da claim `resource_access`.

Exemplo:

```text
resource_access.security-lab-angular.roles: ["user", "admin"]
```

Essas roles viram authorities do Spring Security:

```text
user  -> ROLE_USER
admin -> ROLE_ADMIN
```

## Endpoints criados

### GET /public

Endpoint público.

Não exige token.

Resposta:

```text
Public endpoint
```

### GET /authenticated

Exige apenas autenticação.

Precisa receber um JWT válido emitido pelo Keycloak.

Resposta:

```text
Authenticated endpoint
```

### GET /user

Exige autenticação e a role `USER`.

Resposta:

```text
User endpoint
```

### GET /admin

Exige autenticação e a role `ADMIN`.

Resposta:

```text
Admin endpoint
```

## Como executar

Primeiro, o Keycloak precisa estar rodando:

```powershell
cd keycloak
docker compose up -d
```

Depois execute a API:

```powershell
cd backend/security-lab-api
mvn spring-boot:run
```

Por padrão, a API sobe em:

```text
http://localhost:8081
```

Essa porta foi configurada no `application.yml` para evitar conflito com o Keycloak, que já usa `8080`.

## Como testar os endpoints

Endpoint público:

```powershell
curl http://localhost:8081/public
```

Endpoints protegidos precisam de token:

```powershell
curl http://localhost:8081/authenticated -H "Authorization: Bearer <access_token>"
```

Para `/user`, o token precisa conter a Client Role `user` no client `security-lab-angular`.

Para `/admin`, o token precisa conter a Client Role `admin` no client `security-lab-angular`.

O token pode ser obtido manualmente pelo fluxo do Keycloak ou inspecionado durante os testes do Angular. A integração automática Angular -> API será feita em uma etapa futura.

## Como obter o access token pelo Network

Como esta é uma POC de estudo, a forma mais simples de pegar um token para testar a API no Postman é capturar a resposta do endpoint `token` no DevTools do navegador.

O `keycloak-js` pode manter tokens em memória, então nem sempre eles aparecem em `Local Storage` ou `Session Storage`.

Passo a passo:

1. Suba o Keycloak.
2. Suba a aplicação Angular.
3. Acesse:

```text
http://localhost:4200
```

4. Clique em `Entrar`.
5. Faça login com o usuário criado no Keycloak.
6. Abra o DevTools do navegador.
7. Acesse a aba `Network`.
8. Procure uma requisição chamada `token`.
9. Abra essa requisição e veja a aba `Response`.
10. Copie o valor do campo:

```text
access_token
```

11. No Postman, importe a collection da POC.
12. Preencha a variável `accessToken` com o valor copiado.

Depois disso, os requests protegidos da collection usarão:

```text
Authorization: Bearer {{accessToken}}
```

Observação: esse procedimento é apenas para facilitar o teste manual da POC. Em uma aplicação real, o Angular deve enviar o token para a API por meio de um interceptor HTTP, sem copiar tokens manualmente.

## Collection Postman

A collection da POC fica em:

```text
postman/collections/security-lab-admin.postman_collection.json
```

Ela está organizada para acompanhar a arquitetura futura da POC:

```text
01 - Keycloak
02 - Backend API
03 - WSO2
```

Nesta versão, a collection já possui requests de autenticação administrativa do Keycloak e metadata OIDC. A pasta `02 - Backend API` fica reservada para os requests da API conforme a POC evoluir.

O environment local fica em:

```text
postman/environments/local.postman_environment.json
```

Variáveis incluídas no environment:

```text
apiBaseUrl: http://localhost:8081
gatewayBaseUrl: http://localhost:8280
keycloakUrl: http://localhost:8080
realm: realm-test-angular
clientId: security-lab-angular
adminClientId: security-lab-admin
accessToken: vazio inicialmente
adminAccessToken: vazio inicialmente
```

Para testar os endpoints protegidos manualmente, preencha a variável `accessToken` com um access token válido emitido pelo Keycloak e envie `Authorization: Bearer {{accessToken}}`.

## O que o Spring valida no JWT

Com `issuer-uri`, o Spring valida:

- se o token foi emitido pelo issuer configurado;
- se a assinatura é válida;
- se o token não está expirado;
- se o token possui estrutura JWT válida.

Depois da validação criptográfica, o converter lê as roles do payload e cria as authorities usadas por `@PreAuthorize`.

## Próximos passos naturais

As próximas etapas podem incluir:

- fazer o Angular chamar `/public` e `/authenticated`;
- adicionar interceptor no Angular para enviar o access token;
- expandir os testes para cenários de acesso negado;
- avaliar Realm Roles quando a POC avançar.
