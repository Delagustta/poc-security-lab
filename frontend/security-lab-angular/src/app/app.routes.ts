import { Routes } from '@angular/router';

import { HomePage } from './features/home/home.page';
import { PermissionDebugComponent } from './features/permissions/permission-debug.component';

export const routes: Routes = [
  {
    path: '',
    component: HomePage,
  },
  {
    path: 'permissions',
    component: PermissionDebugComponent,
  },
];
