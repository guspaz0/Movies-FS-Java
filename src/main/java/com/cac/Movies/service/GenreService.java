package com.cac.Movies.service;

import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.util.ArrayList;
import java.util.List;
import com.cac.Movies.db.Conexion;
import com.cac.Movies.entity.Genre;

public class GenreService {
    private final Conexion conexion;
    public GenreService(){
        this.conexion = new Conexion();
    }

    public List<Genre> getAllGenres() throws SQLException, ClassNotFoundException
    {
        List<Genre> genres = new ArrayList<>();
        Connection con = conexion.getConnection();
        String sql = "select * from genres";
        PreparedStatement ps = con.prepareStatement(sql);
        ResultSet rs = ps.executeQuery();
        while(rs.next()) {
            Genre genre = new Genre(
                rs.getInt("id"),
                rs.getString("name")
            );
            genres.add(genre);
        }
        rs.close();
        ps.close();
        return genres;
    }
    public Genre getGenreById(int id) throws SQLException, ClassNotFoundException
    {
        Genre genre=null;
        Connection con = conexion.getConnection();
        String sql = "select * from genres where id =?";
        PreparedStatement ps = con.prepareStatement(sql);
        ps.setInt(1, id);
        ResultSet rs=ps.executeQuery();
        while (rs.next()){
            genre = new Genre(
                rs.getInt("id"),
                rs.getString("name"));
        }
        rs.close();
        ps.close();
        return genre;
    }
    public Genre addGenre(Genre genre) throws SQLException, ClassNotFoundException
    {
        Connection con = conexion.getConnection();
        String sql = "INSERT INTO genres (name) VALUES (?)";
        PreparedStatement ps=con.prepareStatement(sql);
        ps.setString(1,genre.getName());
        ps.executeUpdate();
        ps.close();
        return genre;
    }

    public void deleteGenre(int id) throws SQLException, ClassNotFoundException
    {
        Connection con = conexion.getConnection();
        String sql = "DELETE FROM genres WHERE id=?";
        PreparedStatement ps=con.prepareStatement(sql);
        ps.setInt(1,id);
        ps.executeUpdate();
        ps.close();
    }


    public Genre updateGenre(Genre genre) throws SQLException, ClassNotFoundException
    {
        Connection con = conexion.getConnection();
        String sql = "UPDATE genres SET name=? WHERE id=?";
        PreparedStatement ps=con.prepareStatement(sql);
        ps.setString(1,genre.getName());
        ps.setInt(2,genre.getId());
        ps.executeUpdate();
        ps.close();
        return genre;
    }
}
