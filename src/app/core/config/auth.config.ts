import { environment } from '../../../environments/environment';

export const AUTH_CONFIG = {
  url: environment.keycloak.url,
  realm: environment.keycloak.realm,
  clientId: environment.keycloak.clientId
};