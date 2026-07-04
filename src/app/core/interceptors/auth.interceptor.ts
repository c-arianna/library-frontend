import { HttpInterceptorFn } from '@angular/common/http';
import { from, EMPTY } from 'rxjs';
import { switchMap, catchError } from 'rxjs/operators';
import { inject } from '@angular/core';
import { AuthService } from '../auth/auth.service';

export const authInterceptor: HttpInterceptorFn = (req, next) => {

  const auth = inject(AuthService);

  const publicUrls = ['/users/subscribe'];

  if (publicUrls.some(url => req.url.includes(url))) {
    return next(req);
  }

  if (req.url.includes('/realms/')) {
    return next(req);
  }

  const token = auth.getToken();
  if (!token) {
    return next(req);
  }

  return from(auth.updateToken(5)).pipe(

    switchMap(() => {

      const updatedToken = auth.getToken();

      const request = req.clone({
        setHeaders: {
          Authorization: `Bearer ${updatedToken}`
        }
      });

      return next(request);
    }),

    catchError((err) => {
      console.warn('Errore refresh token:', err);
      return next(req);
    })
  );
};