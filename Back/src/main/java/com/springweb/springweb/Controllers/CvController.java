package com.springweb.springweb.Controllers;

import com.springweb.springweb.DAO.CvDao;
import com.springweb.springweb.Models.*;
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
        List<Certifications> certifications = CvDao.getCertificationsByUserId(Long.parseLong(tokenUserId));
        List<Skills> skills = CvDao.getSkillsByUserId(Long.parseLong(tokenUserId));

        newUser.setPassword(null);
        Curriculum curriculum = new Curriculum();
        curriculum.setUser(newUser);
        curriculum.setWorkExperience(experiences);
        curriculum.setCertifications(certifications);
        curriculum.setSkills(skills);

        System.out.println(certifications.size());

        return ResponseEntity.ok(curriculum);
    }

    @RequestMapping(value = "/verCurriculum/{username}", method = RequestMethod.GET, produces = "application/json")
    public ResponseEntity<Object> verCurriculum(@PathVariable("username") String username) {
        User user = CvDao.getUserByUsername(username);
        if (user == null) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Usuario no encontrado");
        }

        List<workExperience> experiences = CvDao.getWorkExperiencesByUserUsername(username);
        List<Certifications> certifications = CvDao.getCertificationsByUserUsername(username);
        List<Skills> skills = CvDao.getSkillsByUserUsername(username);

        Curriculum curriculum = new Curriculum();
        curriculum.setUser(user);
        curriculum.setWorkExperience(experiences);
        curriculum.setCertifications(certifications);
        curriculum.setSkills(skills);

        return ResponseEntity.ok(curriculum);
    }


    @RequestMapping(value = "/api/actualizarCv", method = RequestMethod.POST)
    public ResponseEntity<Object> actualizarCV(@RequestHeader("Authorization") String token, @RequestBody Curriculum Curriculum) {
        if (jwtuil.isTokenExpired(token)) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Token Expirado");
        }

        Curriculum cv = CvDao.updateUser(token, Curriculum);
        if (cv != null){
            cv.getUser().setPassword(null);
            return ResponseEntity.ok(cv);
        }
        return null;
    }

}
