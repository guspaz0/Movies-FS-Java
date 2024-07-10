package com.cac.Movies.service;

import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.util.ArrayList;
import java.util.List;
import java.util.Objects;

import com.cac.Movies.db.Conexion;
import com.cac.Movies.entity.User;


public class UserService {
    private final Conexion conexion;
    public UserService(){
        this.conexion = new Conexion();
    }

    private static final String MESSAGE = "No se encuentra el usuario solcitado";

    public List<User> getAllUsers() throws SQLException, ClassNotFoundException
    {
        List<User> users = new ArrayList<>();
        Connection con = conexion.getConnection();
        String sql = "select * from users";
        PreparedStatement ps = con.prepareStatement(sql);
        ResultSet rs = ps.executeQuery();
        while(rs.next()) {
            User user = new User(
                rs.getInt("id"),
                rs.getString("name"),
                rs.getString("birth_date"),
                rs.getString("username"),
                "es secreto"
            );
            users.add(user);
        }
        rs.close();
        ps.close();
        return users;
    }
    public User getUserById(int id) throws SQLException, ClassNotFoundException
    {
            User user=null;
            Connection con = conexion.getConnection();
            String sql = "select * from users where id =?";
            PreparedStatement ps = con.prepareStatement(sql);
            ps.setInt(1, id);
            ResultSet rs=ps.executeQuery();
            while (rs.next()){
                user = new User(
                        rs.getInt("id"),
                        rs.getString("name"),
                        rs.getString("birth_date"),
                        rs.getString("username"),
                        "es secreto");
            }
            rs.close();
            ps.close();
            return user;
    }
    public User addUser(User user) throws SQLException, ClassNotFoundException
    {
        Connection con = conexion.getConnection();
        String sql = "INSERT INTO users (name, birth_date, username, contrasena) VALUES (?,?,?,?)";
        PreparedStatement ps=con.prepareStatement(sql);
        ps.setString(1,user.getName());
        ps.setString(2,user.getBirth_date());
        ps.setString(3,user.getUsername());
        ps.setString(4,user.getContrasena());
        ps.executeUpdate();
        ps.close();
        return user;
    }

    public void deleteUser(int id) throws SQLException, ClassNotFoundException
    {
        Connection con = conexion.getConnection();
        String sql = "DELETE FROM users WHERE id=?";
        PreparedStatement ps=con.prepareStatement(sql);
        ps.setInt(1,id);
        ps.executeUpdate();
        ps.close();
    }


    public User updateUser(User user) throws SQLException, ClassNotFoundException
    {
        Connection con = conexion.getConnection();
        String sql = "UPDATE users SET name=?, birth_date=?, contrasena=? WHERE id=?";
        PreparedStatement ps=con.prepareStatement(sql);
        ps.setString(1,user.getName());
        ps.setString(2,user.getBirth_date());
        ps.setString(3,user.getContrasena());
        ps.executeUpdate();
        ps.close();
        return user;
    }
    public User loginUser(String username, String contrasena) throws SQLException, ClassNotFoundException
    {
        try {
            User user;
            Connection con = conexion.getConnection();
            String sql = "select * from users WHERE username=? and contrasena=?";
            PreparedStatement ps=con.prepareStatement(sql);
            ps.setString(1,username);
            ps.setString(2,contrasena);
            ResultSet rs=ps.executeQuery();
            if (rs.next()) {
                user = new User(
                    rs.getInt("id"),
                    rs.getString("name"),
                    rs.getString("birth_date"),
                    rs.getString("username"),
                    "es secreto");
                rs.close();
                ps.close();
                System.out.println();
                return user;
            } else {
                throw new ClassNotFoundException();
            }
        } catch (ClassNotFoundException e) {
            System.out.println("Hay un error:" + String.valueOf(e));
            throw new SQLException();
        }
    }
}