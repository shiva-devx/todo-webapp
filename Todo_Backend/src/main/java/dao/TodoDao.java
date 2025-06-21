package dao;

import database.DBConnection;
import model.Todo;
import util.TimeUtils;

import java.sql.*;
import java.util.ArrayList;
import java.util.List;

public class TodoDao {
    private static final String todo_table = DBConnection.getProps("TODOLIST_TABLE");
    public List<Todo> getAllTodos(String username){
        List<Todo> todos = new ArrayList<>();
        String sql = "SELECT * FROM " + todo_table + " WHERE username = ?;";
        try (Connection conn = DBConnection.getConnection()){
            PreparedStatement ps = conn.prepareStatement(sql);
            ps.setString(1,username);
            ResultSet rs = ps.executeQuery();

            while(rs.next()){
                todos.add(mapRowToTodo(rs));
            }
        } catch (RuntimeException | ClassNotFoundException | SQLException e) {
            throw new RuntimeException(e);
        }

        return todos;
    }

    public Todo getTodoById(Long id) {
        String sql = "SELECT * FROM "+ todo_table +" WHERE id = ?";
        try (Connection conn = DBConnection.getConnection();
             PreparedStatement ps = conn.prepareStatement(sql)) {
            ps.setLong(1, id);
            ResultSet rs = ps.executeQuery();
            if (rs.next()) return mapRowToTodo(rs);
        } catch (SQLException | ClassNotFoundException e) {
            e.printStackTrace();
        }
        return null;
    }

    public boolean createTodo(Todo todo) {
        String sql = "INSERT INTO "+ todo_table +" (title, description, target_date, is_done, username) VALUES (?, ?, ?, ?, ?)";
        try (Connection conn = DBConnection.getConnection();
             PreparedStatement ps = conn.prepareStatement(sql)) {
            ps.setString(1, todo.getTitle());
            ps.setString(2, todo.getDescription());
            ps.setDate(3, TimeUtils.getSQLDate(todo.getTargetDate()));
            ps.setBoolean(4, todo.getStatus());
            ps.setString(5, todo.getUsername());
            return ps.executeUpdate() > 0;
        } catch (SQLException | ClassNotFoundException e) {
            e.printStackTrace();
        }
        return false;
    }

    public boolean updateTodo(Long id, Todo todo){
        String sql = "UPDATE " + todo_table + " SET title = ?, description = ?, target_date = ?, is_done = ? WHERE id = ?;";
        try (Connection conn = DBConnection.getConnection();
             PreparedStatement ps = conn.prepareStatement(sql)) {
            ps.setString(1, todo.getTitle());
            ps.setString(2, todo.getDescription());
            ps.setDate(3, TimeUtils.getSQLDate(todo.getTargetDate()));
            ps.setBoolean(4, todo.getStatus());
            ps.setLong(5, id);
            return ps.executeUpdate() > 0;
        } catch (SQLException | ClassNotFoundException e) {
            e.printStackTrace();
        }

        return false;
    }

    public boolean deleteTodo(Long id){
        String sql = "DELETE FROM " + todo_table + " WHERE id = ?";
        try (Connection conn = DBConnection.getConnection();
             PreparedStatement ps = conn.prepareStatement(sql)){

            ps.setLong(1, id);
            return ps.executeUpdate() > 0;
        } catch (ClassNotFoundException | SQLException e) {
            e.printStackTrace();
        }
        return false;
    }


    private Todo mapRowToTodo(ResultSet rs) throws SQLException{
        return new Todo(
                rs.getLong("id"),
                rs.getString("title"),
                rs.getString("username"),
                rs.getString("description"),
                rs.getDate("target_date").toLocalDate(),
                rs.getBoolean("is_done")
        );
    }
}

