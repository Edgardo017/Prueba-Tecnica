package com.springweb.springweb.DAO;

import com.springweb.springweb.Models.Curriculum;
import com.springweb.springweb.Models.User;
import com.springweb.springweb.Models.workExperience;

import java.util.List;

public interface CvDao {
    User getUser(long id);
    boolean updateUser(String token, Curriculum Curriculum);
    List<workExperience> getWorkExperiencesByUserId(long userId);
    public String saveProfileImage(User user) ;
    String saveBannerImage( User user) ;
}
