package com.threadjava.users;

import com.threadjava.users.dto.UserDetailsDto;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import static com.threadjava.auth.TokenService.getUserId;

@RestController
@RequestMapping("/api/user")
public class UserController {
    private final UsersService userDetailsService;

    public UserController(UsersService userDetailsService) {
        this.userDetailsService = userDetailsService;
    }

    @GetMapping
    public UserDetailsDto getUser() {
        return userDetailsService.getUserById(getUserId());
    }
}
