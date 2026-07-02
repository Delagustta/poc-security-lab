import { Injectable, signal } from '@angular/core';

import { UserInfo } from './user-info.model';

/**
 * Mantém o estado de autenticação da aplicação usando Signals.
 * Esta classe não conversa diretamente com o Keycloak; ela apenas expõe o estado para a UI.
 */
@Injectable({
  providedIn: 'root',
})
export class AuthStateService {
  private readonly authenticatedSignal = signal(false);
  private readonly userInfoSignal = signal<UserInfo | null>(null);

  readonly isAuthenticated = this.authenticatedSignal.asReadonly();
  readonly userInfo = this.userInfoSignal.asReadonly();

  /**
   * Atualiza o estado quando o usuário está autenticado.
   */
  setAuthenticated(userInfo: UserInfo): void {
    this.authenticatedSignal.set(true);
    this.userInfoSignal.set(userInfo);
  }

  /**
   * Limpa o estado local quando não há usuário autenticado.
   */
  clearAuthentication(): void {
    this.authenticatedSignal.set(false);
    this.userInfoSignal.set(null);
  }
}
