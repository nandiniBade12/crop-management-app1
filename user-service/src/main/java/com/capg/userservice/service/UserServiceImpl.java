package com.capg.userservice.service;

import java.util.HashSet;
import java.util.List;
import java.util.Optional;
import java.util.Set;
import java.util.UUID;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.capg.userservice.exceptions.UserNotFoundException;
import com.capg.userservice.exceptions.WrongPasswordException;
import com.capg.userservice.model.Login;
import com.capg.userservice.model.User;
import com.capg.userservice.repository.IUserRepository;

@Service
public class UserServiceImpl implements IUserService {

	@Autowired
	private IUserRepository repository;
	@Autowired
	private PasswordEncoder passwordEncoder;
    
	boolean flag;
	 
	private Set<String> setOfEmailIds = new HashSet<>();
	
	 private String userNotFound = "User Not Found With email Id - ";
	 
	@Override
	public List<User> fetchAllUsers() {
		return repository.findAll();
	}

	@Override
	public User fetchUser(String id) throws UserNotFoundException {
		
		Optional<User> user = repository.findById(id);
		if(user.isEmpty()) {
			throw new UserNotFoundException("User Not Found");
		} else {
			return user.get();
		}
	}

	@Override
	public String addUser(User userInfo) {
		
		Optional<User> u = repository.findByEmail(userInfo.getEmail()); 
		if(u.isPresent()) {
//			throw new UserNotFoundException("User already exists");
			return "User already exists";
		}
		
		User user = new User();
		String id = UUID.randomUUID().toString();
		user.setId(id);
		user.setFirstName(userInfo.getFirstName());
		user.setLastName(userInfo.getLastName());
		user.setUserPassword(passwordEncoder.encode(userInfo.getUserPassword()));
		user.setEmail(userInfo.getEmail());
		user.setPhoneNumber(userInfo.getPhoneNumber());
		user.setUserName(userInfo.getEmail());
		
		user.setAddress(userInfo.getAddress());
		
		user.setRole(userInfo.getRole());
		
		repository.save(user);
		return "User registered successfully";
	}


	@Override
	@Transactional
    public String deleteUserByEmail(String username) {
        User userToDelete = repository.findByEmail(username)
                .orElseThrow(() -> new UserNotFoundException("User not found with username: " + username));

        
        String authenticatedUsername = SecurityContextHolder.getContext().getAuthentication().getName();
        if (userToDelete.getEmail().equals(authenticatedUsername) || SecurityContextHolder.getContext()
                .getAuthentication().getAuthorities().stream()
                .anyMatch(auth -> auth.getAuthority().equals("ROLE_ADMIN"))) {
            repository.delete(userToDelete);
            return "User successfully deleted";
        } else {
            throw new UserNotFoundException("You are not authorized to delete this user");
        }
        
    }
	@Override
	public User login(Login user) throws UserNotFoundException, WrongPasswordException {
	    List<User> list = repository.findAll();

	    for (User c : list) {
	        String userEmail = c.getEmail();
	        if (userEmail != null && userEmail.equals(user.getEmailId())) {
	            BCryptPasswordEncoder passwordEncoder = new BCryptPasswordEncoder();
	            if (passwordEncoder.matches(user.getPassword(), c.getUserPassword())) {
	                return c; 
	            } else {
	                throw new WrongPasswordException("Wrong Password Entered...");
	            }
	        }
	    }

	    throw new UserNotFoundException(userNotFound + user.getEmailId());
	}

	@Override
	public User updateUserByEmail(String username, User user) throws UserNotFoundException {
	    Optional<User> userOptional = repository.findByEmail(username);
	    
	    if (userOptional.isPresent()) {
	        User usr = userOptional.get();
	        usr.setFirstName(user.getFirstName());
	        usr.setLastName(user.getLastName());
	        usr.setPhoneNumber(user.getPhoneNumber());
	        usr.setUserName(user.getUserName());
	        usr.setAddress(user.getAddress());
	        String updatedPassword = passwordEncoder.encode(user.getUserPassword());
	        usr.setUserPassword(updatedPassword);
	        repository.save(usr);
	        return usr;
	    } else {
	        throw new UserNotFoundException("User not found with email: " + user.getEmail());
	    }
	}

	@Override
	public User fetchUserByEmail(String username) throws UserNotFoundException {
		
		Optional<User> user = repository.findByEmail(username);
		if(user.isEmpty()) {
			throw new UserNotFoundException("No such user found");
		}
		
		User u1 = user.get();
		return u1;
	}
	
	@Override
	public User updatePasswordByEmail(String email, String password) {
		Optional<User> user = repository.findByEmail(email);
		if(user.isEmpty()) {
			throw new UserNotFoundException("No such user found with email: " + email);
		}
		user.get().setUserPassword(passwordEncoder.encode(password));
		
		return repository.save(user.get());
	}

}
