package controllers;

import dao.UserDao;
import jakarta.servlet.ServletException;
import jakarta.servlet.annotation.WebServlet;
import jakarta.servlet.http.HttpServlet;
import com.google.gson.Gson;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.servlet.http.HttpSession;
import model.User;
import util.PasswordUtil;

import java.io.IOException;

@WebServlet("/api/auth/*")
public class AuthController extends HttpServlet {
    private final Gson gson = new Gson();
    private final UserDao userDao = new UserDao();

    @Override
    protected void doPost(HttpServletRequest req, HttpServletResponse resp) throws ServletException, IOException {
        String path = req.getPathInfo();
        System.out.println(path);
        if(path == null){
            sendError(resp, "path not found");
            return;
        }

        switch(path){
            case "/register" -> register(req, resp);
            case "/login" -> {
                if(req.getSession(false) != null){
                    writeJson(resp, 400, "Already logged in");
                    return;
                }
                login(req, resp);
            }
            default -> sendError(resp, "Unknown path");
        }
    }

    @Override
    protected void doGet(HttpServletRequest req, HttpServletResponse resp) throws ServletException, IOException {
        String path = req.getPathInfo();

        if (path == null) {
            sendError(resp, "Path not found");
            return;
        }

        if("/logout".equals(req.getPathInfo())){
            // checking if user is logged in or not
            if(req.getSession(false) == null){
                writeJson(resp, 400, "Not logged in");
                return;
            }
            req.getSession().invalidate();
//            resp.getWriter().write("{\"message\":\"Logged out\"}");
            writeJson(resp, 200, "Logged out successfully");
        } else {
            sendError(resp, "Unknown GET path");
        }
    }

    private void register(HttpServletRequest req, HttpServletResponse resp) throws ServletException, IOException{
        // Deserialize JSON from request body to User object
        User user = gson.fromJson(req.getReader(), User.class);
        //req.getReader() gets the request body content as a BufferedReader
        // User.class tells GSON what Java class to convert the JSON into
        // GSON automatically maps JSON properties to matching Java object fields
        user.setPassword(PasswordUtil.hashPassword(user.getPassword()));
        boolean success = userDao.registerUser(user);
        writeJson(resp, success ? 200 : 500, success ? "User registered" : "Registration failed or user with this username already exist");
    }

    private void login(HttpServletRequest req, HttpServletResponse resp) throws IOException {
        User user = gson.fromJson(req.getReader(),User.class);

        System.out.println("fetch called");
        System.out.println(user.getUsername());
        boolean isValid = userDao.validateUser(user.getUsername(), user.getPassword());

        if(isValid){
            HttpSession session = req.getSession();
            session.setAttribute("username", user.getUsername());
            // Set session timeout (7 days)
            session.setMaxInactiveInterval(60 * 60 * 24 * 7);
            writeJson(resp, 200, "Login successful");
        } else {
            writeJson(resp, 401, "Invalid credentials");
        }


    }

    private void writeJson(HttpServletResponse resp, int status, String msg) throws IOException{
        resp.setContentType("application/json");
        resp.setStatus(status);
        resp.getWriter().print("{\"message\":\"" + msg + "\"}");
    }

    private void sendError(HttpServletResponse resp, String msg) throws IOException {
        writeJson(resp, 404, msg);
    }
}
