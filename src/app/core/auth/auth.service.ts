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

  isLoggedIn(): boolean {
    return !!this.keycloak.authenticated;
  }

  getUsername(): string {
    return this.keycloak.tokenParsed?.['preferred_username'] || '';
  }

  getToken(): string | undefined {
    return this.keycloak.token;
  }

  updateToken(minValidity: number): Promise<boolean> {
    return this.keycloak.updateToken(minValidity);
  }

  getParsedToken(): KeycloakTokenParsed | undefined {
    return this.keycloak.tokenParsed;
  }

  isInitialized(): boolean {
    return !!this.keycloak.authenticated || !!this.keycloak.token;
  }

  getInitPromise(): Promise<boolean> {
    return this.initPromise;
  }

  getUserRoles(): string[] {
    const token = this.keycloak.tokenParsed;
    return !token ? [] : token['realm_access']?.roles || [];
 }

}