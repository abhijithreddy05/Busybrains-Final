package com.example.ecommerce.controller;

import com.example.ecommerce.dto.PasswordChangeRequest;
import com.example.ecommerce.dto.UserProfileResponse;
import com.example.ecommerce.model.User;
import com.example.ecommerce.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

@CrossOrigin(origins = "*", maxAge = 3600)
@RestController
@RequestMapping("/api/profile")
public class UserController {

    @Autowired
    UserRepository userRepository;

    @Autowired
    PasswordEncoder encoder;

    @GetMapping
    public ResponseEntity<?> getUserProfile() {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        String username = auth.getName();
        
        return userRepository.findByUsername(username).map(user -> 
            ResponseEntity.ok(new UserProfileResponse(user.getId(), user.getUsername(), user.getEmail(), user.getRole().name()))
        ).orElseGet(() -> ResponseEntity.notFound().build());
    }

    @PutMapping
    public ResponseEntity<?> updateUserProfile(@RequestBody UserProfileResponse profileUpdate) {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        String currentUsername = auth.getName();
        
        return userRepository.findByUsername(currentUsername).map(user -> {
            if (profileUpdate.getEmail() != null) user.setEmail(profileUpdate.getEmail());
            if (profileUpdate.getUsername() != null && !profileUpdate.getUsername().equals(currentUsername)) {
               if(userRepository.existsByUsername(profileUpdate.getUsername())) {
                   return ResponseEntity.badRequest().body("Username is already taken");
               }
               user.setUsername(profileUpdate.getUsername());
            }
            userRepository.save(user);
            return ResponseEntity.ok("Profile updated successfully");
        }).orElseGet(() -> ResponseEntity.notFound().build());
    }

    @PutMapping("/change-password")
    public ResponseEntity<?> changePassword(@RequestBody PasswordChangeRequest pcr) {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        String username = auth.getName();

        return userRepository.findByUsername(username).map(user -> {
            if(encoder.matches(pcr.getOldPassword(), user.getPassword())) {
                user.setPassword(encoder.encode(pcr.getNewPassword()));
                userRepository.save(user);
                return ResponseEntity.ok("Password changed successfully");
            } else {
                return ResponseEntity.badRequest().body("Incorrect old password");
            }
        }).orElseGet(() -> ResponseEntity.notFound().build());
    }
}
