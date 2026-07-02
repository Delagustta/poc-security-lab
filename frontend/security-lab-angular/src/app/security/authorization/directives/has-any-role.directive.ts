import { Directive, TemplateRef, ViewContainerRef, effect, inject, input } from '@angular/core';

import { PermissionService } from '../permission.service';

/**
 * Exibe o template quando o usuário possui pelo menos uma das Realm Roles informadas.
 */
@Directive({
  selector: '[appHasAnyRole]',
})
export class HasAnyRoleDirective {
  readonly appHasAnyRole = input.required<string[]>();

  private readonly permissionService = inject(PermissionService);
  private readonly templateRef = inject(TemplateRef<unknown>);
  private readonly viewContainerRef = inject(ViewContainerRef);
  private hasView = false;

  constructor() {
    effect(() => {
      this.updateView(this.permissionService.hasAnyRole(this.appHasAnyRole()));
    });
  }

  /**
   * Cria ou remove a view conforme ao menos uma role esteja presente no Access Token.
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
