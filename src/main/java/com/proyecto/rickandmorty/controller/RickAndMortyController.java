package com.proyecto.rickandmorty.controller;

import com.proyecto.rickandmorty.model.PersonajeConsolidadoDTO;
import com.proyecto.rickandmorty.service.RickAndMortyService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/personaje")
@CrossOrigin(origins = "*")
public class RickAndMortyController {

    private final RickAndMortyService rickAndMortyService;

    public RickAndMortyController(RickAndMortyService rickAndMortyService) {
        this.rickAndMortyService = rickAndMortyService;
    }

    @GetMapping("/buscar")
    public ResponseEntity<List<PersonajeConsolidadoDTO>> buscarPersonaje(
            @RequestParam(value = "nombre", required = false, defaultValue = "") String nombre) {
        List<PersonajeConsolidadoDTO> consolidados = rickAndMortyService.buscarPersonajesConsolidados(nombre);
        return ResponseEntity.ok(consolidados);
    }
}
