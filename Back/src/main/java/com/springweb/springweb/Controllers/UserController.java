package com.springweb.springweb.Controllers;

import com.springweb.springweb.DAO.UserDao;
import com.springweb.springweb.Models.User;
import com.springweb.springweb.Utils.JWTUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.web.bind.annotation.*;
import java.util.Base64;

import java.util.List;

@RestController
@CrossOrigin(origins = {"http://localhost:4200"})
public class UserController {
    @Autowired
    private UserDao UserDao;

    @Autowired
    private JWTUtil jwtuil;

    @Value("${security.jwt.secret}")
    private String jwtSecret;

    @RequestMapping(value = "api/register", method = RequestMethod.POST)
    public String addUser(@RequestBody User user){
        System.out.println("register");
        return UserDao.addUser(user);
    }


    @RequestMapping(value = "api/login", method = RequestMethod.POST)
    public String loginUser(@RequestBody User user){
        User newUser = UserDao.loginUser(user);
        if (newUser != null){
            long currentTime = System.currentTimeMillis();
            String currentTimeString = String.valueOf(currentTime);

            return jwtuil.create(String.valueOf(newUser.getId()), currentTimeString);
        }
        return "error 401";
    }

}
