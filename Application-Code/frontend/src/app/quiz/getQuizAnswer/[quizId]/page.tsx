"use client";
import axios from "axios";
import React, { useState, useEffect } from "react";

interface QuizQuestion {
  question: string;
  options: string[];
  correctAnswer: string;
}

interface Params {
  quizId: string; // Adjusted to match the actual prop name.
}

const GetQuizAnswer = ({ params }: { params: Params }) => {
  const [quiz, setQuiz] = useState<QuizQuestion[]>([]); // Make sure quiz is always initialized as an array
  const [userAnswers, setUserAnswers] = useState<any[]>([]); // userAnswers will be an array of objects now
  const [score, setScore] = useState<number>(0);

  useEffect(() => {
    const fetchQuizData = async () => {
      try {
        const quizResponse = await axios.get(
          `http://localhost:5000/api/quiz/get-quiz/${params.quizId}`,
        );
        setQuiz(quizResponse.data.questions);

        const userAnswersResponse = await axios.get(
          `http://localhost:5000/api/quiz/get-userQuizAnswer/${params.quizId}`,
        );
        setUserAnswers(userAnswersResponse.data);
      } catch (error) {
        console.error("Error fetching quiz data:", error);
      }
    };

    if (params.quizId) fetchQuizData();
  }, [params.quizId]);

  console.log(userAnswers);
  const currentUserAnswers =
    userAnswers.length > 0 ? userAnswers[0].answers : [];
  return (
    <div className="mx-auto max-w-xl p-4">
      <h2 className="mb-4 text-xl font-bold">Quiz Result</h2>
      <div className="mb-4 flex items-center justify-between rounded-lg bg-blue-500 p-4 text-white shadow-md">
        <span className="text-2xl">Your Score:</span>
        <span className="text-4xl font-bold">
          {userAnswers[0]?.score
            ? (userAnswers[0]?.score * 100) / currentUserAnswers?.length
            : 0}
          %
        </span>
      </div>
      {/* Ensure quiz is an array */}
      {Array.isArray(quiz) && quiz.length > 0 && currentUserAnswers ? (
        <>
          {quiz.map((q, i) => {
            const correctAnswer = q.correctAnswer; // Might be an array or a string
            const userAnswer = currentUserAnswers[i];

            return (
              <div
                key={i}
                className="mb-4 rounded-lg border bg-white p-4 shadow"
              >
                <p className="font-bold">
                  {q.question}
                  {userAnswer?.isCorrect ? (
                    <span className="ml-2">✅</span>
                  ) : (
                    <span className="ml-2">❌</span>
                  )}
                </p>
                <div className="mt-2">
                  {q.options.map((option, j) => {
                    const isMultipleCorrect = Array.isArray(correctAnswer);
                    const isUserAnswerArray = Array.isArray(
                      userAnswer?.selectedOption,
                    );

                    // ✅ Check if the option was selected by the user
                    const isSelected = isUserAnswerArray
                      ? userAnswer.selectedOption.includes(option)
                      : option === userAnswer?.selectedOption;

                    // ✅ Check if the option is correct
                    const isCorrect = isMultipleCorrect
                      ? correctAnswer.includes(option)
                      : option === correctAnswer;

                    return (
                      <p
                        key={j}
                        className={`my-2 rounded p-2 ${
                          isSelected
                            ? isCorrect
                              ? "bg-green-500 text-white" // ✅ Correct & selected
                              : "bg-red-500 text-white" // ❌ Incorrect & selected
                            : isCorrect
                              ? "bg-green-300 text-white" // ✅ Correct but not selected
                              : "" // Default (no styling)
                        }`}
                      >
                        {option}
                      </p>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </>
      ) : (
        <p>Loading results...</p>
      )}
    </div>
  );
};

export default GetQuizAnswer;
