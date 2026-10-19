package com.proyecto.rickandmorty.service;

import com.proyecto.rickandmorty.model.CharacterDTO;
import com.proyecto.rickandmorty.model.CharacterResponseDTO;
import com.proyecto.rickandmorty.model.EpisodeDTO;
import com.proyecto.rickandmorty.model.LocationDTO;
import org.springframework.stereotype.Service;
import org.springframework.web.client.HttpClientErrorException;
import org.springframework.web.client.RestClient;
import org.springframework.web.util.UriComponentsBuilder;

import java.net.URI;
import java.util.Collections;
import java.util.List;

@Service
public class RickAndMortyService {

    private static final String BASE_URL = "https://rickandmortyapi.com/api";
    private final RestClient restClient;

    public RickAndMortyService() {
        this.restClient = RestClient.builder()
                .baseUrl(BASE_URL)
                .build();
    }

    public List<CharacterDTO> obtenerPersonajes(String name) {
        try {
            UriComponentsBuilder uriBuilder = UriComponentsBuilder.fromUriString(BASE_URL + "/character");
            if (name != null && !name.isBlank()) {
                uriBuilder.queryParam("name", name.trim());
            }
            URI uri = uriBuilder.build().encode().toUri();

            CharacterResponseDTO response = restClient.get()
                    .uri(uri)
                    .retrieve()
                    .body(CharacterResponseDTO.class);

            return (response != null && response.getResults() != null)
                    ? response.getResults()
                    : Collections.emptyList();
        } catch (HttpClientErrorException.NotFound e) {
            return Collections.emptyList();
        }
    }

    public LocationDTO obtenerUbicacionPorId(Integer id) {
        return restClient.get()
                .uri("/location/{id}", id)
                .retrieve()
                .body(LocationDTO.class);
    }

    public EpisodeDTO obtenerEpisodioPorId(Integer id) {
        return restClient.get()
                .uri("/episode/{id}", id)
                .retrieve()
                .body(EpisodeDTO.class);
    }
}

