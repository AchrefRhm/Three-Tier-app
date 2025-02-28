"use client";
import React, { useEffect, useState } from "react";
import axios from "axios";
import QuestionSection from "@/components/QuestionSection";
import Header from "@/components/Header";
import RecordAnswerSection from "@/components/RecordAnswerSection";
import Link from "next/link";
interface PageProps {
  params: {
    interviewId: string; // Adjust the key based on your actual params structure
  };
}
const StartInterview: React.FC<PageProps> = ({ params }) => {
  const [data, setData] = useState(null);
  const [interviewQuestions, setInterviewQuestions] = useState(null);
  const [activeQuestionIndex, setActiveQuestionIndex] = useState(0);
  const fetchInterview = async () => {
    try {
      const response = await axios.get(
        "http://localhost:5000/api/interview/" + params.interviewId,
      );
      setData(response.data);
      setInterviewQuestions(response.data.questions);
    } catch (error) {
      console.error("Error fetching interview:", error);
    }
  };
  useEffect(() => {
    fetchInterview();
  }, []);
  console.log(data);
  console.log(interviewQuestions);
  return (
    <div className="h-fit min-h-screen pb-6 dark:bg-boxdark">
      <Header />
      <div className="container mx-auto">
        <div className=" mt-12 ">
          <div className="grid grid-cols-1 gap-10 md:grid-cols-2">
            <QuestionSection
              interviewQuestions={interviewQuestions}
              activeQuestionIndex={activeQuestionIndex}
            />
            <RecordAnswerSection
              interviewQuestions={interviewQuestions}
              activeQuestionIndex={activeQuestionIndex}
            />
          </div>
        </div>
        <div className="mt-12 flex justify-end gap-6">
          {activeQuestionIndex > 0 && (
            <button
              className="rounded-md bg-green-500 px-4 py-2 text-white hover:bg-green-600"
              onClick={() => setActiveQuestionIndex(activeQuestionIndex - 1)}
            >
              Previous Question
            </button>
          )}
          {activeQuestionIndex != interviewQuestions?.length - 1 && (
            <button
              className="rounded-md bg-green-500 px-4 py-2 text-white hover:bg-green-600"
              onClick={() => setActiveQuestionIndex(activeQuestionIndex + 1)}
            >
              Next Question
            </button>
          )}

          {activeQuestionIndex == interviewQuestions?.length - 1 && (
            <Link href={`/interview/${params.interviewId}/feedback`}>
              <button className="rounded-md bg-green-500 px-4 py-2 text-white hover:bg-green-600">
                End Question
              </button>
            </Link>
          )}
        </div>
      </div>
    </div>
  );
};

export default StartInterview;
