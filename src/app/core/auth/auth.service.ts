import { Injectable } from '@angular/core';
import Keycloak from 'keycloak-js';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private keycloak: Keycloak;

  private initPromise!: Promise<boolean>;

  constructor() {
    this.keycloak = new Keycloak({
      url: 'http://localhost:8084',
      realm: 'library-microservices',
      clientId: 'library-frontend'
    });
  }

  async init(): Promise<boolean> {
    this.initPromise = this.keycloak.init({
      onLoad: 'check-sso',
      checkLoginIframe: false
    });

    return this.initPromise;
  }

 login(redirectUri?: string, options?: any) {
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

  getParsedToken(): any {
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