package com.springweb.springweb.DAO;

import com.springweb.springweb.Models.*;
import com.springweb.springweb.Utils.JWTUtil;
import de.mkammerer.argon2.Argon2;
import de.mkammerer.argon2.Argon2Factory;
import jakarta.persistence.EntityManager;
import jakarta.persistence.PersistenceContext;
import jakarta.persistence.PersistenceException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;

import java.io.FileOutputStream;
import java.io.IOException;
import java.util.Base64;
import java.util.List;
@Repository
@Transactional

public class CvDaoIMP implements CvDao{
    @PersistenceContext
    EntityManager entityManager;
    @Autowired
    private JWTUtil jwtuil;

    @Override
    public User getUser(long id) {
        String query = "FROM User WHERE id = :id";
        List<User> users = entityManager.createQuery(query, User.class).setParameter("id", id).getResultList();
        if (!users.isEmpty()) {
            return users.get(0);
        }
        return null;
    }

    @Override
    public List<workExperience> getWorkExperiencesByUserId(long userId) {
        String query = "FROM workExperience WHERE user.id = :userId";
        return entityManager.createQuery(query, workExperience.class).setParameter("userId", userId).getResultList();
    }

    @Override
    public List<Certifications> getCertificationsByUserId(long userId) {
        String query = "FROM Certifications WHERE user.id = :userId";
        return entityManager.createQuery(query, Certifications.class).setParameter("userId", userId).getResultList();
    }

    @Override
    public List<Skills> getSkillsByUserId(long userId) {
        String query = "FROM Skills WHERE user.id = :userId";
        return entityManager.createQuery(query, Skills.class).setParameter("userId", userId).getResultList();
    }

    @Override
    public List<workExperience> getWorkExperiencesByUserUsername(String username) {
        String query = "FROM workExperience WHERE user.username = :username";
        return entityManager.createQuery(query, workExperience.class).setParameter("username", username).getResultList();
    }

    @Override
    public List<Certifications> getCertificationsByUserUsername(String username) {
        String query = "FROM Certifications WHERE user.username = :username";
        return entityManager.createQuery(query, Certifications.class).setParameter("username", username).getResultList();
    }

    @Override
    public List<Skills> getSkillsByUserUsername(String username) {
        String query = "FROM Skills WHERE user.username = :username";
        return entityManager.createQuery(query, Skills.class).setParameter("username", username).getResultList();
    }

    @Override
    public User getUserByUsername(String username) {
        String query = "SELECT u FROM User u WHERE u.username = :username";
        User user = entityManager.createQuery(query, User.class).setParameter("username", username).getSingleResult();
        return user;
    }


    @Override
    public String saveProfileImage(User user) {
        String profileImage = user.getProfileImage();
        if (profileImage != null && !profileImage.isEmpty() && !profileImage.startsWith("Images/")) {
            // Verificar si la cadena es un formato base64 válido
            if (isBase64String(profileImage)) {
                try {
                    byte[] imageData = Base64.getDecoder().decode(profileImage);

                    String fileName = user.getUsername() + "profile.png";
                    String staticDir = System.getProperty("user.dir") + "/src/main/resources/static/";
                    String filePath = staticDir + "Images/Profiles/" + fileName;

                    FileOutputStream fos = new FileOutputStream(filePath);
                    fos.write(imageData);
                    fos.close();

                    System.out.println("Imagen guardada en: " + filePath);
                    return "Images/Profiles/" + fileName;
                } catch (IOException e) {
                    e.printStackTrace();
                }
            } else {
                System.out.println("El formato de la imagen no es base64. :"+profileImage);
                return profileImage;
            }
        }
        return profileImage;
    }

    @Override
    public String saveBannerImage(User user) {
        String bannerImage = user.getBannerImage();
        if (bannerImage != null && !bannerImage.isEmpty() && !bannerImage.startsWith("Images/")) {
            if (isBase64String(bannerImage)) {
                try {
                    byte[] imageData = Base64.getDecoder().decode(bannerImage);

                    String fileName = user.getUsername() + "banner.png";
                    String staticDir = System.getProperty("user.dir") + "/src/main/resources/static/";
                    String filePath = staticDir + "Images/Banners/" + fileName;

                    FileOutputStream fos = new FileOutputStream(filePath);
                    fos.write(imageData);
                    fos.close();

                    System.out.println("Imagen guardada en: " + filePath);
                    return "Images/Banners/" + fileName;
                } catch (IOException e) {
                    e.printStackTrace();
                }
            } else {
                System.out.println("El formato de la imagen no es base64. :"+bannerImage);
                return bannerImage;
            }
        }
        return bannerImage;
    }


    @Override
    public Curriculum updateUser(String token, Curriculum curriculum) {
        User user = curriculum.getUser();
        List<workExperience> workExperiences = curriculum.getWorkExperience();
        List<Certifications> certifications = curriculum.getCertifications(); // Obtener la lista de certificados
        List<Skills> skills = curriculum.getSkills(); // Obtener la lista de habilidades

        String tokenUserId = jwtuil.getKey(token);
        Long userId = Long.parseLong(tokenUserId);
        user.setId(userId);

        User existingUser = entityManager.find(User.class, userId);
        if (existingUser != null) {
            user.setPassword(existingUser.getPassword());
            existingUser.setFirstName(user.getFirstName());
            existingUser.setLastName(user.getLastName());
            existingUser.setEmail(user.getEmail());
            existingUser.setDni(user.getDni());
            existingUser.setPhone(user.getPhone());
            existingUser.setAddress(user.getAddress());
            existingUser.setDistrict(user.getDistrict());
            existingUser.setCity(user.getCity());
            existingUser.setCountry(user.getCountry());
            existingUser.setProfile(user.getProfile());
            existingUser.setPresentation(user.getPresentation());
            existingUser.setProfileImage(saveProfileImage(user));
            existingUser.setBannerImage(saveBannerImage(user));

            if (workExperiences != null && !workExperiences.isEmpty()) {
                for (workExperience experience : workExperiences) {
                    if (experience.getState() == 1) {
                        experience.setUser(existingUser); // Asignar el usuario a la experiencia laboral
                        if (experience.getId() != 0) {
                            // Si ya tiene un ID, actualizar la experiencia existente
                            entityManager.merge(experience);
                        } else {
                            // Si no tiene ID, es una nueva experiencia, se guarda
                            entityManager.persist(experience);
                        }
                    } else if (experience.getState() != 1 && experience.getId() != 0) {
                        // Si el estado no es 1 y tiene un ID, eliminar la experiencia
                        workExperience existingExperience = entityManager.find(workExperience.class, experience.getId());
                        if (existingExperience != null) {
                            entityManager.remove(existingExperience);
                        }
                    }
                }
            }

            // Lógica para trabajar con certificados
            if (certifications != null && !certifications.isEmpty()) {
                for (Certifications certificate : certifications) {
                    if (certificate.getState() == 1) {
                        certificate.setUser(existingUser); // Asignar el usuario al certificado
                        if (certificate.getId() != 0) {
                            // Si ya tiene un ID, actualizar el certificado existente
                            entityManager.merge(certificate);
                        } else {
                            // Si no tiene ID, es un nuevo certificado, se guarda
                            entityManager.persist(certificate);
                        }
                    } else if (certificate.getState() != 1 && certificate.getId() != 0) {
                        // Si el estado no es 1 y tiene un ID, eliminar el certificado
                        Certifications existingCertificate = entityManager.find(Certifications.class, certificate.getId());
                        if (existingCertificate != null) {
                            entityManager.remove(existingCertificate);
                        }
                    }
                }
            }
            if (skills != null && !skills.isEmpty()) {
                for (Skills skill : skills) {
                    if (skill.getState() == 1) {
                        skill.setUser(existingUser);
                        if (skill.getId() != 0) {
                            entityManager.merge(skill);
                        } else {
                            entityManager.persist(skill);
                        }
                    } else if (skill.getState() != 1 && skill.getId() != 0) {
                        Skills existingSkill = entityManager.find(Skills.class, skill.getId());
                        if (existingSkill != null) {
                            entityManager.remove(existingSkill);
                        }
                    }
                }
            }

            entityManager.merge(existingUser);

            return curriculum;
        }
        return null;
    }



    private boolean isBase64String(String str) {
        try {
            Base64.getDecoder().decode(str);
            return true;
        } catch (IllegalArgumentException e) {
            return false;
        }
    }

}
