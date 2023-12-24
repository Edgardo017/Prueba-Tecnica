package com.springweb.springweb.DAO;

import com.springweb.springweb.Models.User;

import java.util.List;

public interface UserDao {

    String addUser(User user);
    User loginUser(User user);
    boolean updateUser(User user);
}
