import { Directive, Input, TemplateRef, ViewContainerRef } from '@angular/core';
import { AuthService } from '../auth/auth.service';

@Directive({
  selector: '[hasRole]',
  standalone: true
})
export class HasRoleDirective {

  private roles: string[] = [];

  constructor(private templateRef: TemplateRef<any>, private viewContainer: ViewContainerRef, private auth: AuthService) {}

  @Input()
  set hasRole(role: string | string[]) {

    this.roles = Array.isArray(role) ? role : [role];

    const userRoles = this.auth.getUserRoles();

    const hasAccess = this.roles.some(r => userRoles.includes(r));

    this.viewContainer.clear();

    if (hasAccess) {
      this.viewContainer.createEmbeddedView(this.templateRef);
    }
  }
}
