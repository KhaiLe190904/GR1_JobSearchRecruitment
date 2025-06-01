package com.hustlink.backend.features.messaging.controller;

import com.hustlink.backend.dto.Response;
import com.hustlink.backend.features.authentication.model.AuthenticationUser;
import com.hustlink.backend.features.messaging.dto.MessageDto;
import com.hustlink.backend.features.messaging.model.Conversation;
import com.hustlink.backend.features.messaging.model.Message;
import com.hustlink.backend.features.messaging.service.MessageService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/v1/messaging")
public class MessageController {
    private final MessageService messageService;

    @GetMapping("/conversations")
    public List<Conversation> getConversations(@RequestAttribute("authenticationUser") AuthenticationUser user) {
        return messageService.getConversationOfUser(user);
    }

    @GetMapping("/conversations{conversationId}")
    public Conversation getConversation(@RequestAttribute("authenticationUser") AuthenticationUser user, @PathVariable Long conversationId) {
        return messageService.getConversation(user, conversationId);
    }

    @PostMapping("/conversations")
    public Conversation createConversation(@RequestAttribute("authenticationUser") AuthenticationUser sender, @RequestBody MessageDto messageDto) {
        return messageService.createConversationAndAddMessage(sender, messageDto.receiverId(), messageDto.content());
    }

    @PostMapping("/conversations/{conversationId}/messages")
    public Message addMessageToConversation(@RequestAttribute("authenticationUser") AuthenticationUser sender, @RequestBody MessageDto messageDto, @PathVariable Long conversationId) {
        return messageService.addMessageToConversation(conversationId, sender, messageDto.receiverId(), messageDto.content());
    }

    @PutMapping("/conversations/messages/{messageId}")
    public Response markMessageAsRead(@RequestAttribute("authenticationUser") AuthenticationUser user, @PathVariable Long messageId) {
        messageService.markMessageAsRead(user, messageId);
        return new Response("Message marked as read");
    }
}
