package com.aerosaga.serviceregistry.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.aerosaga.serviceregistry.entity.User;

public interface UserRepository extends JpaRepository<User, Long> {

}