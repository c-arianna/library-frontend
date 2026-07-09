import { KeycloakTokenParsed } from "keycloak-js";

export interface TokenDto extends KeycloakTokenParsed {

  preferred_username?: string;

  realm_access?: {
    roles: string[];
  };

}