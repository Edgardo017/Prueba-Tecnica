package com.springweb.springweb.DAO;

import com.springweb.springweb.Models.*;

import java.util.List;

public interface CvDao {
    User getUser(long id);
    Curriculum updateUser(String token, Curriculum Curriculum);
    List<workExperience> getWorkExperiencesByUserId(long userId);
    List<Certifications> getCertificationsByUserId(long userId);
    List<Skills> getSkillsByUserId(long userId);
    List<workExperience> getWorkExperiencesByUserUsername(String username);
    List<Certifications> getCertificationsByUserUsername(String username);
    List<Skills> getSkillsByUserUsername(String username);
    User getUserByUsername(String username);

    String saveProfileImage(User user) ;
    String saveBannerImage( User user) ;
}
