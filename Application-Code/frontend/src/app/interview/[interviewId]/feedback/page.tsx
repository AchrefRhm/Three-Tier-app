"use client";
import Header from "@/components/Header";
import axios from "axios";
import { useParams } from "next/navigation";
import React, { useEffect, useState } from "react";
import {
  Collapse,
  Button,
  Card,
  Typography,
  CardBody,
} from "@material-tailwind/react";
import { useRouter } from "next/navigation";
const Feedback = () => {
  const router = useRouter();
  const [answers, setAnswers] = useState([]);
  const { interviewId } = useParams();
  const [openIndexes, setOpenIndexes] = useState<Record<number, boolean>>({});

  const toggleOpen = (index: number) => {
    setOpenIndexes((prev) => ({
      ...prev,
      [index]: !prev[index],
    }));
  };
  const fetchUserAnswers = async () => {
    try {
      const response = await axios.get(
        `http://localhost:5000/api/interview/userAnswer/${interviewId}`,
      );
      // Assumes your response contains a property "userAnswers"
      setAnswers(response.data.userAnswers);
    } catch (err) {
      console.error("Error fetching user answers:", err);
    }
  };
  useEffect(() => {
    fetchUserAnswers();
  }, []);

  const totalRating = answers.reduce(
    (sum, answer) => sum + Number(answer.rating),
    0,
  );
  // Calculate average and format it with two decimals
  const averageRating =
    answers.length > 0 ? (totalRating / answers.length).toFixed(2) : "0.00";

  return (
    <div className="h-fit min-h-screen  pb-6 dark:bg-boxdark">
      <Header />
      <div className="container mx-auto mt-10">
        {answers?.length == 0 ? (
          <h2 className="text-xl font-bold text-gray-500">
            No Interview Feedback Record Found
          </h2>
        ) : (
          <>
            <h2 className="text-3xl font-bold text-green-500">
              Congratulation!
            </h2>
            <h2 className="text-2xl font-bold text-black dark:text-white">
              Here is your interview feedback
            </h2>
            <h2 className="my-3 text-lg text-primary dark:text-white">
              Your overall interview rating:{" "}
              <strong>{averageRating}/10</strong>{" "}
            </h2>
            <h2 className="text-sm text-gray-500 dark:text-white">
              Find below interview question with correct answer, Your answer and
              feedback for imporvement
            </h2>
            {answers.map((item, index) => (
              <div key={index} className="mb-4">
                <div
                  className="my-2 flex w-full cursor-pointer items-center justify-between gap-7 rounded-lg border p-2 text-left dark:text-white"
                  onClick={() => toggleOpen(index)}
                >
                  Question N°{index + 1}:{" " + item.question}
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    stroke-width="2"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    className="lucide lucide-chevrons-up-down "
                  >
                    <path d="m7 15 5 5 5-5" />
                    <path d="m7 9 5-5 5 5" />
                  </svg>
                </div>
                <Collapse open={!!openIndexes[index]}>
                  <Card className="my-1  bg-inherit shadow-none">
                    <CardBody className="p-0">
                      <Typography
                        variant="h2"
                        className="mb-2 rounded-lg border p-2 text-lg font-bold text-red"
                      >
                        Rating: {item.rating}
                      </Typography>
                      <Typography
                        variant="h2"
                        className="mb-2 rounded-lg border bg-red-50 p-2 text-sm text-red-900"
                      >
                        <strong>Your Answer:</strong> {item.userAns}
                      </Typography>
                      <Typography
                        variant="h2"
                        className="mb-2  rounded-lg border bg-green-50 p-2 text-sm text-green-900"
                      >
                        <strong>Correct Answer:</strong> {item.correctAns}
                      </Typography>
                      <Typography
                        variant="h2"
                        className="mb-2 rounded-lg border bg-blue-50 p-2 text-sm text-blue-900"
                      >
                        <strong>Feedback:</strong> {item.feedback}
                      </Typography>
                    </CardBody>
                  </Card>
                </Collapse>
              </div>
            ))}
          </>
        )}
        <button
          className="rounded-full border border-black px-4 py-2 text-black dark:border-white dark:text-white"
          onClick={() => router.replace("/")}
        >
          ← Back Home
        </button>
      </div>
    </div>
  );
};

export default Feedback;
