package com.capg.userservice.repository;

import java.util.Optional;

import org.springframework.data.mongodb.repository.MongoRepository;

import com.capg.userservice.model.User;

public interface IUserRepository extends MongoRepository<User, String> {

	Optional<User> findByEmail(String email);

	User findByUserName(String userName);
}
