package com.teamflow;

import com.teamflow.auth.AuthService;
import com.teamflow.auth.dto.AuthResponse;
import com.teamflow.auth.dto.LoginRequest;
import com.teamflow.auth.dto.RegisterRequest;
import com.teamflow.common.BadRequestException;
import com.teamflow.security.JwtTokenProvider;
import com.teamflow.user.SystemRole;
import com.teamflow.user.User;
import com.teamflow.user.UserRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.crypto.password.PasswordEncoder;

import java.util.Optional;
import java.util.UUID;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class AuthServiceTest {

    @Mock
    private AuthenticationManager authenticationManager;

    @Mock
    private UserRepository userRepository;

    @Mock
    private PasswordEncoder passwordEncoder;

    @Mock
    private JwtTokenProvider tokenProvider;

    @InjectMocks
    private AuthService authService;

    private User sampleUser;

    @BeforeEach
    void setUp() {
        sampleUser = new User("test@teamflow.io", "encodedPass", "Test User", null, SystemRole.ROLE_USER);
        sampleUser.setId(UUID.randomUUID());
    }

    @Test
    void register_Success() {
        RegisterRequest request = new RegisterRequest("Test User", "test@teamflow.io", "Password123!");

        when(userRepository.existsByEmail("test@teamflow.io")).thenReturn(false);
        when(passwordEncoder.encode(any())).thenReturn("encodedPass");
        when(userRepository.save(any(User.class))).thenReturn(sampleUser);
        when(tokenProvider.generateAccessToken(any(), any())).thenReturn("mock-access-token");
        when(tokenProvider.generateRefreshToken(any())).thenReturn("mock-refresh-token");

        AuthResponse response = authService.register(request);

        assertNotNull(response);
        assertEquals("mock-access-token", response.getAccessToken());
        assertEquals("mock-refresh-token", response.getRefreshToken());
        assertEquals("test@teamflow.io", response.getUser().getEmail());
    }

    @Test
    void register_DuplicateEmail_ThrowsBadRequest() {
        RegisterRequest request = new RegisterRequest("Test User", "test@teamflow.io", "Password123!");
        when(userRepository.existsByEmail("test@teamflow.io")).thenReturn(true);

        assertThrows(BadRequestException.class, () -> authService.register(request));
        verify(userRepository, never()).save(any());
    }

    @Test
    void login_Success() {
        LoginRequest request = new LoginRequest("test@teamflow.io", "Password123!");
        Authentication authentication = mock(Authentication.class);

        when(authenticationManager.authenticate(any(UsernamePasswordAuthenticationToken.class))).thenReturn(authentication);
        when(userRepository.findByEmail("test@teamflow.io")).thenReturn(Optional.of(sampleUser));
        when(tokenProvider.generateAccessToken(any(), any())).thenReturn("mock-access-token");
        when(tokenProvider.generateRefreshToken(any())).thenReturn("mock-refresh-token");

        AuthResponse response = authService.login(request);

        assertNotNull(response);
        assertEquals("mock-access-token", response.getAccessToken());
        assertEquals("test@teamflow.io", response.getUser().getEmail());
    }
}
