package com.proyecto.rickandmorty.model;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import java.util.List;

@JsonIgnoreProperties(ignoreUnknown = true)
public class CharacterDTO {

    private Integer id;
    private String name;
    private String species;
    private String image;
    private LocationReferenceDTO origin;
    private LocationReferenceDTO location;
    private List<String> episode;

    public CharacterDTO() {
    }

    public Integer getId() {
        return id;
    }

    public void setId(Integer id) {
        this.id = id;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getSpecies() {
        return species;
    }

    public void setSpecies(String species) {
        this.species = species;
    }

    public String getImage() {
        return image;
    }

    public void setImage(String image) {
        this.image = image;
    }

    public LocationReferenceDTO getOrigin() {
        return origin;
    }

    public void setOrigin(LocationReferenceDTO origin) {
        this.origin = origin;
    }

    public LocationReferenceDTO getLocation() {
        return location;
    }

    public void setLocation(LocationReferenceDTO location) {
        this.location = location;
    }

    public List<String> getEpisode() {
        return episode;
    }

    public void setEpisode(List<String> episode) {
        this.episode = episode;
    }

    @JsonIgnoreProperties(ignoreUnknown = true)
    public static class LocationReferenceDTO {
        private String name;
        private String url;

        public LocationReferenceDTO() {
        }

        public String getName() {
            return name;
        }

        public void setName(String name) {
            this.name = name;
        }

        public String getUrl() {
            return url;
        }

        public void setUrl(String url) {
            this.url = url;
        }
    }
}

