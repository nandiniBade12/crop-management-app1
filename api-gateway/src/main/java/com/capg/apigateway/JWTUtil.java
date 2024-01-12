package com.capg.apigateway;

import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import io.jsonwebtoken.io.Decoders;
import io.jsonwebtoken.security.Keys;
import org.springframework.stereotype.Component;
 
import java.security.Key;
import java.util.Date;
import java.util.HashMap;
import java.util.Map;
 
import java.util.function.Function;
 
import io.jsonwebtoken.Claims;
 
@Component
public class JWTUtil {
 
	public String generateToken(String username) {
		Map<String, Object> claims = new HashMap<>();
		return createToken(claims, username);
	}
 
	public void validateToken(final String token) {
		Jwts.parserBuilder().setSigningKey(getSecKey()).build().parseClaimsJws(token);
	}
 
	private String createToken(Map<String, Object> claims, String username) {
		return Jwts.builder().setClaims(claims).setSubject(username).setIssuedAt(new Date(System.currentTimeMillis()))
				.setExpiration(new Date(System.currentTimeMillis() + 1000 * 60 * 60))
				.signWith(getSecKey(), SignatureAlgorithm.HS256).compact();
 
	}
 
	private Key getSecKey() {
		byte[] keybytes = Decoders.BASE64.decode("3273357638792F423F4528482B4D6251655368566D597133743677397A244326");
		return Keys.hmacShaKeyFor(keybytes);
	}
 
	public String extractUsername(String token) {
		return extractClaim(token, Claims::getSubject);
	}
 
	public <T> T extractClaim(String token, Function<Claims, T> claimsResolver) {
		final Claims claims = extractAllClaims(token);
		return claimsResolver.apply(claims);
	}
 
	private Claims extractAllClaims(String token) {
		return Jwts.parserBuilder().setSigningKey(getSecKey()).build().parseClaimsJws(token).getBody();
	}
 
}
