package com.springweb.springweb.Models;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

@Entity
@Table(name = "users")
public class User {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Getter @Setter
    private long id;
    @Column(unique = true)
    @Getter @Setter
    private String username;
    @Getter @Setter
    private String password;
    @Getter @Setter
    @Column(unique = true)
    private String email;
    @Getter @Setter
    private String firstName;
    @Getter @Setter
    private String lastName;
    @Getter @Setter
    private String dni;
    @Getter @Setter
    private String phone;
    @Getter @Setter
    private String address;
    @Getter @Setter
    private String district;
    @Getter @Setter
    private String city;
    @Getter @Setter
    private String country;
    @Getter @Setter @Column(columnDefinition = "LONGTEXT")
    private String profileImage;
    @Getter @Setter @Column(columnDefinition = "LONGTEXT")
    private String bannerImage;
}
