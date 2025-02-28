"use client";
import Image from "next/image";
import React, { useEffect, useState } from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Webcam from "react-webcam";
import useSpeechToText from "react-hook-speech-to-text";
import axios from "axios";
import { useParams } from "next/navigation";

interface Question {
  _id: string;
  question: string;
  answer: string;
}
interface QuestionSectionProps {
  interviewQuestions: Question[];
  activeQuestionIndex: number;
}

const RecordAnswerSection: React.FC<QuestionSectionProps> = ({
  interviewQuestions,
  activeQuestionIndex,
}) => {
  const [userAnswer, setUserAnswer] = useState("");
  const [webCamEnabled, setWebCamEnabled] = useState<boolean>(false);
  const { interviewId } = useParams();
  const [loading, setLoading] = useState(false);
  const {
    error,
    interimResult,
    isRecording,
    results,
    setResults,
    startSpeechToText,
    stopSpeechToText,
  } = useSpeechToText({
    continuous: true,
    useLegacyResults: false,
  });
  useEffect(() => {
    results.map((result) =>
      setUserAnswer((prevAns) => prevAns + result?.transcript),
    );
  }, [results]);
  useEffect(() => {
    // Retrieve the value from localStorage
    const storedValue = localStorage.getItem("webCamEnabled");
    if (storedValue !== null) {
      setWebCamEnabled(JSON.parse(storedValue));
    }
  }, []);

  useEffect(() => {
    if (!isRecording && userAnswer.length > 10) {
      UpdateUserAnswer();
    }
  }, [userAnswer]);

  const StartStopRecording = () => {
    if (isRecording) {
      stopSpeechToText();
    } else {
      startSpeechToText();
    }
  };
  const UpdateUserAnswer = async () => {
    try {
      setLoading(true);
      const response = await axios.post(
        "http://localhost:5000/api/interview/saveFeedback",
        {
          interviewId,
          question: interviewQuestions[activeQuestionIndex]?.question,
          correctAns: interviewQuestions[activeQuestionIndex]?.answer,
          userAns: userAnswer,
          userEmail: "yassineyousef70@gmail.com",
        },
      );
      if (response) {
        toast.success("User Answer recorded successfully", {
          position: "bottom-right",
          className: "text-sm",
        });
        setUserAnswer("");
        setResults([]);
      }
      setResults([]);
      setLoading(false);
      // console.log(response);
    } catch (error: any) {
      console.error("Error saving feedback:", error);
      alert(
        error.response?.data?.message ||
          "An error occurred while saving feedback.",
      );
    }
  };
  return (
    <div className="">
      {webCamEnabled ? (
        <div className=" flex flex-col  items-center justify-center rounded-lg border p-5">
          <Image
            src="/images/webcam.png"
            alt="webcam Image"
            width={200}
            height={200}
            className="absolute"
          />
          <Webcam
            mirrored={true}
            style={{ height: "100%", width: "100%", zIndex: 100 }}
          />
        </div>
      ) : (
        <div className="flex flex-col  items-center justify-center rounded-lg border px-5 py-30">
          <Image
            src="/images/webcam.png"
            alt="webcam Image"
            width={200}
            height={200}
            className=""
          />
        </div>
      )}

      <div className="flex justify-center">
        <button
          disabled={loading}
          className=" mt-5 rounded-md border p-2 font-bold  text-black hover:bg-[#cfd3d8] dark:text-white dark:hover:bg-transparent"
          onClick={StartStopRecording}
        >
          {isRecording ? (
            <h2 className="flex gap-2 text-red-600">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 640 512"
                className="h-[25px] w-[25px] fill-red-600"
              >
                <path d="M38.8 5.1C28.4-3.1 13.3-1.2 5.1 9.2S-1.2 34.7 9.2 42.9l592 464c10.4 8.2 25.5 6.3 33.7-4.1s6.3-25.5-4.1-33.7L472.1 344.7c15.2-26 23.9-56.3 23.9-88.7l0-40c0-13.3-10.7-24-24-24s-24 10.7-24 24l0 40c0 21.2-5.1 41.1-14.2 58.7L416 300.8 416 96c0-53-43-96-96-96s-96 43-96 96l0 54.3L38.8 5.1zM344 430.4c20.4-2.8 39.7-9.1 57.3-18.2l-43.1-33.9C346.1 382 333.3 384 320 384c-70.7 0-128-57.3-128-128l0-8.7L144.7 210c-.5 1.9-.7 3.9-.7 6l0 40c0 89.1 66.2 162.7 152 174.4l0 33.6-48 0c-13.3 0-24 10.7-24 24s10.7 24 24 24l72 0 72 0c13.3 0 24-10.7 24-24s-10.7-24-24-24l-48 0 0-33.6z" />
              </svg>
              Stop Recording
            </h2>
          ) : (
            <p className="flex gap-2">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 384 512"
                className="h-[25px] w-[25px] dark:fill-white"
              >
                <path d="M192 0C139 0 96 43 96 96l0 160c0 53 43 96 96 96s96-43 96-96l0-160c0-53-43-96-96-96zM64 216c0-13.3-10.7-24-24-24s-24 10.7-24 24l0 40c0 89.1 66.2 162.7 152 174.4l0 33.6-48 0c-13.3 0-24 10.7-24 24s10.7 24 24 24l72 0 72 0c13.3 0 24-10.7 24-24s-10.7-24-24-24l-48 0 0-33.6c85.8-11.7 152-85.3 152-174.4l0-40c0-13.3-10.7-24-24-24s-24 10.7-24 24l0 40c0 70.7-57.3 128-128 128s-128-57.3-128-128l0-40z" />
              </svg>{" "}
              Record Answer
            </p>
          )}
        </button>
      </div>

      <ToastContainer />
    </div>
  );
};

export default RecordAnswerSection;
