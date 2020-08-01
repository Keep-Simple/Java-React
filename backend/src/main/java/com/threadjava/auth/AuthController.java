package com.threadjava.auth;

import com.threadjava.auth.dto.*;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
public class AuthController {
    private final AuthService authService;

    public AuthController(AuthService authService) {
        this.authService = authService;
    }

    @PostMapping("/register")
    public AuthUserDTO signUp(@RequestBody UserRegisterDto user) throws Exception {
        return authService.register(user);
    }

    @PostMapping("/login")
    public AuthUserDTO login(@RequestBody UserLoginDTO user) throws Exception {
        return authService.login(user);
    }
}
