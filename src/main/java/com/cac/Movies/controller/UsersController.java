package com.cac.Movies.controller;

import com.cac.Movies.dto.LoginRequestDTO;
import com.fasterxml.jackson.databind.ObjectMapper;

import java.io.*;
import java.sql.SQLException;
import java.util.List;
import java.util.Objects;

import javax.servlet.ServletException;
import javax.servlet.http.*;
import javax.servlet.annotation.*;
import com.cac.Movies.service.*;
import com.cac.Movies.entity.*;

@WebServlet("/users/*")
public class UsersController extends HttpServlet {
    private UserService userService;
    private ObjectMapper objectMapper;

    @Override
    public void init() throws ServletException
    {
        userService = new UserService();
        objectMapper = new ObjectMapper();
    }

    @Override
    protected void doGet(HttpServletRequest req, HttpServletResponse resp) throws ServletException, IOException
    {
        String pathInfo=req.getPathInfo();
        try {
            if(pathInfo==null || pathInfo.equals("/")) {
                List<User> users=userService.getAllUsers();
                String json=objectMapper.writeValueAsString(users);
                resp.setContentType("application/json");
                resp.getWriter().write(json);
            }
            else
            {
                String[] pathParts=pathInfo.split("/");
                int id=Integer.parseInt(pathParts[1]);
                User user=userService.getUserById(id);

                if(user!=null) {
                    String json=objectMapper.writeValueAsString(user);
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

    @Override
    protected void doPost(HttpServletRequest req, HttpServletResponse resp) throws ServletException, IOException {
        String pathInfo=req.getPathInfo();
        try {
            if(pathInfo==null || pathInfo.equals("/")) {
                User user = objectMapper.readValue(req.getReader(), User.class);
                userService.addUser(user);
                resp.setStatus(HttpServletResponse.SC_CREATED);
            }
            else //login de usuarios
            {
                String[] pathParts=pathInfo.split("/");
                String url= pathParts[1];
                if (Objects.equals(url, "login")) {
                    LoginRequestDTO body = objectMapper.readValue(req.getReader(), LoginRequestDTO.class);
                    User user = userService.loginUser(body.getUsername(),body.getPassword());
                    String json=objectMapper.writeValueAsString(user);
                    resp.setContentType("application/json");
                    resp.getWriter().write(json);
                } else {throw new ServletException();}
            }
        } catch(SQLException|ClassNotFoundException e) {
            resp.sendError(HttpServletResponse.SC_NOT_FOUND);
        }
    }
}