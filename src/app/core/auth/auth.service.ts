import { Injectable } from '@angular/core';
import Keycloak, { KeycloakLoginOptions, KeycloakTokenParsed } from 'keycloak-js';
import { AUTH_CONFIG } from '../config/auth.config';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private keycloak: Keycloak;

  private initPromise!: Promise<boolean>;

  constructor() {
    this.keycloak = new Keycloak(AUTH_CONFIG);
  }

  async init(): Promise<boolean> {
    this.initPromise = this.keycloak.init({
      onLoad: 'check-sso',
      checkLoginIframe: false
    });

    return this.initPromise;
  }

 login(redirectUri?: string, options?: KeycloakLoginOptions) {
    const finalRedirect = redirectUri || window.location.origin;

    this.keycloak.login({
      redirectUri: finalRedirect,
      ...options
    });
 } 

  logout() {
    this.keycloak.logout({redirectUri: window.location.origin + '/register'
    });
  }

  isLoggedIn() {
    return !!this.keycloak.authenticated;
  }

  getName(): string {
    return this.keycloak.tokenParsed?.['name'] || '';
  }

  getToken() {
    return this.keycloak.token;
  }

  updateToken(minValidity: number) {
    return this.keycloak.updateToken(minValidity);
  }

  getParsedToken() {
    return this.keycloak.tokenParsed;
  }

  isInitialized() {
    return !!this.keycloak.authenticated || !!this.keycloak.token;
  }

  getInitPromise() {
    return this.initPromise;
  }

  getUserRoles() {
    const token = this.keycloak.tokenParsed;
    return !token ? [] : token['realm_access']?.roles || [];
  }

  hasRole(role: string){
    const userRoles = this.getUserRoles();
    return userRoles.includes(role);
  }
}