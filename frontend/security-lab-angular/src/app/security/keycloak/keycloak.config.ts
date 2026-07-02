import { KeycloakConfig } from 'keycloak-js';

/**
 * Configuração centralizada do client Angular no Keycloak.
 * Mantê-la neste pacote deixa claro que a configuração pertence à integração com o provedor OIDC.
 */
export const keycloakConfig: KeycloakConfig = {
  url: 'http://localhost:8080',
  realm: 'realm-test-angular',
  clientId: 'security-lab-angular',
};
