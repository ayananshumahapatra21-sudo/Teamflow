package com.teamflow.notification;

import com.teamflow.common.ResourceNotFoundException;
import com.teamflow.notification.dto.NotificationDto;
import com.teamflow.security.SecurityUtils;
import com.teamflow.user.User;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
public class NotificationService {

    private final NotificationRepository notificationRepository;
    private final SimpMessagingTemplate messagingTemplate;

    public NotificationService(NotificationRepository notificationRepository,
                               SimpMessagingTemplate messagingTemplate) {
        this.notificationRepository = notificationRepository;
        this.messagingTemplate = messagingTemplate;
    }

    @Transactional
    public NotificationDto createAndSend(User recipient, String title, String message, NotificationType type) {
        Notification notification = new Notification(recipient, title, message, type);
        Notification saved = notificationRepository.save(notification);
        NotificationDto dto = NotificationDto.fromEntity(saved);

        try {
            // Push to personal STOMP topic for recipient
            messagingTemplate.convertAndSend("/topic/notifications/" + recipient.getId(), dto);
        } catch (Exception e) {
            // Non-blocking if WS is disconnected
        }

        return dto;
    }

    @Transactional(readOnly = true)
    public List<NotificationDto> getCurrentUserNotifications() {
        UUID currentUserId = SecurityUtils.getCurrentUserId();
        return notificationRepository.findByRecipientIdOrderByCreatedAtDesc(currentUserId)
                .stream()
                .map(NotificationDto::fromEntity)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public long getUnreadCount() {
        UUID currentUserId = SecurityUtils.getCurrentUserId();
        return notificationRepository.countByRecipientIdAndReadFalse(currentUserId);
    }

    @Transactional
    public void markAsRead(UUID notificationId) {
        Notification notification = notificationRepository.findById(notificationId)
                .orElseThrow(() -> new ResourceNotFoundException("Notification not found with id: " + notificationId));
        notification.setRead(true);
        notificationRepository.save(notification);
    }

    @Transactional
    public void markAllAsRead() {
        UUID currentUserId = SecurityUtils.getCurrentUserId();
        List<Notification> unread = notificationRepository.findByRecipientIdOrderByCreatedAtDesc(currentUserId);
        for (Notification n : unread) {
            if (!n.isRead()) {
                n.setRead(true);
            }
        }
        notificationRepository.saveAll(unread);
    }
}
