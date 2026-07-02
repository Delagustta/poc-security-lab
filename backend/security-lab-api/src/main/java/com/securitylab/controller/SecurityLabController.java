package com.securitylab.controller;

import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

/**
 * Endpoints iniciais da POC para validar acesso público e acesso autenticado.
 * Roles são aplicadas nos endpoints /user e /admin por method security.
 */
@RestController
public class SecurityLabController {

    /**
     * Endpoint público usado para confirmar que a API responde sem token.
     */
    @GetMapping("/public")
    public String publicEndpoint() {
        return "Public endpoint";
    }

    /**
     * Endpoint que exige apenas um JWT válido emitido pelo Keycloak.
     */
    @GetMapping("/authenticated")
    public String authenticatedEndpoint() {
        return "Authenticated endpoint";
    }

    /**
     * Endpoint reservado para cenário de usuário.
     * Exige a role USER extraída das Client Roles do token.
     */
    @GetMapping("/user")
    @PreAuthorize("hasRole('USER')")
    public String userEndpoint() {
        return "User endpoint";
    }

    /**
     * Endpoint reservado para cenário administrativo.
     * Exige a role ADMIN extraída das Client Roles do token.
     */
    @GetMapping("/admin")
    @PreAuthorize("hasRole('ADMIN')")
    public String adminEndpoint() {
        return "Admin endpoint";
    }
}
