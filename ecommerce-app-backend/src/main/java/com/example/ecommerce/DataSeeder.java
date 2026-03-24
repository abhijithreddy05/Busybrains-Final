package com.example.ecommerce;

import com.example.ecommerce.model.Role;
import com.example.ecommerce.model.User;
import com.example.ecommerce.model.Product;
import com.example.ecommerce.repository.ProductRepository;
import com.example.ecommerce.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;
import java.math.BigDecimal;

@Component
public class DataSeeder implements CommandLineRunner {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private ProductRepository productRepository;

    @Autowired
    private PasswordEncoder encoder;

    @Override
    public void run(String... args) throws Exception {
        if (!userRepository.existsByUsername("admin")) {
            User admin = new User();
            admin.setUsername("admin");
            admin.setPassword(encoder.encode("password"));
            admin.setEmail("admin@example.com");
            admin.setRole(Role.ROLE_ADMIN);
            userRepository.save(admin);
        }

        if (!userRepository.existsByUsername("user")) {
            User user = new User();
            user.setUsername("user");
            user.setPassword(encoder.encode("password"));
            user.setEmail("user@example.com");
            user.setRole(Role.ROLE_USER);
            userRepository.save(user);
        }

        if (productRepository.count() == 0) {
            Product p1 = new Product(null, "Laptop", "High end gaming laptop", new BigDecimal("1500.00"), "https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=800&q=80");
            Product p2 = new Product(null, "Smartphone", "Latest OLED smartphone", new BigDecimal("999.99"), "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=800&q=80");
            Product p3 = new Product(null, "Headphones", "Noise cancelling wireless headphones", new BigDecimal("250.00"), "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800&q=80");
            productRepository.save(p1);
            productRepository.save(p2);
            productRepository.save(p3);
        } else {
            for (Product p : productRepository.findAll()) {
                if (p.getImageUrl() == null) {
                    if ("Laptop".equals(p.getName())) p.setImageUrl("https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=800&q=80");
                    else if ("Smartphone".equals(p.getName())) p.setImageUrl("https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=800&q=80");
                    else if ("Headphones".equals(p.getName())) p.setImageUrl("https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800&q=80");
                    productRepository.save(p);
                }
            }
        }
    }
}
