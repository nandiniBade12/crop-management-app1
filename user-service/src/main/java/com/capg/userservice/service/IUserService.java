package com.capg.userservice.service;

import java.util.List;

import com.capg.userservice.exceptions.UserNotFoundException;
import com.capg.userservice.exceptions.WrongPasswordException;
import com.capg.userservice.model.Login;
import com.capg.userservice.model.User;

public interface IUserService {

	public List<User> fetchAllUsers();
	public User fetchUser(String id) throws UserNotFoundException;
	public User fetchUserByEmail(String username) throws UserNotFoundException;
	public String addUser(User userInfo);
	public String deleteUserByEmail(String username);
	public User login(Login user) throws UserNotFoundException , WrongPasswordException;
	public User updateUserByEmail(String username, User user) throws UserNotFoundException;
	public User updatePasswordByEmail(String email, String password);
}
