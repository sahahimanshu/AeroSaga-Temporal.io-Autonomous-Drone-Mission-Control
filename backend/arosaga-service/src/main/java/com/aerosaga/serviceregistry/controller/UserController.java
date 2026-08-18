package com.aerosaga.serviceregistry.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;

import com.aerosaga.serviceregistry.dto.UserDTO;
import com.aerosaga.serviceregistry.entity.User;
import com.aerosaga.serviceregistry.service.UserService;

@RestController
@RequestMapping("/api/users")
@CrossOrigin(origins = "http://localhost:5173")
public class UserController {

    private final UserService userService;

    public UserController(UserService userService) {
        this.userService = userService;
    }

    @PostMapping
    public ResponseEntity<User> createUser(@RequestBody User user) {
        User savedUser = userService.saveUser(user);
        return ResponseEntity.ok(savedUser);
    }
    
    @GetMapping
    public ResponseEntity<List<User>> getAllUsers() {
        return ResponseEntity.ok(userService.getAllUsers());
       
    }
    
    @PostMapping("/login")
    public ResponseEntity<UserDTO> loginUser(@RequestBody User user) {

        UserDTO loggedInUser =
                userService.loginUser(user.getEmail(), user.getPassword());

        return ResponseEntity.ok(loggedInUser);
    }
}