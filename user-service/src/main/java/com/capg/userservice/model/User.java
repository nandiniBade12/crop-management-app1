package com.capg.userservice.model;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Document(collection="users")
public class User {

	@Id
	private String id;
	private String firstName;
	private String lastName;
	private String userName;
	private String userPassword;
	private String email;
	private String phoneNumber;
	private Address address;
	
	private String role;

}


