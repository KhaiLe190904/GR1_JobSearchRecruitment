package com.jobsearch.backend.configuration;

import com.jobsearch.backend.features.authentication.model.AuthenticationUser;
import com.jobsearch.backend.features.authentication.repository.AuthenticationUserRepository;
import com.jobsearch.backend.features.authentication.service.AuthenticationService;
import com.jobsearch.backend.features.authentication.utils.Encoder;
import lombok.RequiredArgsConstructor;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
@RequiredArgsConstructor
public class LoadDatabaseConfig {
    private final Encoder encoder;

    @Bean
    public CommandLineRunner initDatabase(AuthenticationUserRepository authenticationUserRepository) {
        return args -> {
            AuthenticationUser authenticationUser = new AuthenticationUser("khai@gmail.com", encoder.encode("khai"));
//            AuthenticationUser authenticationUser2 = new AuthenticationUser("hieu@gmail.com", encoder.encode("khai"));
            authenticationUserRepository.save(authenticationUser);
//            authenticationUserRepository.save(authenticationUser2);
        };
    }
}
