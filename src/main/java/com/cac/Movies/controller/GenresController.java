package com.cac.Movies.controller;

import com.fasterxml.jackson.databind.ObjectMapper;

import java.io.*;
import java.sql.SQLException;
import java.util.List;

import javax.servlet.ServletException;
import javax.servlet.http.*;
import javax.servlet.annotation.*;
import com.cac.Movies.service.*;
import com.cac.Movies.entity.*;

@WebServlet("/genres/*")
public class GenresController extends HttpServlet
{
    private GenreService genreService;
    private ObjectMapper objectMapper;
    @Override
    public void init() throws ServletException
    {
        genreService = new GenreService();
        objectMapper = new ObjectMapper();
    }
    @Override
    protected void doGet(HttpServletRequest req, HttpServletResponse resp) throws ServletException, IOException
    {
        String pathInfo=req.getPathInfo();
        try {
            if(pathInfo==null || pathInfo.equals("/")) {
                List<Genre> genres=genreService.getAllGenres();
                String json=objectMapper.writeValueAsString(genres);
                resp.setContentType("application/json");
                resp.getWriter().write(json);
            }
            else
            {
                String[] pathParts=pathInfo.split("/");
                int id=Integer.parseInt(pathParts[1]);
                Genre genre=genreService.getGenreById(id);

                if(genre!=null) {
                    String json=objectMapper.writeValueAsString(genre);
                    resp.setContentType("application/json");
                    resp.getWriter().write(json);
                }
                else
                {
                    throw new ServletException();
                }
            }
        } catch(SQLException | ClassNotFoundException e) {
            resp.sendError(HttpServletResponse.SC_NOT_FOUND);

        }
    }
}
