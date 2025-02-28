"use client";

import axios from "axios";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";

interface QuizQuestion {
  question: string;
  options: string[];
  correctAnswer: string;
  questionType: "one correct" | "multiple correct";
}

interface Params {
  quizId: string;
}

const QuizPage = ({ params }: { params: Params }) => {
  const router = useRouter();
  const [quiz, setQuiz] = useState<QuizQuestion[]>([]);
  const [quizInfo, setQuizInfo] = useState();
  const [answers, setAnswers] = useState<{ [key: number]: string | string[] }>(
    {},
  );

  useEffect(() => {
    const fetchQuizData = async () => {
      try {
        const quizResponse = await axios.get(
          `http://localhost:5000/api/quiz/get-quiz/${params.quizId}`,
        );
        setQuiz(quizResponse.data.questions);
        setQuizInfo(quizResponse.data);
      } catch (error) {
        console.error("Error fetching quiz data:", error);
      }
    };

    if (params.quizId) fetchQuizData();
  }, [params.quizId]);

  const handleOptionChange = (questionIndex: number, option: string) => {
    setAnswers((prev) => ({
      ...prev,
      [questionIndex]:
        quizInfo?.questionType === "one correct"
          ? option // For single answer, just store the selected option
          : prev[questionIndex]?.includes(option)
            ? (prev[questionIndex] as string[]).filter(
                (item) => item !== option,
              ) // For multiple answers, toggle off
            : [...(prev[questionIndex] || []), option], // Add new option if it's not already selected
    }));
  };

  const handleSubmit = async () => {
    const formattedAnswers = Object.values(answers).map((answer) => ({
      selectedOption: Array.isArray(answer) ? answer : [answer], // Ensure it's always an array
    }));

    const payload = {
      user: "67a9ca365e04634d04aea7aa", // Replace with actual user ID
      quizId: params.quizId,
      answers: formattedAnswers,
    };

    try {
      const response = await axios.post(
        "http://localhost:5000/api/quiz/submit",
        payload,
      );
      console.log("Quiz submitted successfully:", response.data);
      router.push(`/quiz/getQuizAnswer/${params.quizId}`);
    } catch (error) {
      console.error("Error submitting quiz:", error);
    }
  };

  return (
    <div className="mx-auto max-w-2xl space-y-6 p-6">
      <h1 className="text-center text-2xl font-bold">Quiz</h1>
      {quiz.map((question, index) => (
        <div
          key={index}
          className="rounded-lg border border-gray-300 p-4 shadow-md"
        >
          <h2 className="mb-2 text-lg font-semibold">{question.question}</h2>
          <div className="space-y-2">
            {question.options.map((option, optionIndex) => (
              <label
                key={optionIndex}
                className="flex cursor-pointer items-center space-x-2"
              >
                <input
                  type={
                    quizInfo?.questionType === "one correct"
                      ? "radio"
                      : "checkbox"
                  } // ✅ Use quizInfo.questionType
                  name={`question-${index}`}
                  checked={
                    quizInfo?.questionType === "one correct"
                      ? answers[index] === option // ✅ Ensure selected radio is checked
                      : answers[index]?.includes(option) // ✅ Ensure selected checkboxes are checked
                  }
                  onChange={() => handleOptionChange(index, option)}
                  className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                />

                <span>{option}</span>
              </label>
            ))}
          </div>
        </div>
      ))}
      <button
        onClick={handleSubmit}
        className="w-full rounded-lg bg-blue-500 px-4 py-2 font-bold text-white transition duration-200 hover:bg-blue-700"
      >
        Submit Quiz
      </button>
    </div>
  );
};

export default QuizPage;
