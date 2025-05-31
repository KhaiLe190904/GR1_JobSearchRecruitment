package com.hustlink.backend.features.authentication.model;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.hustlink.backend.features.feed.model.Post;
import com.hustlink.backend.features.notifications.model.Notification;
import jakarta.persistence.*;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotNull;
import lombok.*;

import java.time.LocalDateTime;
import java.util.List;

@Entity(name = "users")
@Builder
@Data
@AllArgsConstructor
@NoArgsConstructor
public class AuthenticationUser {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(unique = true, nullable = false)
    private String email;
    private Boolean emailVerified = false;
    private String emailVerificationToken = null;
    private LocalDateTime emailVerificationTokenExpiryDate = null;

    @JsonIgnore
    private String password;
    private String passwordResetToken = null;
    private LocalDateTime passwordResetTokenExpiryDate = null;

    private String firstName = null;
    private String lastName = null;
    private String company = null;
    private String position = null;
    private String location = null;
    private Boolean profileComplete = false;
    private String profilePicture = null;

    @JsonIgnore
    @OneToMany(mappedBy = "recipient", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<Notification> receivedNotifications;

    @JsonIgnore
    @OneToMany(mappedBy = "actor", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<Notification> actedNotifications;

    @JsonIgnore
    @OneToMany(mappedBy = "author", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<Post> posts;

    public AuthenticationUser(String email, String password) {
        this.email = email;
        this.password = password;
    }

    public void updateProfileComplete() {
        this.profileComplete = (this.firstName != null && this.lastName != null && this.company != null && this.position != null && this.location != null);
    }

    public void setFirstName(String firstName) {
        this.firstName = firstName;
        updateProfileComplete();
    }

    public void setLastName(String lastName) {
        this.lastName = lastName;
        updateProfileComplete();
    }

    public void setCompany(String company) {
        this.company = company;
        updateProfileComplete();
    }

    public void setPosition(String position) {
        this.position = position;
        updateProfileComplete();
    }

    public void setLocation(String location) {
        this.location = location;
        updateProfileComplete();
    }
}
