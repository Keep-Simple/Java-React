package com.threadjava.users;

import com.threadjava.users.dto.UserDetailsDto;
import com.threadjava.users.dto.UserImageUpdateDto;
import com.threadjava.users.dto.UserShortDto;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.UUID;

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

    @PostMapping("/setName")
    public UserShortDto setUserName(@RequestBody UserShortDto user) {
        return userDetailsService.setUserNameById(user.getId(), user.getUsername());
    }

    @PostMapping("/setAvatar")
    public void setUserAvatar(@RequestBody UserImageUpdateDto dto) {
         userDetailsService.setUserAvatar(dto);
    }
}
