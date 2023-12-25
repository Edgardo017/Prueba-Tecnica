package com.springweb.springweb.Models;

import java.util.List;

public class Curriculum {
    private User user;
    private List<workExperience> workExperience;

    public User getUser() {
        return user;
    }

    public void setUser(User user) {
        this.user = user;
    }

    public List<workExperience> getWorkExperience() {
        return workExperience;
    }

    public void setWorkExperience(List<workExperience> workExperience) {
        this.workExperience = workExperience;
    }
}
