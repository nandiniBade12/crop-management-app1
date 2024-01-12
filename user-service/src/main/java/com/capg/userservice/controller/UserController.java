package com.capg.userservice.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;

import org.springframework.security.core.Authentication;

import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.capg.userservice.exceptions.UserNotFoundException;
import com.capg.userservice.exceptions.WrongPasswordException;
import com.capg.userservice.model.AuthRequest;
import com.capg.userservice.model.Login;
import com.capg.userservice.model.User;
import com.capg.userservice.service.JwtService;
import com.capg.userservice.service.UserServiceImpl;

import jakarta.validation.Valid;

@RestController
@RequestMapping("/users")
@CrossOrigin(origins = "http://localhost:3000")
public class UserController {

	@Autowired
	private UserServiceImpl service;

	@Autowired
	private JwtService jwtService;
	@Autowired
	AuthenticationManager authenticationManager;

	@PostMapping("/signUp")
	public ResponseEntity<String> addNewUser(@RequestBody User userInfo) {
		
		return new ResponseEntity<String>(service.addUser(userInfo), HttpStatus.CREATED);
	}

	@PostMapping("/signIn")
	public ResponseEntity<User> userLogin(@Valid @RequestBody Login user) {
		
	    User usr = service.login(user);
	    return new ResponseEntity<>(usr, HttpStatus.OK);
	}
	
	@GetMapping("/fetchAll")
//	@PreAuthorize("hasRole('ROLE_ADMIN')")
	public ResponseEntity<List<User>> getAllUsers() {
		
		return new ResponseEntity<List<User>>(service.fetchAllUsers(), HttpStatus.OK);
	}

	@GetMapping("/fetch/{id}")
	@PreAuthorize("hasRole('ROLE_ADMIN')")
	public ResponseEntity<User> getUser(@PathVariable String id) {
		
		return new ResponseEntity<User>(service.fetchUser(id), HttpStatus.OK);
	}

	@DeleteMapping("/delete/email/{username}")
	@PreAuthorize("hasAnyRole('ROLE_ADMIN', 'ROLE_FARMER','ROLE_DEALER') or (#username == authentication.name)")
	public ResponseEntity<?> deleteUserByEmail(@PathVariable String username) {
		service.deleteUserByEmail(username);
		return new ResponseEntity<>("User deleted successfully", HttpStatus.OK);
	}
	
	@PutMapping("/update/email/{userEmail}")
//	@PreAuthorize("hasRole('ROLE_DEALER')")
    public ResponseEntity<User> updateUserByEmail(@PathVariable String userEmail, @RequestBody User user) {
        User usr = service.updateUserByEmail(userEmail, user);
        return new ResponseEntity<User>(usr,HttpStatus.OK);
    }
	
	@GetMapping("/fetch/email/{email}")
//	@PreAuthorize("hasRole('ROLE_DEALER')")
	public ResponseEntity<User> viewUser(@PathVariable String email) {
		
		return new ResponseEntity<User>(service.fetchUserByEmail(email),HttpStatus.OK);
		
	}
	
	@PutMapping("/updatePassword/{email}")
	public ResponseEntity<User> updatePassword(@PathVariable("email")String email,@RequestParam("password")String password){
		User p1 = service.updatePasswordByEmail(email,password);
		return new ResponseEntity<>(p1,HttpStatus.OK);
	}
	
	@PostMapping("/authenticate")
	public String generateToken(@RequestBody AuthRequest authRequest) {
		Authentication authentication = authenticationManager.authenticate(
				new UsernamePasswordAuthenticationToken(authRequest.getUsername(), authRequest.getPassword()));
		if (authentication.isAuthenticated()) {
			return jwtService.generateToken(authRequest.getUsername());
		} else {
			throw new UsernameNotFoundException("Invalid User");
		}
	}
	@GetMapping("/validate")
    public String validateToken(@RequestParam("token") String token) {
	 jwtService.validateToken(token);
        return "Token is valid";
    }
}
