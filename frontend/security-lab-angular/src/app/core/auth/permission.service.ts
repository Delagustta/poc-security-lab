import { inject, Injectable } from '@angular/core';

import { KeycloakAuthService } from './keycloak-auth.service';

/**
 * Representa a estrutura da claim realm_access presente no Access Token.
 */
interface RealmAccess {
  readonly roles: readonly string[];
}

/**
 * Representa apenas a parte do token parseado que a aplicação precisa para autorização.
 */
interface ParsedToken {
  readonly realm_access?: RealmAccess;
}

/**
 * Centraliza consultas de autorização baseadas nas Realm Roles do Access Token.
 */
@Injectable({
  providedIn: 'root',
})
export class PermissionService {
  private readonly keycloakAuth = inject(KeycloakAuthService);

  /**
   * Verifica se o usuário possui uma role específica no realm.
   */
  hasRole(role: string): boolean {
    return this.getNormalizedRoles().includes(this.normalizeRole(role));
  }

  /**
   * Verifica se o usuário possui pelo menos uma das roles informadas.
   */
  hasAnyRole(roles: string[]): boolean {
    const normalizedRoles = this.getNormalizedRoles();

    return roles.some((role) => normalizedRoles.includes(this.normalizeRole(role)));
  }

  /**
   * Verifica se o usuário possui todas as roles informadas.
   */
  hasAllRoles(roles: string[]): boolean {
    const normalizedRoles = this.getNormalizedRoles();

    return roles.every((role) => normalizedRoles.includes(this.normalizeRole(role)));
  }

  /**
   * Retorna as Realm Roles do Access Token em maiúsculo para exibição e comparação.
   */
  getRoles(): string[] {
    return this.getNormalizedRoles();
  }

  /**
   * Extrai realm_access.roles do token parseado pelo keycloak-js.
   * O token é validado antes do acesso para manter tipagem estrita e evitar any.
   */
  private getParsedToken(): ParsedToken | null {
    const token = this.keycloakAuth.getParsedToken();

    return this.isParsedToken(token) ? token : null;
  }

  /**
   * Type guard que garante que a claim realm_access.roles possui a estrutura esperada.
   */
  private isParsedToken(token: unknown): token is ParsedToken {
    if (!this.isRecord(token)) {
      return false;
    }

    const realmAccess = token['realm_access'];

    if (realmAccess === undefined) {
      return true;
    }

    return this.isRealmAccess(realmAccess);
  }

  /**
   * Type guard específico para validar a lista de roles do realm.
   */
  private isRealmAccess(realmAccess: unknown): realmAccess is RealmAccess {
    if (!this.isRecord(realmAccess)) {
      return false;
    }

    const roles = realmAccess['roles'];

    return Array.isArray(roles) && roles.every((role) => typeof role === 'string');
  }

  /**
   * Garante acesso seguro a propriedades dinâmicas de objetos desconhecidos.
   */
  private isRecord(value: unknown): value is Record<string, unknown> {
    return typeof value === 'object' && value !== null;
  }

  /**
   * Normaliza as roles para o mesmo formato usado na tela: maiúsculas.
   */
  private getNormalizedRoles(): string[] {
    return this.getParsedToken()?.realm_access?.roles.map((role) => this.normalizeRole(role)) ?? [];
  }

  /**
   * Remove espaços e converte para maiúsculo para tornar comparações previsíveis.
   */
  private normalizeRole(role: string): string {
    return role.trim().toUpperCase();
  }
}
