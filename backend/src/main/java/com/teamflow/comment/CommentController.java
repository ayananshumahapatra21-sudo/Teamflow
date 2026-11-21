package com.teamflow.comment;

import com.teamflow.comment.dto.CommentDto;
import com.teamflow.comment.dto.CreateCommentRequest;
import com.teamflow.common.ApiResponse;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/v1/tasks/{taskId}/comments")
@Tag(name = "Comments", description = "Task discussion threads and comments")
public class CommentController {

    private final CommentService commentService;

    public CommentController(CommentService commentService) {
        this.commentService = commentService;
    }

    @PostMapping
    @Operation(summary = "Post a comment on a task")
    public ResponseEntity<ApiResponse<CommentDto>> addComment(@PathVariable UUID taskId,
                                                              @Valid @RequestBody CreateCommentRequest request) {
        CommentDto comment = commentService.addComment(taskId, request);
        return new ResponseEntity<>(ApiResponse.success("Comment added successfully", comment), HttpStatus.CREATED);
    }

    @GetMapping
    @Operation(summary = "Get all comments for a task")
    public ResponseEntity<ApiResponse<List<CommentDto>>> getComments(@PathVariable UUID taskId) {
        List<CommentDto> comments = commentService.getCommentsByTaskId(taskId);
        return ResponseEntity.ok(ApiResponse.success(comments));
    }
}
