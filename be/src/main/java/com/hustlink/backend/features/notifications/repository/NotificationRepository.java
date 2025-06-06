package com.hustlink.backend.features.notifications.repository;

import com.hustlink.backend.features.authentication.model.User;
import com.hustlink.backend.features.notifications.model.Notification;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface NotificationRepository extends JpaRepository<Notification, Long> {
    List<Notification> findByRecipient(User recipient);
    List<Notification> findByRecipientOrderByCreationDateDesc(User user);
}
