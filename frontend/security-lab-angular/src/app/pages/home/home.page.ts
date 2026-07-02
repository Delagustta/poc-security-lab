import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core';
import { RouterLink } from '@angular/router';

import { AuthService } from '../../security/auth/auth.service';
import { PermissionService } from '../../security/authorization/permission.service';
import { KeycloakService } from '../../security/keycloak/keycloak.service';

/**
 * Página inicial do laboratório.
 * Ela apresenta as ações de autenticação e os dados básicos retornados pelo Keycloak.
 */
@Component({
  selector: 'app-home-page',
  imports: [RouterLink],
  template: `
    <main>
      <h1>Security Lab</h1>

      @if (isAuthenticated()) {
        @if (userInfo(); as user) {
          <nav class="main-menu" aria-label="Menu principal">
            <div class="menu-links">
              <a routerLink="/dashboard">Dashboard</a>

              @if (canAccessFinanceiro()) {
                <a routerLink="/financeiro">Financeiro</a>
              }

              @if (canAccessAdministracao()) {
                <a routerLink="/administracao">Administração</a>
              }

              <a routerLink="/perfil">Perfil</a>
              <a routerLink="/debug">Mostrar Roles</a>
            </div>
            <button type="button" (click)="logout()">Logout</button>
          </nav>

          <section aria-labelledby="user-info-title">
            <h2 id="user-info-title">Informações do Usuário</h2>

            <p>
              <strong>Nome:</strong>
              <span>{{ user.name }}</span>
            </p>
            <p>
              <strong>Username:</strong>
              <span>{{ user.username }}</span>
            </p>
            <p>
              <strong>E-mail:</strong>
              <span>{{ user.email }}</span>
            </p>
          </section>
        }
      } @else {
        <p>
          <button type="button" (click)="login()">Entrar</button>
        </p>
      }
    </main>
  `,
  styles: `
    .main-menu {
      display: flex;
      flex-wrap: wrap;
      gap: 12px;
      align-items: center;
      margin-bottom: 24px;
    }

    .menu-links {
      display: flex;
      flex-wrap: wrap;
      gap: 12px;
      align-items: center;
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HomePage {
  private readonly authService = inject(AuthService);
  private readonly keycloakService = inject(KeycloakService);
  private readonly permissionService = inject(PermissionService);

  protected readonly userInfo = this.authService.userInfo;
  protected readonly isAuthenticated = this.authService.isAuthenticated;
  protected readonly canAccessFinanceiro = computed(() => {
    this.userInfo();

    return this.permissionService.hasRole('FINANCEIRO');
  });
  protected readonly canAccessAdministracao = computed(() => {
    this.userInfo();

    return this.permissionService.hasRole('ADMIN');
  });

  /**
   * Inicia o fluxo de login no Keycloak.
   */
  protected login(): Promise<void> {
    return this.keycloakService.login();
  }

  /**
   * Inicia o fluxo de logout no Keycloak.
   */
  protected logout(): Promise<void> {
    return this.keycloakService.logout();
  }
}
