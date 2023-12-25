package com.springweb.springweb.Controllers;

import com.springweb.springweb.DAO.CvDao;
import com.springweb.springweb.Models.Curriculum;
import com.springweb.springweb.Models.User;
import com.springweb.springweb.Models.workExperience;
import com.springweb.springweb.Utils.JWTUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;


@RestController
@CrossOrigin(origins = {"http://localhost:4200"})
public class CvController {

    @Autowired
    private CvDao CvDao;

    @Autowired
    private JWTUtil jwtuil;

    @Value("${security.jwt.secret}")
    private String jwtSecret;

    @RequestMapping(value = "/api/requestCv", method = RequestMethod.GET, produces = "application/json")
    public ResponseEntity<Object> requestCv(@RequestHeader("Authorization") String token) {
        if (jwtuil.isTokenExpired(token)) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Token Expirado");
        }

        String tokenUserId = jwtuil.getKey(token);
        User newUser = CvDao.getUser(Long.parseLong(tokenUserId));
        if (newUser == null) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Usuario no encontrado");
        }

        List<workExperience> experiences = CvDao.getWorkExperiencesByUserId(Long.parseLong(tokenUserId));

        Curriculum curriculum = new Curriculum();
        curriculum.setUser(newUser);
        curriculum.setWorkExperience(experiences);

        return ResponseEntity.ok(curriculum);
    }



    @RequestMapping(value = "/api/actualizarCv", method = RequestMethod.POST)
    public String actualizarCV(@RequestHeader("Authorization") String token, @RequestBody Curriculum Curriculum) {

        if ( jwtuil.isTokenExpired(token) )
            System.out.println("token expirado");
        else
            System.out.println("token no expirado");
        System.out.println(Curriculum.getUser().getFirstName());
        System.out.println("back " + Curriculum.getWorkExperience().size());
        System.out.println(Curriculum);


        if (CvDao.updateUser(token, Curriculum))
            return "curriculum actualizado jeje";
        return "error 403";
    }

}
