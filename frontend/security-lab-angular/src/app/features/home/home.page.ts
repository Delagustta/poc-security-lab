import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { Router } from '@angular/router';

import { AuthStateService } from '../../core/auth/auth-state.service';
import { KeycloakAuthService } from '../../core/auth/keycloak-auth.service';
import { InfoFieldComponent } from '../../shared/ui/info-field.component';

/**
 * Página inicial do laboratório.
 * Ela apresenta as ações de autenticação e os dados básicos retornados pelo Keycloak.
 */
@Component({
  selector: 'app-home-page',
  imports: [InfoFieldComponent],
  template: `
    <main>
      <h1>Security Lab</h1>

      @if (isAuthenticated()) {
        @if (userInfo(); as user) {
          <p>
            <button type="button" (click)="logout()">Sair</button>
            <button type="button" (click)="showRoles()">Mostrar Roles</button>
          </p>

          <section aria-labelledby="user-info-title">
            <h2 id="user-info-title">Informações do Usuário</h2>

            <app-info-field label="Nome" [value]="user.name" />
            <app-info-field label="Username" [value]="user.username" />
            <app-info-field label="E-mail" [value]="user.email" />
          </section>
        }
      } @else {
        <p>
          <button type="button" (click)="login()">Entrar</button>
        </p>
      }
    </main>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HomePage {
  private readonly authState = inject(AuthStateService);
  private readonly keycloakAuth = inject(KeycloakAuthService);
  private readonly router = inject(Router);

  protected readonly userInfo = this.authState.userInfo;
  protected readonly isAuthenticated = this.authState.isAuthenticated;

  /**
   * Inicia o fluxo de login no Keycloak.
   */
  protected login(): Promise<void> {
    return this.keycloakAuth.login();
  }

  /**
   * Inicia o fluxo de logout no Keycloak.
   */
  protected logout(): Promise<void> {
    return this.keycloakAuth.logout();
  }

  /**
   * Navega para a tela temporária de debug das Realm Roles.
   */
  protected showRoles(): Promise<boolean> {
    return this.router.navigate(['/permissions']);
  }
}
