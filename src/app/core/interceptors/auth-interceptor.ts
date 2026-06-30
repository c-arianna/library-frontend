import { HttpInterceptorFn } from '@angular/common/http';
import { from, EMPTY } from 'rxjs';
import { switchMap, catchError } from 'rxjs/operators';
import { keycloak } from '../auth/keycloak.service';

let isRedirecting = false;

export const authInterceptor: HttpInterceptorFn = (req, next) => {

  const publicUrls = ['/users/subscribe'];

  if (publicUrls.some(url => req.url.includes(url))) {
    return next(req);
  }

  return from(keycloak.updateToken(30)).pipe(

    switchMap(() => {

      const token = keycloak.token;

      const request = token
        ? req.clone({
            setHeaders: {
              Authorization: `Bearer ${token}`
            }
          })
        : req;

      return next(request);
    }),

    catchError((err) => {

      console.warn('Errore refresh token:', err);

      if (!isRedirecting) {
        isRedirecting = true;

        console.warn('Sessione scaduta → redirect login');

        keycloak.login().finally(() => {
          isRedirecting = false;
        });
      }
      
      return EMPTY;
    })
  );
};