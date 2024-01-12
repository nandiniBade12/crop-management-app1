package com.capg.userservice.model;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@NoArgsConstructor
@Data
@AllArgsConstructor
public class Address {
	
	private String buildingNumber;
	private String area;
	private String city;
	private String pincode;
	private String state;

}
