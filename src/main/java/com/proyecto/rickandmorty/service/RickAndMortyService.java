package com.proyecto.rickandmorty.service;

import com.proyecto.rickandmorty.model.CharacterDTO;
import com.proyecto.rickandmorty.model.CharacterResponseDTO;
import com.proyecto.rickandmorty.model.EpisodeDTO;
import com.proyecto.rickandmorty.model.LocationDTO;
import com.proyecto.rickandmorty.model.PersonajeConsolidadoDTO;
import org.springframework.stereotype.Service;
import org.springframework.web.client.HttpClientErrorException;
import org.springframework.web.client.RestTemplate;
import org.springframework.web.util.UriComponentsBuilder;

import java.net.URI;
import java.util.ArrayList;
import java.util.Collections;
import java.util.List;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;

@Service
public class RickAndMortyService {

    private static final String CHARACTER_API_URL = "https://rickandmortyapi.com/api/character/";
    private final RestTemplate restTemplate;
    private final Map<String, LocationDTO> locationCache = new ConcurrentHashMap<>();
    private final Map<String, EpisodeDTO> episodeCache = new ConcurrentHashMap<>();

    public RickAndMortyService() {
        this.restTemplate = new RestTemplate();
    }

    /**
     * API Composition: Encadena las 3 peticiones con RestTemplate para cada personaje encontrado:
     * 1. GET /character/?name=X
     * 2. GET a location.url para extraer la dimensión
     * 3. GET a episode[0] para extraer el nombre del primer episodio
     */
    public List<PersonajeConsolidadoDTO> buscarPersonajesConsolidados(String nombre) {
        try {
            UriComponentsBuilder builder = UriComponentsBuilder.fromUriString(CHARACTER_API_URL);
            if (nombre != null && !nombre.isBlank()) {
                builder.queryParam("name", nombre.trim());
            }
            URI characterUri = builder.build().encode().toUri();

            // 1. Primera petición: Obtener lista de personajes desde /character/?name=X
            CharacterResponseDTO characterResponse = restTemplate.getForObject(characterUri, CharacterResponseDTO.class);
            if (characterResponse == null || characterResponse.getResults() == null || characterResponse.getResults().isEmpty()) {
                return Collections.emptyList();
            }

            List<PersonajeConsolidadoDTO> listaConsolidada = new ArrayList<>();

            for (CharacterDTO personaje : characterResponse.getResults()) {
                // 2. Segunda petición: Extraer location.url y consultar la dimensión
                String locationName = "Desconocida";
                String dimension = "Dimensión desconocida";

                if (personaje.getLocation() != null) {
                    if (personaje.getLocation().getName() != null && !personaje.getLocation().getName().isBlank()) {
                        locationName = personaje.getLocation().getName();
                    }
                    String locationUrl = personaje.getLocation().getUrl();
                    if (locationUrl != null && !locationUrl.isBlank()) {
                        try {
                            LocationDTO locationDTO = locationCache.computeIfAbsent(
                                    locationUrl,
                                    url -> restTemplate.getForObject(url, LocationDTO.class)
                            );
                            if (locationDTO != null) {
                                if (locationDTO.getDimension() != null && !locationDTO.getDimension().isBlank()) {
                                    dimension = locationDTO.getDimension();
                                }
                                if (locationDTO.getName() != null && !locationDTO.getName().isBlank()) {
                                    locationName = locationDTO.getName();
                                }
                            }
                        } catch (Exception ignored) {
                        }
                    }
                }

                // 3. Tercera petición: Extraer episode[0] y consultar el nombre del primer episodio
                String firstEpisodeName = "Episodio desconocido";
                String firstEpisodeCode = "N/A";

                if (personaje.getEpisode() != null && !personaje.getEpisode().isEmpty()) {
                    String firstEpisodeUrl = personaje.getEpisode().get(0);
                    if (firstEpisodeUrl != null && !firstEpisodeUrl.isBlank()) {
                        try {
                            EpisodeDTO episodeDTO = episodeCache.computeIfAbsent(
                                    firstEpisodeUrl,
                                    url -> restTemplate.getForObject(url, EpisodeDTO.class)
                            );
                            if (episodeDTO != null) {
                                if (episodeDTO.getName() != null && !episodeDTO.getName().isBlank()) {
                                    firstEpisodeName = episodeDTO.getName();
                                }
                                if (episodeDTO.getEpisode() != null && !episodeDTO.getEpisode().isBlank()) {
                                    firstEpisodeCode = episodeDTO.getEpisode();
                                }
                            }
                        } catch (Exception ignored) {
                        }
                    }
                }

                // 4. Agregar el objeto DTO consolidado a la lista
                listaConsolidada.add(new PersonajeConsolidadoDTO(
                        personaje.getId(),
                        personaje.getName(),
                        personaje.getSpecies(),
                        personaje.getImage(),
                        locationName,
                        dimension,
                        firstEpisodeName,
                        firstEpisodeCode
                ));
            }

            return listaConsolidada;

        } catch (HttpClientErrorException.NotFound e) {
            return Collections.emptyList();
        }
    }
}
