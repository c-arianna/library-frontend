import { Routes } from '@angular/router';
import { authGuard } from './core/guards/auth.guard';

export const routes: Routes = [

  {
    path: 'home',
    canActivate: [authGuard],
    loadComponent: () =>
    import('./features/home/home').then(m => m.HomeComponent)
  },
  {
    path: 'register',
    loadComponent: () =>
      import('./features/auth/pages/register/register').then(m => m.RegisterPage)
  },
  {
    path: 'books',
    canActivate: [authGuard],
    loadComponent: () =>  import('./features/books/books').then(m => m.BooksComponent)
  },
  {
    path: 'books/:isbn',
    canActivate: [authGuard],
    loadComponent: () => import('./features/books/book-detail/book-detail').then(m => m.BookDetail)
  },
  {
    path: '',
    redirectTo: 'home',
    pathMatch: 'full'
  }

];