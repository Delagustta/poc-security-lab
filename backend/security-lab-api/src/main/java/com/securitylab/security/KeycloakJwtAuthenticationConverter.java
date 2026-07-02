package com.securitylab.security;

import org.springframework.core.convert.converter.Converter;
import org.springframework.security.authentication.AbstractAuthenticationToken;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.security.oauth2.server.resource.authentication.JwtAuthenticationConverter;

import java.util.Collection;
import java.util.List;
import java.util.Locale;
import java.util.Map;

/**
 * Converte um JWT validado pelo Resource Server em uma autenticação do Spring Security.
 * A classe não depende de bibliotecas do Keycloak; ela apenas lê claims em formato JSON.
 */
public class KeycloakJwtAuthenticationConverter implements Converter<Jwt, AbstractAuthenticationToken> {

    private static final String CLIENT_ID = "security-lab-angular";
    private static final String RESOURCE_ACCESS_CLAIM = "resource_access";
    private static final String ROLES_CLAIM = "roles";
    private static final String ROLE_PREFIX = "ROLE_";

    private final JwtAuthenticationConverter delegate = new JwtAuthenticationConverter();

    /**
     * Reaproveita o JwtAuthenticationConverter padrão do Spring e customiza apenas a origem das authorities.
     * Assim mantemos o fluxo moderno do Spring Security e alteramos somente o mapeamento das roles do token.
     */
    public KeycloakJwtAuthenticationConverter() {
        delegate.setJwtGrantedAuthoritiesConverter(this::extractAuthorities);
    }

    /**
     * Converte o JWT em AbstractAuthenticationToken usando o converter padrão configurado acima.
     */
    @Override
    public AbstractAuthenticationToken convert(Jwt jwt) {
        return delegate.convert(jwt);
    }

    /**
     * Lê resource_access porque as Client Roles vêm agrupadas por client nesse claim.
     */
    private Collection<GrantedAuthority> extractAuthorities(Jwt jwt) {
        Object resourceAccessClaim = jwt.getClaim(RESOURCE_ACCESS_CLAIM);

        if (!(resourceAccessClaim instanceof Map<?, ?> resourceAccess)) {
            return List.of();
        }

        return extractClientRoles(resourceAccess);
    }

    /**
     * Considera somente o client da POC para evitar misturar roles de outros clients presentes no token.
     */
    private Collection<GrantedAuthority> extractClientRoles(Map<?, ?> resourceAccess) {
        Object clientAccessClaim = resourceAccess.get(CLIENT_ID);

        if (!(clientAccessClaim instanceof Map<?, ?> clientAccess)) {
            return List.of();
        }

        Object rolesClaim = clientAccess.get(ROLES_CLAIM);

        if (!(rolesClaim instanceof Collection<?> roles)) {
            return List.of();
        }

        return roles.stream()
                .filter(String.class::isInstance)
                .map(String.class::cast)
                .map(String::trim)
                .filter(role -> !role.isBlank())
                .map(this::toAuthority)
                .toList();
    }

    /**
     * Converte roles como "user" e "admin" para o padrão esperado por hasRole: ROLE_USER e ROLE_ADMIN.
     */
    private GrantedAuthority toAuthority(String role) {
        return new SimpleGrantedAuthority(ROLE_PREFIX + role.toUpperCase(Locale.ROOT));
    }
}
