package controllers;

import com.google.gson.Gson;
import com.google.gson.GsonBuilder;
import dao.TodoDao;
import jakarta.servlet.ServletException;
import jakarta.servlet.annotation.WebServlet;
import jakarta.servlet.http.HttpServlet;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.servlet.http.HttpSession;
import model.Todo;
import util.LocalDateAdapter;

import java.io.IOException;
import java.time.LocalDate;
import java.util.List;

@WebServlet("/api/todo/*")
public class TodoApiController extends HttpServlet {
    private final TodoDao todoDao = new TodoDao();
//    private final Gson gson = new Gson();

    private final Gson gson = new GsonBuilder()
            .registerTypeAdapter(LocalDate.class, new LocalDateAdapter())
            .create();
    @Override
    protected void doGet(HttpServletRequest req, HttpServletResponse resp) throws ServletException, IOException {
        String pathInfo = req.getPathInfo();
        String username = getSessionUsername(req, resp);

        if(username == null) return;

        if(pathInfo == null || pathInfo.equals("/")){
            List<Todo> todos = todoDao.getAllTodos(username);
            writeJson(resp, todos);
        } else {
            Long id = Long.parseLong(pathInfo.substring(1)); // on 0 it is '/'
            Todo todo = todoDao.getTodoById(id);
            writeJson(resp, todo);
        }
    }

//    add new todo
    @Override
    protected void doPost(HttpServletRequest req, HttpServletResponse resp) throws ServletException, IOException {
        String username = getSessionUsername(req, resp);
        if(username == null) return;

        Todo todo = gson.fromJson(req.getReader(), Todo.class);
        todo.setUsername(username);

        boolean result = todoDao.createTodo(todo);
        writeJson(resp, result ? "Todo created" : "Creation failed");
    }

//    update todo

    @Override
    protected void doPut(HttpServletRequest req, HttpServletResponse resp) throws ServletException, IOException {
        String username = getSessionUsername(req, resp);
        if(username == null) return;

        String pathInfo = req.getPathInfo();
        if(pathInfo == null || pathInfo.equals("/")){ // no id is given for updating todo
            resp.sendError(400, "Missing id for updates");
//            writeJson(resp,"Missing id for updates");
            return;
        }

        Long id = Long.parseLong(pathInfo.substring(1)); // todo ki id
        Todo todo = gson.fromJson(req.getReader(), Todo.class);
        todo.setUsername(username);
        boolean result = todoDao.updateTodo(id, todo);
        System.out.println("todo updated successfully");
        writeJson(resp, result ? "Todo updated" : "Update failed");

    }

    @Override
    protected void doDelete(HttpServletRequest req, HttpServletResponse resp) throws ServletException, IOException {
        String username = getSessionUsername(req, resp);
        if(username == null) return;

        String pathInfo = req.getPathInfo();
        if(pathInfo == null || pathInfo.equals("/")){ // no id is given for updating todo
            resp.sendError(400, "Missing id for deletion");
            return;
        }

        Long id = Long.parseLong(pathInfo.substring(1)); // todo ki id
        boolean result = todoDao.deleteTodo(id);
        writeJson(resp, result ? "Todo deleted" : "Delete failed");
    }

    private String getSessionUsername(HttpServletRequest req, HttpServletResponse resp) throws IOException {
        HttpSession session = req.getSession(false);
        if(session == null || session.getAttribute("username") == null){
            resp.sendError(401, "Unauthorized");
            return null;
        }

        return (String) session.getAttribute("username");
    }

    private void writeJson(HttpServletResponse resp, Object obj) throws IOException {
        resp.setContentType("application/json");
        resp.getWriter().write(gson.toJson(obj));
    }
}
