import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterLink } from '@angular/router';

/**
 * Página protegida pela Realm Role FINANCEIRO.
 */
@Component({
  selector: 'app-financeiro-page',
  imports: [RouterLink],
  template: `
    <main>
      <h1>Financeiro</h1>
      <p>Módulo financeiro acessível somente para usuários com a role FINANCEIRO.</p>
      <a routerLink="/">Voltar</a>
    </main>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FinanceiroPage {}
