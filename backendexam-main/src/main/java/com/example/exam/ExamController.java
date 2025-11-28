package com.example.exam;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.*;

@RestController
@RequestMapping("/exams")
public class ExamController {

    private final ExamRepository examRepo;
    private final ResultRepository resultRepo;

    public ExamController(ExamRepository examRepo, ResultRepository resultRepo) {
        this.examRepo = examRepo;
        this.resultRepo = resultRepo;
    }

    @PostMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Exam> createExam(@RequestBody Exam exam) {
        if (exam == null) return ResponseEntity.badRequest().build();
        if (exam.getQuestions() != null) {
            for (Question q : exam.getQuestions()) {
                q.setExam(exam);
            }
        }
        Exam saved = examRepo.save(exam);
        return ResponseEntity.status(HttpStatus.CREATED).body(saved);
    }

    @GetMapping
    @PreAuthorize("hasAnyRole('ADMIN','USER')")
    public List<Exam> getAllExams() {
        return examRepo.findAll();
    }

    @GetMapping("/{id}")
    public ResponseEntity<Exam> getExamById(@PathVariable Long id) {
        return examRepo.findById(id)
                .map(ResponseEntity::ok)
                .orElseGet(() -> ResponseEntity.notFound().build());
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Exam> updateExam(@PathVariable Long id, @RequestBody Exam exam) {
        return examRepo.findById(id).map(existing -> {
            existing.setTitle(exam.getTitle());
            // replace questions: ensure relationship is set
            existing.getQuestions().clear();
            if (exam.getQuestions() != null) {
                for (Question q : exam.getQuestions()) {
                    q.setExam(existing);
                    existing.getQuestions().add(q);
                }
            }
            Exam saved = examRepo.save(existing);
            return ResponseEntity.ok(saved);
        }).orElseGet(() -> ResponseEntity.notFound().build());
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Void> deleteExam(@PathVariable Long id) {
        if (!examRepo.existsById(id)) return ResponseEntity.notFound().build();
        examRepo.deleteById(id);
        return ResponseEntity.noContent().build();
    }

    // DTOs
    public static class AnswerDTO {
        public Long questionId;
        public String answer;
    }

    public static class SubmitRequest {
        public String username;
        public List<AnswerDTO> answers;
    }

    @PostMapping("/{examId}/submit")
    public ResponseEntity<Result> submitExam(@PathVariable Long examId, @RequestBody SubmitRequest req) {
        if (req == null || req.username == null || req.answers == null) {
            return ResponseEntity.badRequest().build();
        }

        Optional<Exam> maybeExam = examRepo.findById(examId);
        if (maybeExam.isEmpty()) return ResponseEntity.notFound().build();
        Exam exam = maybeExam.get();

        Map<Long, String> correct = new HashMap<>();
        if (exam.getQuestions() != null) {
            for (Question q : exam.getQuestions()) {
                if (q != null && q.getId() != null) {
                    correct.put(q.getId(), q.getCorrectAnswer());
                }
            }
        }

        int score = 0;
        for (AnswerDTO a : req.answers) {
            if (a == null || a.questionId == null) continue;
            String expected = correct.get(a.questionId);
            String given = a.answer;
            if (expected != null && given != null && expected.equalsIgnoreCase(given.trim())) {
                score++;
            }
        }

        Result r = new Result();
        r.setExamId(examId);
        r.setUsername(req.username);
        r.setScore(score);
        Result saved = resultRepo.save(r);
        return ResponseEntity.status(HttpStatus.CREATED).body(saved);
    }

    @GetMapping("/results")
    public List<Result> getResults() {
        return resultRepo.findAll();
    }
}
