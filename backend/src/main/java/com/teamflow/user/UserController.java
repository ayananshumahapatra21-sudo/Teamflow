package com.teamflow.user;

import com.teamflow.common.ApiResponse;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/users")
@Tag(name = "Users", description = "User profile and lookup operations")
public class UserController {

    private final UserService userService;

    public UserController(UserService userService) {
        this.userService = userService;
    }

    @GetMapping("/me")
    @Operation(summary = "Get current authenticated user's profile")
    public ResponseEntity<ApiResponse<UserDto>> getCurrentUser() {
        UserDto userDto = userService.getCurrentUser();
        return ResponseEntity.ok(ApiResponse.success(userDto));
    }

    @GetMapping("/search")
    @Operation(summary = "Search users by name or email")
    public ResponseEntity<ApiResponse<List<UserDto>>> searchUsers(@RequestParam(required = false, defaultValue = "") String query) {
        List<UserDto> users = userService.searchUsers(query);
        return ResponseEntity.ok(ApiResponse.success(users));
    }
}
