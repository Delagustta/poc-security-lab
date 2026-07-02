# Keycloak Fundamentos

Este documento registra os conceitos iniciais do Keycloak que serão usados ao longo da POC.

## Realm

Um Realm é um espaço isolado de configuração dentro do Keycloak.

Ele agrupa usuários, clients, roles e regras de autenticação. Em um laboratório ou ambiente real, realms diferentes podem representar contextos separados, como aplicações, empresas ou domínios de segurança distintos.

Na POC, o realm usado é:

```text
realm-test-angular
```

Esse nome pode ser outro, desde que a aplicação Angular seja configurada com o mesmo valor.

## Client

Um Client representa uma aplicação que utiliza o Keycloak para autenticação e autorização.

No contexto desta POC, a aplicação Angular será configurada futuramente como um client no Keycloak. Esse client terá suas próprias configurações, como URLs permitidas, tipo de acesso e roles específicas.

Na POC, o client usado pela aplicação Angular é:

```text
security-lab-angular
```

Como o Angular roda no navegador, ele deve ser configurado como client público, sem client secret.

## User

Um User representa uma pessoa ou identidade que pode se autenticar no Keycloak.

O usuário possui credenciais e informações de perfil, como nome, username e e-mail. Após a autenticação, o Keycloak pode emitir tokens contendo informações desse usuário.

Um usuário de exemplo para a POC é:

```text
user-angular
```

Esse nome é apenas uma sugestão para o laboratório.

## Client Role

Uma Client Role é uma permissão associada a um client específico.

Ela é útil quando uma permissão faz sentido apenas dentro do contexto de uma aplicação. Por exemplo, uma role de um client Angular pode representar uma capacidade específica daquela aplicação.

## Realm Role

Uma Realm Role é uma permissão definida no nível do Realm.

Ela pode ser compartilhada por vários clients dentro do mesmo Realm. Esse tipo de role é útil para permissões mais gerais, que não pertencem exclusivamente a uma aplicação.

## Autenticação e Autorização

Autenticação é o processo de confirmar quem é o usuário. Normalmente envolve login, senha ou outro mecanismo de identificação.

Autorização é o processo de decidir o que o usuário autenticado pode acessar ou executar. Normalmente envolve roles, permissões e regras de acesso.

Em resumo: autenticação responde "quem é você?", enquanto autorização responde "o que você pode fazer?".
