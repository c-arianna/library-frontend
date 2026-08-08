import { Routes } from '@angular/router';
import { authGuard } from './core/guards/auth.guard';
import { UserDetailComponent } from './features/users/user-detail/user-detail';
import { OperatorsComponent } from './features/operators/operators';

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
    path: 'loans',
    canActivate: [authGuard],
    loadComponent: () => import('./features/loans/loans').then(m => m.LoansComponent)
  },
  {
    path: 'loans/:loanId',
    canActivate: [authGuard],
    loadComponent: () => import('./features/loans/loan-detail/loan-detail').then(m => m.LoanDetailComponent)
  },
  {
    path: 'users',
    loadComponent: () => import('./features/users/users').then(c => c.UsersComponent),
    canActivate: [authGuard],
    data: {
      roles: ['ROLE_ADMIN', 'ROLE_LIBRARIAN']
    }
  },
  {
    path: 'users/:userId',
    loadComponent: () => import('./features/users/user-detail/user-detail').then(c => c.UserDetailComponent),
    canActivate: [authGuard],
    data: {
      roles: ['ROLE_ADMIN', 'ROLE_LIBRARIAN']
    }
  },
  {
    path: 'profile',
    loadComponent: () => import('./features/users/user-detail/user-detail').then(c => c.UserDetailComponent),
    canActivate: [authGuard],
    data: {
      roles: ['ROLE_READER']
    }
  },
  {
    path: 'operators',
    loadComponent: () => import('./features/operators/operators').then(c => c.OperatorsComponent),
    canActivate: [authGuard],
    data: {
      roles: ['ROLE_ADMIN']
    },
  },
  {
    path: 'admin/dashboard',
    loadComponent: () => import('./features/dashboard/admin-dashboard/admin-dashboard').then(c => c.AdminDashboardComponent),
    canActivate: [authGuard],
    data: {
      roles: ['ROLE_ADMIN', 'ROLE_LIBRARIAN']
    },
  },
  {
    path: 'admin/dashboard/daily-loan-statistics',
    loadComponent: () => import('./features/dashboard/daily-loan-statistics/daily-loan-statistics').then(c => c.DailyLoanStatisticsComponent),
    canActivate: [authGuard],
    data: {
      roles: ['ROLE_ADMIN', 'ROLE_LIBRARIAN']
    },
  },
  {
    path: 'admin/dashboard/overdue-loans',
    loadComponent: () => import('./features/dashboard/overdue-loans/overdue-loans').then(c => c.OverdueLoansComponent),
    canActivate: [authGuard],
    data: {
      roles: ['ROLE_ADMIN', 'ROLE_LIBRARIAN']
    },
  },
  {
    path: 'admin/dashboard/user-loan-statistics',
    loadComponent: () => import('./features/dashboard/user-loan-statistics/user-loan-statistics').then(c => c.UserLoanStatisticsComponent),
    canActivate: [authGuard],
    data: {
      roles: ['ROLE_ADMIN', 'ROLE_LIBRARIAN']
    },
  },
  {
    path: 'admin/dashboard/popular-books',
    loadComponent: () => import('./features/dashboard/popular-books/popular-books').then(c => c.PopularBooksComponent),
    canActivate: [authGuard],
    data: {
      roles: ['ROLE_ADMIN', 'ROLE_LIBRARIAN']
    },
  },
  {
    path: 'book-requests',
    loadComponent: () => import('./features/book-requests/book.requests').then(c => c.BookRequestsComponent),
    canActivate: [authGuard]
  },
  {
    path: 'book-requests/:requestId',
    loadComponent: () => import('./features/book-requests/book-request-detail/book-request-detail').then(c => c.BookRequestDetailComponent),
    canActivate: [authGuard]
  },
  {
    path: '',
    redirectTo: 'home',
    pathMatch: 'full'
  }

];