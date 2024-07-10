package com.cac.Movies.service;

import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.util.ArrayList;
import java.util.List;
import com.cac.Movies.db.Conexion;
import com.cac.Movies.dto.MoviesResponseDTO;
import com.cac.Movies.entity.Genre;
import com.cac.Movies.entity.Movie;

public class MovieService {
    private final Conexion conexion;
    public MovieService(){
        this.conexion = new Conexion();
    }
    public MoviesResponseDTO getAllMovies(String search,int page) throws SQLException, ClassNotFoundException
    {
        try {
            List<Movie> movies = new ArrayList<>();
            Connection con = conexion.getConnection();
            String sql = "select * from movies where title like ? limit 10 offset ?";
            PreparedStatement ps = con.prepareStatement(sql);
            ps.setString(1,'%'+search+'%');
            ps.setInt(2,(page-1)*10);
            ResultSet rs = ps.executeQuery();

            while (rs.next()) {
                String sql_genres="select g.id,g.name from genres g " +
                    "inner join movie_genres mg on mg.genre_id = g.id "+
                    "inner join movies m on m.id = mg.movie_id " +
                    "where m.id =?";
                PreparedStatement ps_genres = con.prepareStatement(sql_genres);
                ps_genres.setInt(1,rs.getInt("id"));
                ResultSet rs_genres = ps_genres.executeQuery();
                List<Genre> genres = new ArrayList<>();
                while (rs_genres.next()){
                    Genre genre = new Genre(
                        rs_genres.getInt("id"),
                        rs_genres.getString("name"));
                    genres.add(genre);
                }
                rs_genres.close();
                ps_genres.close();
                Movie movie = new Movie(
                    rs.getInt("id"),
                    rs.getString("title"),
                    rs.getString("image"),
                    rs.getString("background_image"),
                    rs.getString("overview"),
                    rs.getString("release_date"),
                    genres);
                movies.add(movie);
            }
            rs.close();
            ps.close();
            String sql_count = "select count(id) as movies_count from movies";
            PreparedStatement ps_count = con.prepareStatement(sql_count);
            ResultSet rs_count = ps_count.executeQuery();
            if (rs_count.next()) {
                MoviesResponseDTO response = new MoviesResponseDTO(
                        page,
                        movies,
                        (int) Math.ceil((double) rs_count.getInt("movies_count") /10),
                        rs_count.getInt("movies_count"));
                ps_count.close();
                rs_count.close();
                return response;
            } else {throw new SQLException();}
        } catch(SQLException f){
            System.out.println(String.valueOf(f));
            return null;
        }

    }

    public Movie getMoviesById(int id) throws SQLException, ClassNotFoundException
    {
        Movie movie=null;
        Connection con = conexion.getConnection();
        String sql = "select * from movies where id =?";
        PreparedStatement ps = con.prepareStatement(sql);
        ps.setInt(1, id);
        ResultSet rs=ps.executeQuery();
        while(rs.next()) {
            String sql_genres="select g.id,g.name from genres g " +
                "inner join movie_genres mg on mg.genre_id = g.id "+
                "inner join movies m on m.id = mg.movie_id "+
                "where m.id = ?";
            PreparedStatement ps_genres = con.prepareStatement(sql_genres);
            ps_genres.setInt(1,rs.getInt("id"));
            ResultSet rs_genres = ps_genres.executeQuery();
            List<Genre> genres = new ArrayList<>();
            while (rs_genres.next()){
                Genre genre = new Genre(
                        rs_genres.getInt("id"),
                        rs_genres.getString("name"));
                genres.add(genre);
            }
            rs_genres.close();
            ps_genres.close();

            movie = new Movie(
                rs.getInt("id"),
                rs.getString("title"),
                rs.getString("image"),
                rs.getString("background_image"),
                rs.getString("overview"),
                rs.getString("release_date"),
                genres);
        }

        rs.close();
        ps.close();
        return movie;
    }

    public Movie addMovie(Movie movie) throws SQLException, ClassNotFoundException
    {
        try {
            Connection con = conexion.getConnection();
            String sql = "INSERT INTO movies (title,image,background_image,overview,release_date) " +
                    "VALUES (?,?,?,?,?)";
            PreparedStatement ps=con.prepareStatement(sql);
            ps.setString(1,movie.getTitle());
            ps.setString(2,movie.getImage());
            ps.setString(3,movie.getBackground_image());
            ps.setString(4,movie.getOverview());
            ps.setString(5,movie.getRelease_date());
            ps.executeUpdate();
            ps.close();
            String sql_created = "SELECT LAST_INSERT_ID() AS id";
            PreparedStatement ps_created = con.prepareStatement(sql_created);
            ResultSet rs = ps_created.executeQuery();
            if (rs.next()) {
                movie.setId(rs.getInt("id"));
                List<Integer> genres_id = (List<Integer>) movie.getGenres();
                for(int i=0;i < genres_id.toArray().length;i++){
                    int genre_id = (int) genres_id.toArray()[i];
                    String sql_genre = "insert into movie_genres (movie_id, genre_id) values (?,?)";
                    PreparedStatement ps_genre = con.prepareStatement(sql_genre);
                    ps_genre.setInt(1,movie.getId());
                    ps_genre.setInt(2,genre_id);
                    ps_genre.executeUpdate();
                    ps_genre.close();
                }
                rs.close();
                ps_created.close();
                return getMoviesById(movie.getId());
            }
            else {
                throw new SQLException();
            }
        } catch (SQLException | ClassNotFoundException e) {
            System.out.println(String.valueOf(e));
            throw new SQLException();
        }

    }

    public void deleteMovie(int id) throws SQLException, ClassNotFoundException
    {
        Connection con = conexion.getConnection();
        String sql = "DELETE FROM movies WHERE id=?";
        PreparedStatement ps=con.prepareStatement(sql);
        ps.setInt(1,id);
        ps.executeUpdate();
        ps.close();
    }


    public Movie updateMovie(Movie movie) throws SQLException, ClassNotFoundException
    {
        Connection con = conexion.getConnection();
        String sql = "UPDATE movies SET " +
                "title=?, image=?, background_image=?, overview=?, release_date=?," +
                "WHERE id=?";
        PreparedStatement ps=con.prepareStatement(sql);
        ps.setString(1,movie.getTitle());
        ps.setString(2,movie.getImage());
        ps.setString(3,movie.getBackground_image());
        ps.setString(4,movie.getOverview());
        ps.setString(5,movie.getRelease_date());
        ps.setInt(6,movie.getId());
        ps.executeUpdate();
        ps.close();
        return movie;
    }
}
