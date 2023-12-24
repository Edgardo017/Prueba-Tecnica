package com.springweb.springweb.Models;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

@Entity
@Table(name = "Skills")
public class Skills {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Getter @Setter
    private long id;

    @Getter @Setter
    private String skill;

    @Getter @Setter
    private int percentage;

    @Getter @Setter
    private int state;

}