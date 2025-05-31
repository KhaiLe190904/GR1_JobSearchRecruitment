package com.hustlink.backend.features.notifications.model;

import com.hustlink.backend.features.authentication.model.AuthenticationUser;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.CreationTimestamp;

import java.time.LocalDateTime;

@Builder
@Data
@AllArgsConstructor
@NoArgsConstructor
@Entity(name = "notifications")
public class Notification {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    private AuthenticationUser recipient;
    @ManyToOne
    private AuthenticationUser actor;

    private boolean isRead;
    private NotificationType type;
    private Long resourceId;

    @CreationTimestamp
    private LocalDateTime creationDate;

    public Notification(AuthenticationUser actor, AuthenticationUser recipient, NotificationType type, Long resourceId) {
        this.actor = actor;
        this.recipient = recipient;
        this.type = type;
        this.isRead = false;
        this.resourceId = resourceId;
    }


}
