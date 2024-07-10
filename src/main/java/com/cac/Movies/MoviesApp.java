package com.cac.Movies;

import com.cac.Movies.db.Conexion;

import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;

public class MoviesApp {
    public static void main(String[] args) throws ClassNotFoundException , SQLException
    {
        Connection conexion=null;
        Conexion con=new Conexion();
        conexion=con.getConnection();

        PreparedStatement ps;
        ResultSet rs;

        ps=conexion.prepareStatement("select * from movies");
        rs=ps.executeQuery();

        while(rs.next())
        {
            String title=rs.getString("title");
            System.out.println(title);
        }

    }
}
