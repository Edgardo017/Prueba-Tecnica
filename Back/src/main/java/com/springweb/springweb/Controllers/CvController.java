package com.springweb.springweb.Controllers;

import com.springweb.springweb.DAO.UserDao;
import com.springweb.springweb.Models.User;
import com.springweb.springweb.Utils.JWTUtil;
import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.web.bind.annotation.*;

import java.util.Date;
import java.util.List;

@RestController
@CrossOrigin(origins = {"http://localhost:4200"})
public class CvController {
    @Autowired
    private UserDao UserDao;

    @Autowired
    private JWTUtil jwtuil;
    @Value("${security.jwt.secret}")
    private String jwtSecret;
    @RequestMapping(value = "/api/actualizarCv", method = RequestMethod.POST)
    public String actualizarCV(@RequestHeader("Authorization") String token, @RequestBody User user) {

        if ( jwtuil.isTokenExpired(token) )
            System.out.println("token expirado");
        else
            System.out.println("token no expirado");

        String tokenUserId = jwtuil.getKey(token);
        user.setId( Long.parseLong(tokenUserId));
        System.out.println("curriculum : "+tokenUserId);
        if (UserDao.updateUser(user))
            return "curriculum actualizado jeje";
        return "error 403";
    }

}
