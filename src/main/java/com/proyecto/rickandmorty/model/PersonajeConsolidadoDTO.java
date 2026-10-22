package com.proyecto.rickandmorty.model;

public class PersonajeConsolidadoDTO {

    private Integer id;
    private String name;
    private String species;
    private String image;
    private String locationName;
    private String dimension;
    private String firstEpisodeName;
    private String firstEpisodeCode;

    public PersonajeConsolidadoDTO() {
    }

    public PersonajeConsolidadoDTO(
            Integer id,
            String name,
            String species,
            String image,
            String locationName,
            String dimension,
            String firstEpisodeName,
            String firstEpisodeCode) {
        this.id = id;
        this.name = name;
        this.species = species;
        this.image = image;
        this.locationName = locationName;
        this.dimension = dimension;
        this.firstEpisodeName = firstEpisodeName;
        this.firstEpisodeCode = firstEpisodeCode;
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

    public String getLocationName() {
        return locationName;
    }

    public void setLocationName(String locationName) {
        this.locationName = locationName;
    }

    public String getDimension() {
        return dimension;
    }

    public void setDimension(String dimension) {
        this.dimension = dimension;
    }

    public String getFirstEpisodeName() {
        return firstEpisodeName;
    }

    public void setFirstEpisodeName(String firstEpisodeName) {
        this.firstEpisodeName = firstEpisodeName;
    }

    public String getFirstEpisodeCode() {
        return firstEpisodeCode;
    }

    public void setFirstEpisodeCode(String firstEpisodeCode) {
        this.firstEpisodeCode = firstEpisodeCode;
    }
}

