package controllers;

import com.google.gson.Gson;
import jakarta.servlet.ServletException;
import jakarta.servlet.annotation.WebServlet;
import jakarta.servlet.http.HttpServlet;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.servlet.http.HttpSession;

import java.io.IOException;
import java.util.HashMap;
import java.util.Map;

@WebServlet("/api/auth/check-session")
public class CheckSessionServlet extends HttpServlet {
    private final Gson gson = new Gson();

    protected void doGet(HttpServletRequest req, HttpServletResponse resp)
            throws ServletException, IOException {

        resp.setHeader("Access-Control-Allow-Origin", "http://localhost:5173");
        resp.setHeader("Access-Control-Allow-Credentials", "true");
        resp.setContentType("application/json");

        HttpSession session = req.getSession(false);
        Map<String, Object> responseMap = new HashMap<>();

        if (session != null && session.getAttribute("username") != null) {
            responseMap.put("authenticated", true);
            responseMap.put("username", session.getAttribute("username"));
        } else {
            responseMap.put("authenticated", false);
        }

        resp.getWriter().write(gson.toJson(responseMap));
    }
}