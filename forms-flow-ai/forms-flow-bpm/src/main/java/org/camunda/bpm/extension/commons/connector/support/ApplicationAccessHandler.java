package org.camunda.bpm.extension.commons.connector.support;

import com.google.gson.JsonObject;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.*;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.oauth2.server.resource.authentication.JwtAuthenticationToken;
import org.springframework.stereotype.Service;
import org.springframework.web.client.HttpClientErrorException;
import org.springframework.web.reactive.function.BodyInserters;
import org.springframework.web.reactive.function.client.WebClient;
import reactor.core.publisher.Mono;
import org.springframework.http.HttpMethod;
import org.springframework.http.ResponseEntity;
import com.fasterxml.jackson.core.JsonProcessingException;


import java.util.Map;


import static org.springframework.security.oauth2.client.web.reactive.function.client.ServerOAuth2AuthorizedClientExchangeFilterFunction.clientRegistrationId;


/**
 * Application Access Handler.
 * This class serves as gateway for all application service interactions.
 */
@Service("applicationAccessHandler")
public class ApplicationAccessHandler implements IAccessHandler {

    private final Logger LOGGER = LoggerFactory.getLogger(ApplicationAccessHandler.class);

    @Autowired
    private WebClient webClient;

    @Autowired
    private KeycloakServiceClientTokenService keycloakServiceClientTokenService;

    public ResponseEntity<String> exchange(String url, HttpMethod method, String payload) {

        payload = (payload == null) ? new JsonObject().toString() : payload;

        Mono<ResponseEntity<String>> entityMono = webClient.method(method).uri(url)
                .headers(h -> h.setBearerAuth(getUserBasedAccessToken()))
                .accept(MediaType.APPLICATION_JSON)
                .header(HttpHeaders.CONTENT_TYPE, MediaType.APPLICATION_JSON_VALUE)
                .body(Mono.just(payload), String.class)
                .retrieve()
                .toEntity(String.class);

        ResponseEntity<String> response = entityMono.block();
        return new ResponseEntity<>(response.getBody(), response.getStatusCode());
    }
    
    public String getUserBasedAccessToken() {

        String token = null;
        Authentication authentication =  SecurityContextHolder.getContext().getAuthentication();

        if (authentication instanceof JwtAuthenticationToken) {
            token = ((JwtAuthenticationToken)authentication).getToken().getTokenValue();
        }
        LOGGER.info("Token received from user session %s", token);
        if (token == null || token.isEmpty()) {
            try {
                token = keycloakServiceClientTokenService.getClientToken();
                LOGGER.info("Token received from service account %s", token);
            } catch (JsonProcessingException jpe) {
                throw new RuntimeException("Failed to retrieve access token from Keycloak", jpe);
            }
        }
        return token;
    }

}
