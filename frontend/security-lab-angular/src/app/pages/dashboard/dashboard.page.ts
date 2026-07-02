import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterLink } from '@angular/router';

/**
 * Página protegida apenas por autenticação.
 */
@Component({
  selector: 'app-dashboard-page',
  imports: [RouterLink],
  template: `
    <main>
      <h1>Dashboard</h1>
      <p>Módulo inicial para informações gerais do usuário autenticado.</p>
      <a routerLink="/">Voltar</a>
    </main>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DashboardPage {}
