import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';

import { AuthService } from './auth.service';

/**
 * Bloqueia rotas que exigem usuário autenticado.
 * Caso não haja autenticação, o usuário volta para a Home.
 */
export const authGuard: CanActivateFn = () => {
  const authService = inject(AuthService);
  const router = inject(Router);

  return authService.isAuthenticated() || router.parseUrl('/');
};
