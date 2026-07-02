import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core';
import { RouterLink } from '@angular/router';

import { AuthService } from '../../security/auth/auth.service';
import { PermissionService } from '../../security/authorization/permission.service';

/**
 * Página temporária para visualizar as Realm Roles extraídas do Access Token.
 */
@Component({
  selector: 'app-permission-debug',
  imports: [RouterLink],
  template: `
    <main>
      <h1>Permissões</h1>

      <p>
        <strong>Usuário:</strong>
        <span>{{ username() }}</span>
      </p>

      <p>--------------------</p>

      <section aria-labelledby="roles-title">
        <h2 id="roles-title">Roles</h2>

        @if (roles().length > 0) {
          <ul>
            @for (role of roles(); track role) {
              <li>{{ role }}</li>
            }
          </ul>
        } @else {
          <p>Nenhuma role encontrada no Access Token.</p>
        }
      </section>

      <p>
        <a routerLink="/">Voltar</a>
      </p>
    </main>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PermissionDebugComponent {
  private readonly authService = inject(AuthService);
  private readonly permissionService = inject(PermissionService);

  protected readonly username = computed(() => this.authService.userInfo()?.username ?? '-');

  /**
   * Lê as Realm Roles do Access Token via PermissionService.
   * O serviço usa tokenParsed.realm_access.roles, que é a claim padrão de roles de realm.
   */
  protected readonly roles = computed(() => {
    this.authService.userInfo();

    return this.permissionService.getRoles();
  });
}
