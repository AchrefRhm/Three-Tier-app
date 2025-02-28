"use client";
import Header from "@/components/Header";
import { Button } from "@material-tailwind/react";
import axios from "axios";
import Image from "next/image";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import Webcam from "react-webcam";

interface PageProps {
  params: {
    interviewId: string; // Adjust the key based on your actual params structure
  };
}
const page: React.FC<PageProps> = ({ params }) => {
  const [data, setData] = useState(null);
  const [webCamEnabled, setWebCamEnabled] = useState(false);
  const fetchInterview = async () => {
    try {
      const response = await axios.get(
        "http://localhost:5000/api/interview/" + params.interviewId,
      );
      setData(response.data);
    } catch (error) {
      console.error("Error fetching interview:", error);
    }
  };
  useEffect(() => {
    fetchInterview();
  }, []);

  const handleStartInterview = () => {
    window.localStorage.setItem("webCamEnabled", JSON.stringify(webCamEnabled));
  };
  console.log(data);
  return (
    <div className="h-fit min-h-screen p-3 dark:bg-boxdark">
      <Header />
      <div className="container mx-auto my-10  pb-4">
        <h2 className=" text-2xl font-bold text-black dark:text-white">
          Let's Get Started
        </h2>
        <div className="grid grid-cols-1 gap-10 md:grid-cols-2">
          <div className=" my-5 flex flex-col gap-5 ">
            <div className="flex flex-col gap-5 rounded-lg border p-5">
              <h2 className="text-lg text-black dark:text-white">
                <strong>Job Role/Job Position: </strong>
                {data?.job}
              </h2>
              <h2 className="text-lg text-black dark:text-white">
                <strong>Job Description/Tech Stack: </strong>
                {data?.description}
              </h2>
              <h2 className="text-lg text-black dark:text-white">
                <strong>Years Of Experience: </strong>
                {data?.yearsOfExperience}
              </h2>
            </div>
            <div className="rounded-lg border border-yellow-300 bg-yellow-100 p-5">
              <h2 className="flex items-center gap-1 ">
                {" "}
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 384 512"
                  className="h-6 w-6  fill-yellow-500"
                >
                  <path d="M297.2 248.9C311.6 228.3 320 203.2 320 176c0-70.7-57.3-128-128-128S64 105.3 64 176c0 27.2 8.4 52.3 22.8 72.9c3.7 5.3 8.1 11.3 12.8 17.7c0 0 0 0 0 0c12.9 17.7 28.3 38.9 39.8 59.8c10.4 19 15.7 38.8 18.3 57.5L109 384c-2.2-12-5.9-23.7-11.8-34.5c-9.9-18-22.2-34.9-34.5-51.8c0 0 0 0 0 0s0 0 0 0c-5.2-7.1-10.4-14.2-15.4-21.4C27.6 247.9 16 213.3 16 176C16 78.8 94.8 0 192 0s176 78.8 176 176c0 37.3-11.6 71.9-31.4 100.3c-5 7.2-10.2 14.3-15.4 21.4c0 0 0 0 0 0s0 0 0 0c-12.3 16.8-24.6 33.7-34.5 51.8c-5.9 10.8-9.6 22.5-11.8 34.5l-48.6 0c2.6-18.7 7.9-38.6 18.3-57.5c11.5-20.9 26.9-42.1 39.8-59.8c0 0 0 0 0 0s0 0 0 0s0 0 0 0c4.7-6.4 9-12.4 12.7-17.7zM192 128c-26.5 0-48 21.5-48 48c0 8.8-7.2 16-16 16s-16-7.2-16-16c0-44.2 35.8-80 80-80c8.8 0 16 7.2 16 16s-7.2 16-16 16zm0 384c-44.2 0-80-35.8-80-80l0-16 160 0 0 16c0 44.2-35.8 80-80 80z" />
                </svg>
                <strong className=" text-yellow-500">Information</strong>
              </h2>
              <h2 className=" mt-3 text-yellow-500 ">
                {process.env.NEXT_PUBLIC_INFORMATION}
              </h2>
            </div>
          </div>
          <div className="border p-5">
            {webCamEnabled ? (
              <Webcam
                onUserMedia={() => setWebCamEnabled(true)}
                onUserMediaError={() => setWebCamEnabled(false)}
                mirrored={true}
                className="w-[100%] w-[100%]"
              />
            ) : (
              <div className="flex flex-col items-center ">
                <Image
                  src="/images/webcam.png"
                  alt="webcam Image"
                  width={120}
                  height={120}
                  className="my-7"
                />
                <button
                  onClick={() => setWebCamEnabled(true)}
                  className="  rounded-md border border-transparent px-4 py-2 font-bold text-black hover:bg-[#d8d6d6] dark:text-white dark:hover:bg-transparent"
                >
                  Enable Web Cam and Microphone
                </button>
              </div>
            )}
          </div>
        </div>
        <div className="flex items-end justify-end">
          <Link href={`/interview/${params.interviewId}/start`}>
            <button
              className="mt-4 rounded-md bg-green-500 px-4 py-2 text-white hover:bg-green-600"
              onClick={handleStartInterview}
            >
              Start Interview
            </button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default page;
