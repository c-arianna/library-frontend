import { signal } from '@angular/core';
import { Observable, finalize } from 'rxjs';
import { mapError } from '../../shared/utils/error.mapper';

export abstract class BaseFeatureStore {

  readonly loading = signal(false);

  readonly error = signal<string | null>(null);

  protected executeRequest<T>(request$: Observable<T>, onSuccess?: (result: T) => void) {

    this.loading.set(true);
    this.error.set(null);

    request$
      .pipe(
        finalize(() => {
          this.loading.set(false);
        })
      )
      .subscribe({
        next: result =>{
          onSuccess?.(result);
        },

        error: err => {
          const errorMessage = err instanceof Error ? err.message : mapError(err?.error?.code);
          this.error.set(errorMessage);
        }
      });

  }

}