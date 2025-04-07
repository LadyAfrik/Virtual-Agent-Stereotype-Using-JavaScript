package com.example.demo;

import org.springframework.web.bind.annotation.GetMapping; // Import for GET HTTP request handling
import org.springframework.web.bind.annotation.RequestMapping; // Import to map request URL to the controller
import org.springframework.web.bind.annotation.RestController; // Import to create a REST controller

@RestController // Marks this class as a RESTful controller to handle HTTP requests and responses
@RequestMapping("/api") // Maps the "/api" path for all methods in this controller
public class HelloController {

    // Handles GET requests for "/api/hello" and returns a simple greeting message
    @GetMapping("/hello") // Maps GET requests for the "/hello" endpoint
    public String sayHello() {
        return "Hello, Spring Boot is working!"; // Returns a greeting message when this endpoint is accessed
    }
}
