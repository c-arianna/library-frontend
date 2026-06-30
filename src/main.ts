import { bootstrapApplication } from '@angular/platform-browser';
import { provideHttpClient, withInterceptors } from '@angular/common/http';

import { AppComponent } from './app/app';
import { initKeycloak } from './app/core/auth/keycloak.service';
import { errorInterceptor } from './app/core/interceptors/error-interceptor';
import { authInterceptor } from './app/core/interceptors/auth-interceptor';
import { routes } from './app/app.routes';
import { provideRouter } from '@angular/router';

initKeycloak().then(() => {
  bootstrapApplication(AppComponent, {
    providers: [
      provideRouter(routes),
      provideHttpClient(
        withInterceptors([authInterceptor, errorInterceptor])
      )
    ]
  });
});