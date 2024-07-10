package com.cac.Movies.entity;

public class Genre {

    private int id;
    private String name;

    public Genre(){};

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public int getId() {
        return id;
    }

    public void setId(int id) {
        this.id = id;
    }

    public Genre(int id, String name)
    {
        this.id=id;
        this.name=name;
    }

}
