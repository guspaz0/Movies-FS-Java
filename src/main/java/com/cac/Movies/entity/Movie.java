package com.cac.Movies.entity;

import java.util.List;

public class Movie {

    private int id;
    private String title;
    private String image;
    private String background_image;
    private String overview;
    private Object genres;
    private String release_date;


    public Movie(){};

    public Object getGenres() {
        return genres;
    }

    public void setGenres(Object genres) {
        this.genres = genres;
    }

    public int getId() {
        return id;
    }

    public void setId(int id) {
        this.id = id;
    }

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public String getImage() {
        return image;
    }

    public void setImage(String image) {
        this.image = image;
    }

    public String getBackground_image() {
        return background_image;
    }

    public void setBackground_image(String background_image) {
        this.background_image = background_image;
    }

    public String getOverview() {
        return overview;
    }

    public void setOverview(String overview) {
        this.overview = overview;
    }

    public String getRelease_date() {
        return release_date;
    }

    public void setRelease_date(String release_date) {
        this.release_date = release_date;
    }


    public Movie(int id, String title, String image, String background_image, String overview, String release_date, List<Genre> genres)
    {
        this.id=id;
        this.title=title;
        this.image=image;
        this.background_image=background_image;
        this.overview=overview;
        this.release_date=release_date;
        this.genres = genres;
    }

}
