package com.proyecto.rickandmorty.controller;

import com.proyecto.rickandmorty.model.CharacterDTO;
import com.proyecto.rickandmorty.model.EpisodeDTO;
import com.proyecto.rickandmorty.model.LocationDTO;
import com.proyecto.rickandmorty.service.RickAndMortyService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api")
@CrossOrigin(origins = "*")
public class RickAndMortyController {

    private final RickAndMortyService rickAndMortyService;

    public RickAndMortyController(RickAndMortyService rickAndMortyService) {
        this.rickAndMortyService = rickAndMortyService;
    }

    @GetMapping("/personajes")
    public ResponseEntity<List<CharacterDTO>> obtenerPersonajes(
            @RequestParam(value = "name", required = false) String name) {
        List<CharacterDTO> personajes = rickAndMortyService.obtenerPersonajes(name);
        return ResponseEntity.ok(personajes);
    }

    @GetMapping("/ubicaciones/{id}")
    public ResponseEntity<LocationDTO> obtenerUbicacion(@PathVariable Integer id) {
        LocationDTO ubicacion = rickAndMortyService.obtenerUbicacionPorId(id);
        return ResponseEntity.ok(ubicacion);
    }

    @GetMapping("/episodios/{id}")
    public ResponseEntity<EpisodeDTO> obtenerEpisodio(@PathVariable Integer id) {
        EpisodeDTO episodio = rickAndMortyService.obtenerEpisodioPorId(id);
        return ResponseEntity.ok(episodio);
    }
}

