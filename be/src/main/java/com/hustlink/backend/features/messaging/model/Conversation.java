package com.hustlink.backend.features.messaging.model;


import com.hustlink.backend.features.authentication.model.AuthenticationUser;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.ArrayList;
import java.util.List;

@Entity(name = "conversations")
@Builder
@Data
@AllArgsConstructor
@NoArgsConstructor
public class Conversation {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(optional = false)
    private AuthenticationUser author;

    @ManyToOne(optional = false)
    private AuthenticationUser recipient;

    @OneToMany(mappedBy = "conversation", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<Message> messages = new ArrayList<>();

    public Conversation(AuthenticationUser author, AuthenticationUser recipient) {
        this.author = author;
        this.recipient = recipient;
    }
}
