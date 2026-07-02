import { inject, Injectable } from '@angular/core';
import Keycloak, { KeycloakProfile } from 'keycloak-js';

import { AuthStateService } from './auth-state.service';
import { keycloakConfig } from './keycloak.config';
import { UserInfo } from './user-info.model';

/**
 * Encapsula o adapter oficial keycloak-js.
 * Esta classe concentra inicialização, login, logout e leitura do perfil autenticado.
 */
@Injectable({
  providedIn: 'root',
})
export class KeycloakAuthService {
  private readonly authState = inject(AuthStateService);
  private readonly keycloak = new Keycloak(keycloakConfig);

  /**
   * Inicializa o Keycloak usando Authorization Code com PKCE.
   * O modo check-sso permite abrir a aplicação sem forçar login imediato.
   */
  async initialize(): Promise<void> {
    try {
      const authenticated = await this.keycloak.init({
        onLoad: 'check-sso',
        pkceMethod: 'S256',
        checkLoginIframe: false,
      });

      if (authenticated) {
        await this.loadAuthenticatedUser();
        return;
      }

      this.authState.clearAuthentication();
    } catch (error: unknown) {
      console.error('Erro ao inicializar o Keycloak.', error);
      this.authState.clearAuthentication();
    }
  }

  /**
   * Redireciona o usuário para a tela de login do Keycloak.
   */
  login(): Promise<void> {
    return this.keycloak.login({
      redirectUri: window.location.origin,
    });
  }

  /**
   * Redireciona o usuário para logout no Keycloak e retorna para a aplicação.
   */
  logout(): Promise<void> {
    this.authState.clearAuthentication();

    return this.keycloak.logout({
      redirectUri: window.location.origin,
    });
  }

  /**
   * Informa se o adapter considera o usuário autenticado neste momento.
   */
  isAuthenticated(): boolean {
    return this.keycloak.authenticated === true;
  }

  /**
   * Obtém o perfil do usuário autenticado a partir do Keycloak.
   */
  getAuthenticatedUserProfile(): Promise<KeycloakProfile> {
    return this.keycloak.loadUserProfile();
  }

  /**
   * Expõe o Access Token já parseado pelo keycloak-js para serviços de autorização.
   * O retorno é unknown para que cada consumidor valide a estrutura antes de usar claims específicas.
   */
  getParsedToken(): unknown {
    return this.keycloak.tokenParsed;
  }

  /**
   * Carrega o perfil do usuário e reflete os dados no estado da aplicação.
   */
  private async loadAuthenticatedUser(): Promise<void> {
    const profile = await this.getAuthenticatedUserProfile();

    this.authState.setAuthenticated(this.mapProfileToUserInfo(profile));
  }

  /**
   * Converte o perfil retornado pelo Keycloak no modelo usado pela UI.
   */
  private mapProfileToUserInfo(profile: KeycloakProfile): UserInfo {
    return {
      name: this.getDisplayName(profile),
      username: profile.username ?? '-',
      email: profile.email ?? '-',
    };
  }

  /**
   * Monta o nome exibido priorizando firstName/lastName e usando username como fallback.
   */
  private getDisplayName(profile: KeycloakProfile): string {
    const fullName = [profile.firstName, profile.lastName].filter(Boolean).join(' ').trim();

    return fullName || profile.username || '-';
  }
}
