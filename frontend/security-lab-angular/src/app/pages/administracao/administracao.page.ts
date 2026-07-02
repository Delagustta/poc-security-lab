import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterLink } from '@angular/router';

/**
 * Página protegida pela Realm Role ADMIN.
 */
@Component({
  selector: 'app-administracao-page',
  imports: [RouterLink],
  template: `
    <main>
      <h1>Administração</h1>
      <p>Módulo administrativo acessível somente para usuários com a role ADMIN.</p>
      <a routerLink="/">Voltar</a>
    </main>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AdministracaoPage {}
