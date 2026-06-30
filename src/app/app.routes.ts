import { Routes } from '@angular/router';

export const routes: Routes = [

  {
    path: 'register',
    loadComponent: () =>
      import('./features/auth/pages/register-page/register-page')
        .then(m => m.RegisterPage)
  },

  {
    path: '',
    redirectTo: 'register',
    pathMatch: 'full'
  }

];