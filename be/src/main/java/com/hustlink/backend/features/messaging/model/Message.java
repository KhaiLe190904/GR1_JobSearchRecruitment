package com.hustlink.backend.features.messaging.model;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.hustlink.backend.features.authentication.model.AuthenticationUser;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.CreationTimestamp;

import java.time.LocalDateTime;

@Entity(name = "messages")
@Builder
@Data
@AllArgsConstructor
@NoArgsConstructor
public class Message {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(optional = false)
    private AuthenticationUser sender;

    @ManyToOne(optional = false)
    private AuthenticationUser receiver;

    @JsonIgnore
    @ManyToOne(optional = false)
    private Conversation conversation;

    private String content;
    private boolean isRead;

    @CreationTimestamp
    private LocalDateTime creationAt;

    public Message(AuthenticationUser sender, AuthenticationUser receiver, Conversation conversation, String content) {
        this.sender = sender;
        this.receiver = receiver;
        this.conversation = conversation;
        this.content = content;
    }

}
