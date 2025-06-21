package database;

import java.io.IOException;
import java.io.InputStream;
import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.SQLException;
import java.util.Properties;

public class DBConnection {
    private static final Properties props = new Properties();

    static {
        loadProperties();
    }

    private static void loadProperties(){
        try(InputStream inputStream = DBConnection.class.getClassLoader().getResourceAsStream("dbConfig.properties")){
            if(inputStream == null){
                throw new RuntimeException("dbconfig.properties not found in classPath or not get loaded");
            }
            props.load(inputStream);
        } catch (IOException e) {
            throw new RuntimeException(e);
        }
    }

    public static Connection getConnection() throws ClassNotFoundException, SQLException {
        Connection connection = null;
        String dbname = getProps("DBNAME");
        String url = "jdbc:mysql://localhost:3306/" + dbname;
        String username = props.getProperty("USERNAME");
        String password = props.getProperty("PASSWORD");

        Class.forName("com.mysql.cj.jdbc.Driver");
        System.out.println("Driver loaded successfully");
        connection = DriverManager.getConnection(url,username,password);

        return connection;
    }

    public static String getProps(String propName){
        String value = props.getProperty(propName);
        if (value == null) {
            System.out.println("Property '" + propName + "' not found. Available properties: " + props.keySet());
            throw new RuntimeException("Property '" + propName + "' not found. Available properties: " + props.keySet());
        }
        return value.trim(); // Trim in case there are spaces

    }
}
