package com.ebookstore.service;

import com.ebookstore.dto.*;
import com.ebookstore.entity.User;
import com.ebookstore.exception.BadRequestException;
import com.ebookstore.repository.UserRepository;
import com.ebookstore.security.JwtUtil;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.crypto.password.PasswordEncoder;

import java.util.Optional;

import static org.assertj.core.api.Assertions.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class AuthServiceTest {

    @Mock UserRepository       userRepository;
    @Mock PasswordEncoder      passwordEncoder;
    @Mock JwtUtil              jwtUtil;
    @Mock UserDetailsService   userDetailsService;
    @Mock AuthenticationManager authenticationManager;

    @InjectMocks AuthService authService;

    private User user;

    @BeforeEach
    void setUp() {
        user = User.builder()
                .id(1L)
                .fullName("Jane Doe")
                .email("jane@example.com")
                .passwordHash("hashed")
                .giftPoints(0)
                .build();
    }

    @Test
    void testRegister_Success() {
        RegisterRequest req = new RegisterRequest("Jane Doe", "jane@example.com", "password123", null);
        when(userRepository.existsByEmail("jane@example.com")).thenReturn(false);
        when(passwordEncoder.encode("password123")).thenReturn("hashed");
        when(userRepository.save(any())).thenReturn(user);
        UserDetails ud = mock(UserDetails.class);
        when(userDetailsService.loadUserByUsername("jane@example.com")).thenReturn(ud);
        when(jwtUtil.generateToken(ud)).thenReturn("token123");

        AuthResponse res = authService.register(req);

        assertThat(res.token()).isEqualTo("token123");
        assertThat(res.email()).isEqualTo("jane@example.com");
        verify(userRepository).save(any());
    }

    @Test
    void testRegister_EmailAlreadyExists() {
        RegisterRequest req = new RegisterRequest("Jane", "jane@example.com", "password123", null);
        when(userRepository.existsByEmail("jane@example.com")).thenReturn(true);

        assertThatThrownBy(() -> authService.register(req))
                .isInstanceOf(BadRequestException.class)
                .hasMessageContaining("Email already in use");
    }

    @Test
    void testLogin_Success() {
        LoginRequest req = new LoginRequest("jane@example.com", "password123");
        when(userRepository.findByEmail("jane@example.com")).thenReturn(Optional.of(user));
        UserDetails ud = mock(UserDetails.class);
        when(userDetailsService.loadUserByUsername("jane@example.com")).thenReturn(ud);
        when(jwtUtil.generateToken(ud)).thenReturn("token456");

        AuthResponse res = authService.login(req);

        assertThat(res.token()).isEqualTo("token456");
    }

    @Test
    void testLogin_WrongPassword() {
        LoginRequest req = new LoginRequest("jane@example.com", "wrong");
        doThrow(new BadCredentialsException("Bad credentials"))
                .when(authenticationManager)
                .authenticate(any(UsernamePasswordAuthenticationToken.class));

        assertThatThrownBy(() -> authService.login(req))
                .isInstanceOf(BadRequestException.class);
    }

    @Test
    void testLogin_UserNotFound() {
        LoginRequest req = new LoginRequest("nobody@example.com", "password123");
        when(userRepository.findByEmail("nobody@example.com")).thenReturn(Optional.empty());

        assertThatThrownBy(() -> authService.login(req))
                .isInstanceOf(BadRequestException.class);
    }
}
