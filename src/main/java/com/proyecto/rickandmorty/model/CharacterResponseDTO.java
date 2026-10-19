package com.proyecto.rickandmorty.model;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import java.util.List;

@JsonIgnoreProperties(ignoreUnknown = true)
public class CharacterResponseDTO {

    private List<CharacterDTO> results;

    public CharacterResponseDTO() {
    }

    public List<CharacterDTO> getResults() {
        return results;
    }

    public void setResults(List<CharacterDTO> results) {
        this.results = results;
    }
}

