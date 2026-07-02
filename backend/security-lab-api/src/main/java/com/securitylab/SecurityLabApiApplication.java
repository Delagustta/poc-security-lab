package com.securitylab;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

/**
 * Ponto de entrada da API do laboratório.
 * O Spring Boot inicia o contexto da aplicação e carrega as configurações de segurança.
 */
@SpringBootApplication
public class SecurityLabApiApplication {

    /**
     * Inicializa a aplicação Spring Boot.
     */
    public static void main(String[] args) {
        SpringApplication.run(SecurityLabApiApplication.class, args);
    }
}
