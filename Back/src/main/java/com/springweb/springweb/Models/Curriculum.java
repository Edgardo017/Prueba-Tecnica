package com.springweb.springweb.Models;

import java.util.List;

public class Curriculum {
    private User user;
    private List<workExperience> workExperience;
    private List<Certifications> Certifications;
    private List<Skills> skills;

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

    public List<Certifications> getCertifications() {
        return Certifications;
    }

    public void setCertifications(List<Certifications> certifications) {
        Certifications = certifications;
    }

    public List<Skills> getSkills() {
        return skills;
    }

    public void setSkills(List<Skills> skills) {
        this.skills = skills;
    }
}
