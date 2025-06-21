package model;

import java.time.LocalDate;

public class Todo {
    private Long id;
    private String title;
    private String description;
    private LocalDate targetDate;
    private boolean status;
    private String username;

    public Todo(){}

    public Todo(Long id, String title, String username, String description, LocalDate targetDate, boolean status) {
        this.id = id;
        this.title = title;
        this.username = username;
        this.description = description;
        this.targetDate = targetDate;
        this.status = status;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public LocalDate getTargetDate() {
        return targetDate;
    }

    public void setTargetDate(LocalDate targetDate) {
        this.targetDate = targetDate;
    }

    public boolean isStatus() {
        return status;
    }

    public boolean getStatus() {
        return status;
    }



    public void setStatus(boolean status) {
        this.status = status;
    }

    public String getUsername() {
        return username;
    }

    public void setUsername(String username) {
        this.username = username;
    }
}
