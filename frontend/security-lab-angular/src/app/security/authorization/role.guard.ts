import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';

import { PermissionService } from './permission.service';

/**
 * Bloqueia rotas que exigem uma Realm Role específica.
 * A role esperada deve ser informada em route.data.role.
 */
export const roleGuard: CanActivateFn = (route) => {
  const permissionService = inject(PermissionService);
  const router = inject(Router);
  const role = route.data['role'];

  if (typeof role !== 'string') {
    return router.parseUrl('/');
  }

  return permissionService.hasRole(role) || router.parseUrl('/');
};
