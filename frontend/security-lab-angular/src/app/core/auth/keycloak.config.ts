import { KeycloakConfig } from 'keycloak-js';

/**
 * Configuração centralizada do client Angular no Keycloak.
 * Mantê-la isolada facilita trocar realm, client ou URL sem alterar a UI.
 */
export const keycloakConfig: KeycloakConfig = {
  url: 'http://localhost:8080',
  realm: 'realm-test-angular',
  clientId: 'security-lab-angular',
};
