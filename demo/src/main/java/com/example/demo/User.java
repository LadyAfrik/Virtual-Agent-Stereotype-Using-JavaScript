package com.example.demo;

import jakarta.persistence.*;

@Entity
@Table(name = "users")
public class User {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(unique = true, nullable = false)
    private String email;

    private String gender;
    private int age;
    private String levelOfStudy;
    private String affiliation;
    private String password;

    @Column(nullable = false, columnDefinition = "TINYINT(1) DEFAULT 0")
    private int watchedTheVideos;  // 0 or 1

    @Column(nullable = false, columnDefinition = "TINYINT(1) DEFAULT 0")
    private int takenTheSurvey;  // 0 or 1

    @Column(nullable = false, columnDefinition = "INT DEFAULT 0")
    private int lastWatchedVideo; // Stores index of the last watched video

    public User() {}

    public User(String email, String gender, int age, String levelOfStudy, String affiliation, String password, int watchedTheVideos, int takenTheSurvey, int lastWatchedVideo) {
        this.email = email;
        this.gender = gender;
        this.age = age;
        this.levelOfStudy = levelOfStudy;
        this.affiliation = affiliation;
        this.password = password;
        this.watchedTheVideos = watchedTheVideos;
        this.takenTheSurvey = takenTheSurvey;
        this.lastWatchedVideo = lastWatchedVideo;
    }

    // Getters & Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }

    public String getGender() { return gender; }
    public void setGender(String gender) { this.gender = gender; }

    public int getAge() { return age; }
    public void setAge(int age) { this.age = age; }

    public String getLevelOfStudy() { return levelOfStudy; }
    public void setLevelOfStudy(String levelOfStudy) { this.levelOfStudy = levelOfStudy; }

    public String getAffiliation() { return affiliation; }
    public void setAffiliation(String affiliation) { this.affiliation = affiliation; }

    public String getPassword() { return password; }
    public void setPassword(String password) { this.password = password; }

    public int getWatchedTheVideos() { return watchedTheVideos; }
    public void setWatchedTheVideos(int watchedTheVideos) { this.watchedTheVideos = watchedTheVideos; }

    public int getTakenTheSurvey() { return takenTheSurvey; }
    public void setTakenTheSurvey(int takenTheSurvey) { this.takenTheSurvey = takenTheSurvey; }

    public int getLastWatchedVideo() { return lastWatchedVideo; }
    public void setLastWatchedVideo(int lastWatchedVideo) { this.lastWatchedVideo = lastWatchedVideo; }
}
