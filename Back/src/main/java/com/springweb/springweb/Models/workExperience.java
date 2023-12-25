package com.springweb.springweb.Models;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;
import java.sql.Date;
@Entity
@Table(name = "workExperience")
public class workExperience {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Getter @Setter
    private long id;

    @Getter @Setter
    private String company;

    @Getter @Setter
    private String country;

    @Getter @Setter
    private String job;

    @Temporal(TemporalType.DATE)
    @Getter @Setter
    private Date startDate;

    @Temporal(TemporalType.DATE)
    @Getter @Setter
    private Date endDate;

    @Getter @Setter @Column(length = 5000)
    private String functions;

    @Getter @Setter
    private int state;

    @ManyToOne
    @JoinColumn(name = "userid", referencedColumnName = "id")
    @Getter @Setter
    private User user;
}
