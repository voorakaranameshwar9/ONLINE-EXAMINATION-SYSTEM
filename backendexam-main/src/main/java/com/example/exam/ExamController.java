package com.example.exam;

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
    public Exam createExam(@RequestBody Exam exam) {
        if (exam.getQuestions() != null) {
            for (Question q : exam.getQuestions()) {
                q.setExam(exam);
            }
        }
        return examRepo.save(exam);
    }

    @GetMapping
    public List<Exam> getAllExams() {
        return examRepo.findAll();
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
    public Result submitExam(@PathVariable Long examId, @RequestBody SubmitRequest req) {
        Exam exam = examRepo.findById(examId).orElseThrow();
        Map<Long, String> correct = new HashMap<>();
        for (Question q : exam.getQuestions()) {
            correct.put(q.getId(), q.getCorrectAnswer());
        }

        int score = 0;
        for (AnswerDTO a : req.answers) {
            if (correct.get(a.questionId).equalsIgnoreCase(a.answer)) {
                score++;
            }
        }

        Result r = new Result();
        r.setExamId(examId);
        r.setUsername(req.username);
        r.setScore(score);
        return resultRepo.save(r);
    }

    @GetMapping("/results")
    public List<Result> getResults() {
        return resultRepo.findAll();
    }
}
