package com.cac.Movies.entity;

public class User {
    private int id;
    private String name;
    private String lastname;
    private String gender;
    private String birth_date;
    private String country_code;
    private String username;
    private String contrasena;


    public User(){};

    public String getCountry_code() {
        return country_code;
    }

    public void setCountry_code(String country_code) {
        this.country_code = country_code;
    }

    public String getGender() {
        return gender;
    }

    public void setGender(String gender) {
        this.gender = gender;
    }

    public String getLastname() {
        return lastname;
    }

    public void setLastname(String lastname) {
        this.lastname = lastname;
    }

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

    public User(int id, String name,String lastname, String gender, String birth_date, String country_code, String username, String contrasena)
    {
        this.id=id;
        this.name=name;
        this.lastname=lastname;
        this.gender=gender;
        this.birth_date=birth_date;
        this.country_code=country_code;
        this.username=username;
        this.contrasena=contrasena;
    }
}
