package com.teamflow.user;

import com.teamflow.common.ResourceNotFoundException;
import com.teamflow.security.SecurityUtils;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
public class UserService {

    private final UserRepository userRepository;

    public UserService(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    @Transactional(readOnly = true)
    public UserDto getCurrentUser() {
        UUID currentUserId = SecurityUtils.getCurrentUserId();
        User user = userRepository.findById(currentUserId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with id: " + currentUserId));
        return UserDto.fromEntity(user);
    }

    @Transactional(readOnly = true)
    public UserDto getUserById(UUID id) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with id: " + id));
        return UserDto.fromEntity(user);
    }

    @Transactional(readOnly = true)
    public List<UserDto> searchUsers(String query) {
        if (query == null || query.trim().isEmpty()) {
            return userRepository.findAll().stream()
                    .map(UserDto::fromEntity)
                    .collect(Collectors.toList());
        }
        return userRepository.findByFullNameContainingIgnoreCaseOrEmailContainingIgnoreCase(query, query)
                .stream()
                .map(UserDto::fromEntity)
                .collect(Collectors.toList());
    }
}
