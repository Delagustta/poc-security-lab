import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterLink } from '@angular/router';

/**
 * Página protegida apenas por autenticação.
 */
@Component({
  selector: 'app-profile-page',
  imports: [RouterLink],
  template: `
    <main>
      <h1>Perfil</h1>
      <p>Módulo de perfil do usuário autenticado.</p>
      <a routerLink="/">Voltar</a>
    </main>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProfilePage {}
