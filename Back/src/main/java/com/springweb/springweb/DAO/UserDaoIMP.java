package com.springweb.springweb.DAO;

import com.springweb.springweb.Models.User;
import de.mkammerer.argon2.Argon2;
import de.mkammerer.argon2.Argon2Factory;
import jakarta.persistence.EntityManager;
import jakarta.persistence.PersistenceContext;
import jakarta.persistence.PersistenceException;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;
import java.util.List;
@Repository
@Transactional
public class UserDaoIMP implements UserDao{
    @PersistenceContext
    EntityManager entityManager;

    @Override
    public String addUser(User user) {
        String error = "error 402";
        try {
            Argon2 argon2 = Argon2Factory.create(Argon2Factory.Argon2Types.ARGON2id);
            user.setPassword(argon2.hash(1, 1024,1, user.getPassword()));
            entityManager.merge(user);
        } catch (PersistenceException e) {
            error = e.getMessage();
        }
        return error;
    }

    @Override
    public User loginUser(User user) {
        String query = "From User where username = :username";
        List<User> users = entityManager.createQuery(query).setParameter("username", user.getUsername()).getResultList();
        if (!users.isEmpty()){
            String password = users.get(0).getPassword();
            Argon2 argon2 = Argon2Factory.create(Argon2Factory.Argon2Types.ARGON2id);
            if (argon2.verify(password, user.getPassword()))
                return users.get(0);
        }
        return null;
    }

    @Override
    public boolean updateUser(User user) {
        User existingUser = entityManager.find(User.class, user.getId()); // Cambiar a user.getId() en lugar de user.getUsername()
        if (existingUser != null) {
            existingUser.setFirstName(user.getFirstName());
            existingUser.setLastName(user.getLastName());
            existingUser.setEmail(user.getEmail());
            existingUser.setDni(user.getDni());
            existingUser.setPhone(user.getPhone());
            existingUser.setAddress(user.getAddress());
            existingUser.setDistrict(user.getDistrict());
            existingUser.setCity(user.getCity());
            existingUser.setCountry(user.getCountry());
            existingUser.setProfileImage(user.getProfileImage());
            existingUser.setBannerImage(user.getBannerImage());
            entityManager.merge(existingUser);
            return true;
        }
        return false;
    }

}
