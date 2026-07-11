import { bootstrapApplication } from '@angular/platform-browser';
import { provideHttpClient, withInterceptors } from '@angular/common/http';

import { AppComponent } from './app/app';
import { errorInterceptor } from './app/core/interceptors/error.interceptor';
import { authInterceptor } from './app/core/interceptors/auth.interceptor';
import { routes } from './app/app.routes';
import { provideRouter } from '@angular/router';
import { AuthService } from './app/core/auth/auth.service';
import { provideNativeDateAdapter } from '@angular/material/core';
import { registerLocaleData } from '@angular/common';
import localeIt from '@angular/common/locales/it';
import { LOCALE_ID } from '@angular/core';

registerLocaleData(localeIt);

const authService = new AuthService();

authService.init().then(() => {
  bootstrapApplication(AppComponent, {
    providers: [
      provideRouter(routes),
      provideHttpClient(
        withInterceptors([authInterceptor, errorInterceptor])
      ),
      provideNativeDateAdapter(),
      { provide: AuthService, useValue: authService },
      { provide: LOCALE_ID, useValue: 'it-IT' },
    ]
  });
});