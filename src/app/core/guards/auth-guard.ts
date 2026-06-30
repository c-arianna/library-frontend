import { CanActivateFn } from '@angular/router';
import { keycloak } from '../auth/keycloak.service';

export const authGuard: CanActivateFn = (route, state) => {

  if (!keycloak.authenticated) {
    keycloak.login({redirectUri: window.location.origin + state.url});
    return false;
  }

  const requiredRoles = route.data?.['roles'] as string[] | undefined;

  if (!requiredRoles || requiredRoles.length === 0) {
    return true;
  }

  const userRoles = keycloak.tokenParsed?.realm_access?.roles || [];

  const hasRole = requiredRoles.some(role => userRoles.includes(role));

  if (!hasRole) {
    console.warn('Accesso negato: ruolo mancante');
    return false;
  }

  return true;
};