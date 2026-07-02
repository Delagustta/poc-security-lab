import { Routes } from '@angular/router';

import { authGuard } from './security/auth/auth.guard';
import { roleGuard } from './security/authorization/role.guard';
import { AdministracaoPage } from './pages/administracao/administracao.page';
import { DashboardPage } from './pages/dashboard/dashboard.page';
import { PermissionDebugComponent } from './pages/debug/permission-debug.component';
import { FinanceiroPage } from './pages/financeiro/financeiro.page';
import { HomePage } from './pages/home/home.page';
import { ProfilePage } from './pages/profile/profile.page';

export const routes: Routes = [
  {
    path: '',
    component: HomePage,
  },
  {
    path: 'dashboard',
    component: DashboardPage,
    canActivate: [authGuard],
  },
  {
    path: 'financeiro',
    component: FinanceiroPage,
    canActivate: [authGuard, roleGuard],
    data: {
      role: 'FINANCEIRO',
    },
  },
  {
    path: 'administracao',
    component: AdministracaoPage,
    canActivate: [authGuard, roleGuard],
    data: {
      role: 'ADMIN',
    },
  },
  {
    path: 'perfil',
    component: ProfilePage,
    canActivate: [authGuard],
  },
  {
    path: 'debug',
    component: PermissionDebugComponent,
  },
];
