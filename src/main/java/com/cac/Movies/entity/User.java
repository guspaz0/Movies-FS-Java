package com.cac.Movies.entity;

public class User {
    private int id;
    private String name;
    private String birth_date;
    private String username;
    private String contrasena;

    public User(){};

    public int getId() {
        return id;
    }

    public void setId(int id) {
        this.id = id;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getBirth_date() {
        return birth_date;
    }

    public void setBirth_date(String birth_date) {
        this.birth_date = birth_date;
    }

    public String getUsername() {
        return username;
    }

    public void setUsername(String username) {
        this.username = username;
    }

    public String getContrasena() {
        return contrasena;
    }

    public void setContrasena(String contrasena) {
        this.contrasena = contrasena;
    }

    public User(int id, String name, String birth_date, String username, String contrasena)
    {
        this.id=id;
        this.name=name;
        this.birth_date=birth_date;
        this.username=username;
        this.contrasena=contrasena;
    }
}
