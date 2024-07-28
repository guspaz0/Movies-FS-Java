package com.cac.Movies.service;

import java.security.NoSuchAlgorithmException;
import java.security.spec.InvalidKeySpecException;
import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.util.ArrayList;
import java.util.List;

import com.cac.Movies.middlewares.auth;

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
                rs.getString("lastname"),
                rs.getString("gender"),
                rs.getString("birth_date"),
                rs.getString("country_code"),
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
                    rs.getString("lastname"),
                    rs.getString("gender"),
                    rs.getString("birth_date"),
                    rs.getString("country_code"),
                    rs.getString("username"),
                    "es secreto");
            }
            rs.close();
            ps.close();
            return user;
    }
    public User addUser(User user) throws SQLException, ClassNotFoundException {
        try {
            boolean checkUsername = searchUser(user.getUsername());
            if (!checkUsername) {
                Connection con = conexion.getConnection();
                String sql = "INSERT INTO users (name, lastname, gender, country_code, birth_date, username, contrasena)" +
                        " VALUES (?,?,?,?,?,?,?)";
                PreparedStatement ps = con.prepareStatement(sql);
                ps.setString(1, user.getName());
                ps.setString(2, user.getLastname());
                ps.setString(3, user.getGender());
                ps.setString(4, user.getCountry_code());
                ps.setString(5, user.getBirth_date());
                ps.setString(6, user.getUsername());
                ps.setString(7, auth.encryptionPassword(user.getContrasena()));
                ps.executeUpdate();
                ps.close();
                String sql_created = "SELECT LAST_INSERT_ID() AS id";
                PreparedStatement ps_created = con.prepareStatement(sql_created);
                ResultSet rs = ps_created.executeQuery();
                user.setId(rs.getInt("id"));
                user.setContrasena("");
                rs.close();
                ps_created.close();
                return user;
            } else {throw new SQLException("el usuario ya existe");}
        } catch (SQLException | ClassNotFoundException e) {
            throw new SQLException(String.valueOf(e));
        } catch (NoSuchAlgorithmException | InvalidKeySpecException e) {
            throw new RuntimeException(e);
        }
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
        String sql = "UPDATE users SET name=?, lastname=?, birth_date=?, contrasena=? WHERE id=?";
        PreparedStatement ps=con.prepareStatement(sql);
        ps.setString(1,user.getName());
        ps.setString(2,user.getLastname());
        ps.setString(3,user.getBirth_date());
        ps.setString(4,user.getContrasena());
        ps.executeUpdate();
        ps.close();
        return user;
    }
    public User loginUser(String username, String contrasena) throws SQLException, ClassNotFoundException
    {
        try {
            User user;
            Connection con = conexion.getConnection();
            String sql = "select * from users WHERE username=?";
            PreparedStatement ps=con.prepareStatement(sql);
            ps.setString(1,username);
            ResultSet rs=ps.executeQuery();
            if (rs.next()) {
                boolean match = auth.encryptionPassword(contrasena).equals(rs.getString("contrasena"));
                if (match) {
                    user = getUserById(rs.getInt("id"));
                    rs.close();
                    ps.close();
                    return user;
                } else {
                    throw new ClassNotFoundException("usuario o contraseña incorrecto");
                }
            } else {
                throw new ClassNotFoundException("usuario o contraseña incorrecto");
            }
        } catch (ClassNotFoundException e) {
            System.out.println("Hay un error:" + String.valueOf(e));
            throw new SQLException();
        } catch (NoSuchAlgorithmException | InvalidKeySpecException e) {
            throw new RuntimeException(e);
        }
    }
    public boolean searchUser(String username) throws SQLException, ClassNotFoundException {
        Connection con = conexion.getConnection();
        String sql = "select * from users WHERE username=?";
        PreparedStatement ps=con.prepareStatement(sql);
        ps.setString(1,username);
        ResultSet rs=ps.executeQuery();
        if (rs.next()) return username.equals(rs.getString("username"));
        return false;
    }
}