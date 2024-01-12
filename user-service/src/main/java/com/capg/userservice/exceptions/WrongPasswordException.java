package com.capg.userservice.exceptions;

public class WrongPasswordException extends RuntimeException {

	private static final long serialVersionUID = 1L;

	public WrongPasswordException(String msg) {
		super(msg);
	}
}
