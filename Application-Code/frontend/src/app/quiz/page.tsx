"use client";
import { useEffect, useState } from "react";
import axios from "axios";
import DefaultLayout from "@/components/Layouts/DefaultLayout";
import TableComponent from "@/components/TableComponent";
import GenerateQuiz from "@/components/GenerateQuiz";

interface QuizQuestion {
  question: string;
  options: string[];
  correctAnswer: string;
  questionType: string;
  difficulty: "easy" | "medium" | "difficult";
}

interface UserQuiz {
  id: string;
  topic: string;
  difficulty: string;
  questionCount: number;
  questionType: string;
}

export default function Home() {
  const [quiz, setQuiz] = useState<QuizQuestion[]>([]);
  const [previousQuizzes, setPreviousQuizzes] = useState<UserQuiz[]>([]);
  const [selectedQuiz, setSelectedQuiz] = useState<UserQuiz | null>(null);

  const fetchPreviousQuizzes = async () => {
    try {
      const response = await axios.post<UserQuiz[]>(
        "http://localhost:5000/api/quiz/get-quizez",
        { user: "67a9ca365e04634d04aea7aa" },
      );
      setPreviousQuizzes(response.data.quizzes);
    } catch (error) {
      console.error("Error fetching previous quizzes:", error);
    }
  };

  useEffect(() => {
    fetchPreviousQuizzes();
  }, [quiz]);

  console.log(previousQuizzes);
  return (
    <DefaultLayout>
      <div className="flex min-h-screen flex-col  bg-gray-100 p-6 dark:bg-boxdark">
        <h1 className="mb-4 text-3xl font-bold">AI Quiz Generator</h1>

        <GenerateQuiz />
        {previousQuizzes.length > 0 && (
          <div className="mb-6 rounded-lg bg-white p-6 shadow-lg dark:bg-boxdark">
            <h2 className="mb-4 text-xl font-bold">Previous Quizzes</h2>
            <TableComponent
              data={previousQuizzes}
              onRowClick={setSelectedQuiz}
            />
          </div>
        )}
      </div>
    </DefaultLayout>
  );
}
