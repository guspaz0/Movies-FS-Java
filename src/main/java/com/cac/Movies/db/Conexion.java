package com.cac.Movies.db;

import java.sql.*;

public class Conexion {
    public String driver="com.mysql.cj.jdbc.Driver";

    public Connection getConnection() throws ClassNotFoundException
    {
        Connection conexion = null;
        try {
            Class.forName(driver);
            String url = System.getenv("DB_URL");
            conexion = DriverManager.getConnection(url, System.getenv("DB_USER"), System.getenv("DB_PASS"));
        } catch (SQLException var3) {
            System.out.println("Hay un error:" + String.valueOf(var3));
        }
        return conexion;
    }
}
