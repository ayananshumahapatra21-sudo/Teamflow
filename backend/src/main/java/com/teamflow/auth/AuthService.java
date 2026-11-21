package com.teamflow.auth;

import com.teamflow.auth.dto.AuthResponse;
import com.teamflow.auth.dto.LoginRequest;
import com.teamflow.auth.dto.RefreshTokenRequest;
import com.teamflow.auth.dto.RegisterRequest;
import com.teamflow.common.BadRequestException;
import com.teamflow.common.ResourceNotFoundException;
import com.teamflow.security.JwtTokenProvider;
import com.teamflow.user.SystemRole;
import com.teamflow.user.User;
import com.teamflow.user.UserDto;
import com.teamflow.user.UserRepository;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.UUID;

@Service
public class AuthService {

    private final AuthenticationManager authenticationManager;
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtTokenProvider tokenProvider;

    public AuthService(AuthenticationManager authenticationManager,
                       UserRepository userRepository,
                       PasswordEncoder passwordEncoder,
                       JwtTokenProvider tokenProvider) {
        this.authenticationManager = authenticationManager;
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
        this.tokenProvider = tokenProvider;
    }

    @Transactional
    public AuthResponse register(RegisterRequest request) {
        if (userRepository.existsByEmail(request.getEmail().toLowerCase().trim())) {
            throw new BadRequestException("Email address is already in use.");
        }

        User user = new User(
                request.getEmail().toLowerCase().trim(),
                passwordEncoder.encode(request.getPassword()),
                request.getFullName().trim(),
                "https://api.dicebear.com/7.x/avataaars/svg?seed=" + request.getEmail().toLowerCase().trim(),
                SystemRole.ROLE_USER
        );

        User savedUser = userRepository.save(user);

        String accessToken = tokenProvider.generateAccessToken(savedUser.getId(), savedUser.getEmail());
        String refreshToken = tokenProvider.generateRefreshToken(savedUser.getId());

        return new AuthResponse(accessToken, refreshToken, UserDto.fromEntity(savedUser));
    }

    public AuthResponse login(LoginRequest request) {
        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(
                        request.getEmail().toLowerCase().trim(),
                        request.getPassword()
                )
        );

        SecurityContextHolder.getContext().setAuthentication(authentication);

        User user = userRepository.findByEmail(request.getEmail().toLowerCase().trim())
                .orElseThrow(() -> new ResourceNotFoundException("User not found with email: " + request.getEmail()));

        String accessToken = tokenProvider.generateAccessToken(user.getId(), user.getEmail());
        String refreshToken = tokenProvider.generateRefreshToken(user.getId());

        return new AuthResponse(accessToken, refreshToken, UserDto.fromEntity(user));
    }

    public AuthResponse refreshToken(RefreshTokenRequest request) {
        if (!tokenProvider.validateToken(request.getRefreshToken())) {
            throw new BadRequestException("Invalid or expired refresh token.");
        }

        UUID userId = tokenProvider.getUserIdFromToken(request.getRefreshToken());
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        String newAccessToken = tokenProvider.generateAccessToken(user.getId(), user.getEmail());
        return new AuthResponse(newAccessToken, request.getRefreshToken(), UserDto.fromEntity(user));
    }
}
