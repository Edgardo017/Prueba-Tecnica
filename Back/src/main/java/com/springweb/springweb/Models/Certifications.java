package com.springweb.springweb.Models;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;
import java.sql.Date;

@Entity
@Table(name = "Certifications")
public class Certifications {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Getter @Setter
    private long id;

    @Getter @Setter
    private String name;

    @Getter @Setter
    private String career;

    @Getter @Setter
    private String status;

    @Temporal(TemporalType.DATE)
    @Getter @Setter
    private Date startYear;

    @Temporal(TemporalType.DATE)
    @Getter @Setter
    private Date endYear;

    @Getter @Setter
    private int state;
}
