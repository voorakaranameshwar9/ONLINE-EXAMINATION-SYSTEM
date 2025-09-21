// Simple in-memory mock API for exams and attempts
const exams = [
  {
    id: 'exam-1',
    title: 'JavaScript Basics',
    durationMinutes: 10,
    questions: [
      { id: 'q1', text: 'Which is NOT a JS data type?', options: ['String', 'Number', 'Character', 'Boolean'], answerIndex: 2 },
      { id: 'q2', text: 'Which keyword declares a constant?', options: ['var', 'let', 'const', 'static'], answerIndex: 2 },
      { id: 'q3', text: 'Array.prototype.map returns?', options: ['Number', 'Array', 'Boolean', 'Object'], answerIndex: 1 },
    ],
  },
  {
    id: 'exam-2',
    title: 'React Fundamentals',
    durationMinutes: 12,
    questions: [
      { id: 'q1', text: 'React is a ...', options: ['Library', 'Framework', 'Language', 'Runtime'], answerIndex: 0 },
      { id: 'q2', text: 'useState returns ...', options: ['value only', 'setter only', 'value and setter', 'array'], answerIndex: 2 },
      { id: 'q3', text: 'Keys help with ...', options: ['Styling', 'Performance', 'Data fetching', 'State'], answerIndex: 1 },
    ],
  },
  {
    id: 'exam-3',
    title: 'OOPS  Fundamentals',
    durationMinutes: 12,
    questions: [
      { id: 'q1', text: 'Which of the following is not OOPS concept in Java?', options: [' Inheritance', ' Encapsulation', ' Polymorphism', 'Compilation'], answerIndex: 3 },
      { id: 'q2', text: 'Which concept of Java is achieved by combining methods and attribute into a class?', options: ['Encapsulation', ' Inheritance', 'Polymorphism', 'Abstraction'], answerIndex: 0 },
      { id: 'q3', text: 'When does method overloading is determined?', options: ['At run time', 'At compile time', ' At coding time', ' At execution time'], answerIndex: 1 },
    ],
  },
  {
    id: 'exam-4',
    title: 'Basics of DBMS',
    durationMinutes: 12,
    questions: [
      { id: 'q1', text: 'What is "M" stands for in DBMS ', options: ['Memory', 'Management', 'Mail', 'Main'], answerIndex: 1 },
      { id: 'q2', text: 'Which of the following is a key that uniquely identifies each row in a table?', options: [' Foreign Key', ' Candidate Key', 'Primary Key', ' Super Key'], answerIndex: 2 },
      { id: 'q3', text: ' The language used to define the structure of a database is called:', options: ['DDL (Data Definition Language)', 'DML (Data Manipulation Language)', 'TCL (Transaction Control Language)', 'DCL (Data Control Language)'], answerIndex: 0 },
    ],
  },
  {
    id: 'exam-5',
    title: 'Bacics of Pyhton',
    durationMinutes: 12,
    questions: [
      { id: 'q1', text: 'In Which year python was Introduced ? ', options: ['1991', '1992', '1993', '1994'], answerIndex: 0 },
      { id: 'q2', text: '  Which of the following is the correct file extension for a Python file?', options: ['.pyt', '.pth ', '.py', '.pyn '], answerIndex: 2 },
      { id: 'q3', text: ' The language used to define the structure of a database is called:', options: ['DDL (Data Definition Language)', 'DML (Data Manipulation Language)', 'TCL (Transaction Control Language)', 'DCL (Data Control Language)'], answerIndex: 0 },
    ],
  },
]

   

let attempts = []

export const api = {
  listExams: async () => {
    await delay(150)
    return exams.map(({ id, title, durationMinutes }) => ({ id, title, durationMinutes }))
  },
  getExam: async (examId) => {
    await delay(150)
    return exams.find((e) => e.id === examId)
  },
  submitAttempt: async ({ examId, userId, answers }) => {
    await delay(200)
    const exam = exams.find((e) => e.id === examId)
    const score = exam.questions.reduce((sum, q, idx) => sum + (q.answerIndex === (answers[idx] ?? -1) ? 1 : 0), 0)
    const percentage = Math.round((score / exam.questions.length) * 100)
    const attempt = { id: `att-${Date.now()}`, examId, userId, score, total: exam.questions.length, percentage, date: new Date().toISOString() }
    attempts.push(attempt)
    return attempt
  },
  listAttempts: async (userId) => {
    await delay(120)
    return attempts.filter((a) => a.userId === userId)
  },
}

function delay(ms) {
  return new Promise((res) => setTimeout(res, ms))
}

// api.js

const API_BASE_URL = "http://localhost:5000/api"; // Replace with your backend URL

// Function to fetch all available exams from the backend
export const getAvailableExams = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}/exams`);
    if (!response.ok) {
      throw new Error("Failed to fetch exams");
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error fetching exams:", error);
    return []; // Return an empty array on error
  }
};

// You can add more functions here for other API calls,
// like submitting results or getting a single exam's questions.
export const submitExamResults = async (resultsData) => {
  // Add the logic to POST data to your backend's /api/results endpoint
};
