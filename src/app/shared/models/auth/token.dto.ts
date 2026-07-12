import { KeycloakTokenParsed } from "keycloak-js";

export interface TokenDto extends KeycloakTokenParsed {

  name?: string;

  realm_access?: {
    roles: string[];
  };

}