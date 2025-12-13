package com.pingr.controller;

import com.pingr.dto.UserAccountDTO;
import com.pingr.service.UserAccountService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.net.URI;

@RestController
@RequestMapping("/api") // Pas besoin du dernier slash
@RequiredArgsConstructor
public class UserAccountController {
}
