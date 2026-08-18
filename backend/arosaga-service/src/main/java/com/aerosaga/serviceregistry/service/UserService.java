package com.aerosaga.serviceregistry.service;
import java.util.List;
import org.springframework.stereotype.Service;

import com.aerosaga.serviceregistry.entity.User;
import com.aerosaga.serviceregistry.repository.UserRepository;

@Service
public class UserService {

    private final UserRepository userRepository;

    public UserService(UserRepository userRepository) {
        this.userRepository = userRepository;	
    }

    public User saveUser(User user) {
        return userRepository.save(user);
    }
    
    public List<User> getAllUsers() {
        return userRepository.findAll();
    }
}