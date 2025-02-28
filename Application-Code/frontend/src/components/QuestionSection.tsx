import React from "react";

interface Question {
  _id: string;
  question: string;
  answer: string;
}

interface QuestionSectionProps {
  interviewQuestions: Question[];
  activeQuestionIndex: number;
}
const QuestionSection: React.FC<QuestionSectionProps> = ({
  interviewQuestions,
  activeQuestionIndex,
}) => {
  const textToSpeech = (text: string) => {
    if ("speechSynthesis" in window) {
      const speech = new SpeechSynthesisUtterance(text);
      window.speechSynthesis.speak(speech);
    } else {
      alert("Sorry, Your browser does not support text to speech");
    }
  };
  return (
    interviewQuestions && (
      <div className=" w-fit rounded-lg border p-5">
        <div className="grid grid-cols-2 gap-5 md:grid-cols-3 lg:grid-cols-4">
          {interviewQuestions?.map(({ _id, question }, index) => (
            <div key={_id}>
              <h2
                className={`cursor-pointer rounded-full border py-2 text-center text-xs  text-black dark:text-white  md:text-sm ${activeQuestionIndex == index && "border-none bg-green-500 text-white"}`}
              >
                Question #{index + 1}
              </h2>
              {/* <h3 className="font-semibold">{question}</h3> */}
            </div>
          ))}
        </div>
        <h2 className="text-md mb-4 mt-10 max-w-lg whitespace-normal break-words text-black dark:text-white md:text-lg">
          {interviewQuestions[activeQuestionIndex]?.question}
        </h2>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 640 512"
          className="h-[25px] w-[25px] cursor-pointer dark:fill-white"
          onClick={() =>
            textToSpeech(interviewQuestions[activeQuestionIndex]?.question)
          }
        >
          <path d="M533.6 32.5C598.5 85.2 640 165.8 640 256s-41.5 170.7-106.4 223.5c-10.3 8.4-25.4 6.8-33.8-3.5s-6.8-25.4 3.5-33.8C557.5 398.2 592 331.2 592 256s-34.5-142.2-88.7-186.3c-10.3-8.4-11.8-23.5-3.5-33.8s23.5-11.8 33.8-3.5zM473.1 107c43.2 35.2 70.9 88.9 70.9 149s-27.7 113.8-70.9 149c-10.3 8.4-25.4 6.8-33.8-3.5s-6.8-25.4 3.5-33.8C475.3 341.3 496 301.1 496 256s-20.7-85.3-53.2-111.8c-10.3-8.4-11.8-23.5-3.5-33.8s23.5-11.8 33.8-3.5zm-60.5 74.5C434.1 199.1 448 225.9 448 256s-13.9 56.9-35.4 74.5c-10.3 8.4-25.4 6.8-33.8-3.5s-6.8-25.4 3.5-33.8C393.1 284.4 400 271 400 256s-6.9-28.4-17.7-37.3c-10.3-8.4-11.8-23.5-3.5-33.8s23.5-11.8 33.8-3.5zM301.1 34.8C312.6 40 320 51.4 320 64l0 384c0 12.6-7.4 24-18.9 29.2s-25 3.1-34.4-5.3L131.8 352 64 352c-35.3 0-64-28.7-64-64l0-64c0-35.3 28.7-64 64-64l67.8 0L266.7 40.1c9.4-8.4 22.9-10.4 34.4-5.3z" />
        </svg>
        <div className="mt-20 rounded-lg  bg-blue-100 p-5">
          <h2 className="flex items-center gap-1 ">
            {" "}
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 384 512"
              className="h-6 w-6  fill-blue-700"
            >
              <path d="M297.2 248.9C311.6 228.3 320 203.2 320 176c0-70.7-57.3-128-128-128S64 105.3 64 176c0 27.2 8.4 52.3 22.8 72.9c3.7 5.3 8.1 11.3 12.8 17.7c0 0 0 0 0 0c12.9 17.7 28.3 38.9 39.8 59.8c10.4 19 15.7 38.8 18.3 57.5L109 384c-2.2-12-5.9-23.7-11.8-34.5c-9.9-18-22.2-34.9-34.5-51.8c0 0 0 0 0 0s0 0 0 0c-5.2-7.1-10.4-14.2-15.4-21.4C27.6 247.9 16 213.3 16 176C16 78.8 94.8 0 192 0s176 78.8 176 176c0 37.3-11.6 71.9-31.4 100.3c-5 7.2-10.2 14.3-15.4 21.4c0 0 0 0 0 0s0 0 0 0c-12.3 16.8-24.6 33.7-34.5 51.8c-5.9 10.8-9.6 22.5-11.8 34.5l-48.6 0c2.6-18.7 7.9-38.6 18.3-57.5c11.5-20.9 26.9-42.1 39.8-59.8c0 0 0 0 0 0s0 0 0 0s0 0 0 0c4.7-6.4 9-12.4 12.7-17.7zM192 128c-26.5 0-48 21.5-48 48c0 8.8-7.2 16-16 16s-16-7.2-16-16c0-44.2 35.8-80 80-80c8.8 0 16 7.2 16 16s-7.2 16-16 16zm0 384c-44.2 0-80-35.8-80-80l0-16 160 0 0 16c0 44.2-35.8 80-80 80z" />
            </svg>
            <strong className=" text-blue-700">Note</strong>
          </h2>
          <h2 className=" my-2 mt-3 max-w-lg whitespace-normal break-words text-sm text-blue-700">
            {process.env.NEXT_PUBLIC_QUESTONS_NOTE}
          </h2>
        </div>
      </div>
    )
  );
};

export default QuestionSection;
