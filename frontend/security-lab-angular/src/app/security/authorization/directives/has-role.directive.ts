import { Directive, TemplateRef, ViewContainerRef, effect, inject, input } from '@angular/core';

import { PermissionService } from '../permission.service';

/**
 * Exibe o template apenas quando o usuário possui a Realm Role informada.
 */
@Directive({
  selector: '[appHasRole]',
})
export class HasRoleDirective {
  readonly appHasRole = input.required<string>();

  private readonly permissionService = inject(PermissionService);
  private readonly templateRef = inject(TemplateRef<unknown>);
  private readonly viewContainerRef = inject(ViewContainerRef);
  private hasView = false;

  constructor() {
    effect(() => {
      this.updateView(this.permissionService.hasRole(this.appHasRole()));
    });
  }

  /**
   * Cria ou remove a view conforme a role esteja presente no Access Token.
   */
  private updateView(canShow: boolean): void {
    if (canShow && !this.hasView) {
      this.viewContainerRef.createEmbeddedView(this.templateRef);
      this.hasView = true;
      return;
    }

    if (!canShow && this.hasView) {
      this.viewContainerRef.clear();
      this.hasView = false;
    }
  }
}
