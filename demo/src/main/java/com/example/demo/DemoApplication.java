package com.example.demo;

import org.springframework.boot.SpringApplication; // Import to run the Spring Boot application
import org.springframework.boot.autoconfigure.SpringBootApplication; // Import to mark the class as the main entry point for Spring Boot

@SpringBootApplication // Marks this class as a Spring Boot application that will enable auto-configuration and component scanning
public class DemoApplication {

	public static void main(String[] args) {
		SpringApplication.run(DemoApplication.class, args); // Launches the Spring Boot application
	}
}
