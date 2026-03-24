package com.example.ecommerce.security;

import com.example.ecommerce.repository.UserRepository;
import com.example.ecommerce.model.Role;
import com.example.ecommerce.model.User;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.dao.DaoAuthenticationProvider;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.security.oauth2.client.authentication.OAuth2AuthenticationToken;
import org.springframework.security.oauth2.core.user.OAuth2User;

import java.util.Optional;
import java.util.UUID;

@Configuration
@EnableWebSecurity
@EnableMethodSecurity
public class WebSecurityConfig {

    @Autowired
    UserDetailsServiceImpl userDetailsService;

    @Autowired
    private AuthEntryPointJwt unauthorizedHandler;

    @Autowired
    private JwtUtils jwtUtils;

    @Autowired
    private UserRepository userRepository;

    @Bean
    public AuthTokenFilter authenticationJwtTokenFilter() {
        return new AuthTokenFilter();
    }

    @Bean
    public DaoAuthenticationProvider authenticationProvider() {
        DaoAuthenticationProvider authProvider = new DaoAuthenticationProvider(userDetailsService);
        authProvider.setPasswordEncoder(passwordEncoder());
        return authProvider;
    }

    @Bean
    public AuthenticationManager authenticationManager(AuthenticationConfiguration authConfig) throws Exception {
        return authConfig.getAuthenticationManager();
    }

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
        http
            .cors() // ⭐ important
            .and()
            .csrf(csrf -> csrf.disable())
            .exceptionHandling(exception -> exception.authenticationEntryPoint(unauthorizedHandler))
            .sessionManagement(session -> session.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
            .authorizeHttpRequests(auth -> auth
                .requestMatchers(org.springframework.http.HttpMethod.OPTIONS, "/**").permitAll()
                .requestMatchers("/api/auth/**").permitAll()
                .requestMatchers("/api/products").permitAll()
                .anyRequest().authenticated()
            )
            .oauth2Login(oauth2 -> oauth2
                .successHandler((request, response, authentication) -> {
                    OAuth2AuthenticationToken oauthToken = (OAuth2AuthenticationToken) authentication;
                    OAuth2User oAuth2User = oauthToken.getPrincipal();

                    String email = oAuth2User.getAttribute("email");
                    String name = oAuth2User.getAttribute("name");
                    if (name == null) name = email.split("@")[0];

                    Optional<User> userOpt = userRepository.findByEmail(email);
                    User user;

                    if (userOpt.isEmpty()) {
                        user = new User();
                        user.setEmail(email);
                        user.setUsername(name + "_" + UUID.randomUUID().toString().substring(0, 5));
                        user.setPassword(passwordEncoder().encode(UUID.randomUUID().toString()));
                        user.setRole(Role.ROLE_USER);
                        userRepository.save(user);
                    } else {
                        user = userOpt.get();
                    }

                    String jwt = jwtUtils.generateTokenFromUsername(user.getUsername());

                    String frontendUrl = System.getenv("APP_FRONTEND_URL");
                    if (frontendUrl == null) {
                        frontendUrl = "http://localhost:3000";
                    }

                    response.sendRedirect(frontendUrl + "/oauth2/redirect?token=" + jwt);
                })
            );

        http.authenticationProvider(authenticationProvider());
        http.addFilterBefore(authenticationJwtTokenFilter(), UsernamePasswordAuthenticationFilter.class);

        return http.build();
    }
}