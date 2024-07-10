package com.cac.Movies.controller;

import com.cac.Movies.dto.MoviesResponseDTO;
import com.fasterxml.jackson.databind.ObjectMapper;

import java.io.*;
import java.sql.SQLException;
import java.util.List;

import javax.servlet.ServletException;
import javax.servlet.http.*;
import javax.servlet.annotation.*;
import com.cac.Movies.service.*;
import com.cac.Movies.entity.*;

@WebServlet("/movies/*")
public class MoviesController extends HttpServlet {
    private MovieService movieService;
    private ObjectMapper objectMapper;

    //private final PeliculaService peliculaService;
    @Override
    public void init() throws ServletException
    {
        movieService = new MovieService();
        objectMapper = new ObjectMapper();
    }

    @Override
    protected void doGet(HttpServletRequest req, HttpServletResponse resp) throws ServletException, IOException
    {
        String pathInfo=req.getPathInfo();
        try {
            // si la url es la raiz ("/"), devuelve todas las peliculas
            int page=1;
            String search="";
            if (req.getParameter("page") != null) page = Integer.parseInt(req.getParameter("page"));
            if (req.getParameter("search") != null) search = req.getParameter("search");
            if(pathInfo==null || pathInfo.equals("/")) {
                MoviesResponseDTO movies=movieService.getAllMovies(search,page);
                String json=objectMapper.writeValueAsString(movies);
                resp.setContentType("application/json");
                resp.getWriter().write(json);
            }
            else // si no es la ruta raiz ("/"), tratar de obtener el ID del url.
            {
                // separar req.url por cada "/"
                String[] pathParts=pathInfo.split("/");
                int id=Integer.parseInt(pathParts[1]);
                Movie movie=movieService.getMoviesById(id);

                if(movie!=null) {
                    String json=objectMapper.writeValueAsString(movie);
                    resp.setContentType("application/json");
                    resp.getWriter().write(json);
                }
                else // si no es la ruta raiz y tampoco encuentra el id, devuelve error
                {
                    throw new ServletException();
                }

            }

        } catch(SQLException | ClassNotFoundException e) {
            resp.sendError(HttpServletResponse.SC_NOT_FOUND);

        }
    }

    @Override
    protected void doPost(HttpServletRequest req, HttpServletResponse resp) throws ServletException, IOException {
        try {
            Movie pelicula = objectMapper.readValue(req.getReader(),Movie.class);
            Movie created_movie = movieService.addMovie(pelicula);
            String json=objectMapper.writeValueAsString(created_movie);
            resp.setContentType("application/json");
            resp.getWriter().write(json);
            resp.setStatus(HttpServletResponse.SC_CREATED);
        } catch(SQLException|ClassNotFoundException e) {
            resp.sendError(HttpServletResponse.SC_NOT_FOUND);
        }
    }
}