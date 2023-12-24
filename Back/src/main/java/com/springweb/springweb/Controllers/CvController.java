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

    @RequestMapping(value = "/api/crearCv", method = RequestMethod.POST)
    public boolean validarToken(@RequestBody String token) {
        try {
            Claims claims = Jwts.parser()
                    .setSigningKey(jwtSecret)
                    .parseClaimsJws(token)
                    .getBody();

            return claims.getExpiration().after(new Date());
        } catch (Exception e) {
            return false;
        }
    }
}
