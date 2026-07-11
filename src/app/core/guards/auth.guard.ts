import { CanActivateFn } from '@angular/router';
import { inject } from '@angular/core';
import { AuthService } from '../auth/auth.service';
import { Router } from '@angular/router';

export const authGuard: CanActivateFn = async (route, state) => {

  const auth = inject(AuthService);
  const router = inject(Router);

  await auth.getInitPromise();
  
  if (!auth.isLoggedIn()) {
    router.navigate(['/register']);
    return false;
  }

  const requiredRoles = route.data?.['roles'] as string[] | undefined;

  if (!requiredRoles || requiredRoles.length === 0) {
    return true;
  }

  const userRoles = (auth.getParsedToken()?.['realm_access']?.['roles']) || [];

  const hasRole = requiredRoles.some(role => userRoles.includes(role));

  if (!hasRole) {
    return router.createUrlTree(['/home']);
  }

  return true;
};