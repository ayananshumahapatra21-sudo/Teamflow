package com.teamflow.security;

import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;

import java.util.Optional;
import java.util.UUID;

public class SecurityUtils {

    public static Optional<UserPrincipal> getCurrentUserPrincipal() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication != null && authentication.getPrincipal() instanceof UserPrincipal principal) {
            return Optional.of(principal);
        }
        return Optional.empty();
    }

    public static UUID getCurrentUserId() {
        return getCurrentUserPrincipal()
                .map(UserPrincipal::getId)
                .orElseThrow(() -> new IllegalStateException("No authenticated user in security context"));
    }

    public static String getCurrentUserEmail() {
        return getCurrentUserPrincipal()
                .map(UserPrincipal::getUsername)
                .orElseThrow(() -> new IllegalStateException("No authenticated user in security context"));
    }
}
