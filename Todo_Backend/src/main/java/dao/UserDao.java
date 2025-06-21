package dao;


import database.DBConnection;
import model.User;
import util.PasswordUtil;

import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;

public class UserDao {

    public boolean registerUser(User user){

        // check if user exists with this username
        if (isUserExists(user.getUsername())) {
            return false;
        }

        String insert_new_user = "INSERT INTO " + DBConnection.getProps("USER_TABLE") + " (name,username,password) VALUES (?,?,?);";

        try(Connection conn = DBConnection.getConnection()){
            PreparedStatement ps = conn.prepareStatement(insert_new_user);
            ps.setString(1,user.getName());
            ps.setString(2,user.getUsername());
            ps.setString(3,user.getPassword());

            return ps.executeUpdate() > 0;
        } catch (SQLException | ClassNotFoundException e) {
            e.printStackTrace();
            return false;
        }

    }

    public boolean validateUser(String username, String rawPassword) {
        String sql = "SELECT password FROM "+DBConnection.getProps("USER_TABLE")+" WHERE username = ?";
        try (Connection conn = DBConnection.getConnection();
             PreparedStatement ps = conn.prepareStatement(sql)) {
            ps.setString(1, username);
            ResultSet rs = ps.executeQuery();
            if (rs.next()) {
                String hashed = rs.getString("password");
                return PasswordUtil.verifyPassword(rawPassword, hashed);
            }
        } catch (SQLException | ClassNotFoundException e) {
            e.printStackTrace();
        }
        return false;
    }

    public boolean isUserExists(String username) {
        String sql = "SELECT username FROM " + DBConnection.getProps("USER_TABLE") + " WHERE username = ?";

        try (Connection conn = DBConnection.getConnection();
             PreparedStatement ps = conn.prepareStatement(sql)) {
            ps.setString(1, username);
            ResultSet rs = ps.executeQuery();
            return rs.next(); // Returns true if a record exists
        } catch (SQLException | ClassNotFoundException e) {
            e.printStackTrace();
            return false; // Assume user doesn't exist if there's an error
        }
    }

}
