import Keycloak from 'keycloak-js';

export const keycloak = new Keycloak({
  url: 'http://localhost:8084',
  realm: 'library-microservices',
  clientId: 'library-frontend'
});

export async function initKeycloak() {
  await keycloak.init({
    onLoad: 'check-sso',
    checkLoginIframe: false
  });
}