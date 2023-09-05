package com.myskyline.backend;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.web.servlet.config.annotation.EnableWebMvc;

@SpringBootApplication
@EnableWebMvc
public class MySkyLineApplication {

	public static void main(String[] args) {
		SpringApplication.run(MySkyLineApplication.class, args);
	}

}
