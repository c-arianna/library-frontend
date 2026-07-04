import { HttpInterceptorFn, HttpErrorResponse } from '@angular/common/http';
import { inject } from '@angular/core';
import { catchError, throwError } from 'rxjs';
import { mapError } from '../../shared/utils/error.mapper';
import { MatSnackBar } from '@angular/material/snack-bar';

export const errorInterceptor: HttpInterceptorFn = (req, next) => {

  const snack = inject(MatSnackBar);

  return next(req).pipe(

    catchError((error: HttpErrorResponse) => {

      let message = 'Errore imprevisto';

      if (error.error?.code) {
        message = mapError(error.error.code);
      }

      else if (error.status === 0) {
        message = 'Server non raggiungibile';
      }
      else if (error.status === 401) {
        message = 'Non autorizzato';
      }
      else if (error.status === 403) {
        message = 'Accesso negato';
      }
      else if (error.status === 500) {
        message = 'Errore interno server';
      }

      console.error('HTTP error:', error);

       snack.open(message, 'Chiudi', {
        duration: 3000,
        horizontalPosition: 'right',
        verticalPosition: 'top'
      });

      return throwError(() => new Error(message));
    })
  );
};