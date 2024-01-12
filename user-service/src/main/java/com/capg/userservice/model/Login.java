package com.capg.userservice.model;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@AllArgsConstructor
@NoArgsConstructor
@Data
public class Login{
   
    @Email(message = "Enter Correct Email Address...")
    private String emailId;
    @Size(min=6,max=10,message="Enter Correct password")
    private String password;


   public Login (Login userLogin) {
    this.emailId=userLogin.getEmailId();
    this.password=userLogin.getPassword();
}
}
