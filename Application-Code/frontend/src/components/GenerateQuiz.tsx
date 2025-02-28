import Modal from "react-modal";
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";

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

const GenerateQuiz = () => {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [quiz, setQuiz] = useState([]);
  const [topic, setTopic] = useState<string>("");
  const [difficulty, setDifficulty] = useState<string>("easy");
  const [questionCount, setQuestionCount] = useState<number>(5);
  const [questionType, setQuestionType] = useState<string>("one correct");
  const handleOpen = () => setOpen(!open);
  const onRequestClose = () => setOpen(false);

  const generateQuiz = async () => {
    setQuiz([]);

    try {
      setLoading(true);
      const response = await axios.post<QuizQuestion[]>(
        "http://localhost:5000/api/quiz",
        {
          topic,
          difficulty,
          questionCount,
          questionType,
          user: "67a9ca365e04634d04aea7aa",
        },
      );
      setLoading(false);
      setQuiz(response.data);
      router.push(`/quiz/start/${response.data._id}`);
    } catch (error) {
      console.error("Error fetching quiz:", error);
    }
  };

  return (
    <div>
      <div className="w-[100%]">
        <div className="mb-4 w-fit cursor-pointer rounded-lg border border-[#10B981] bg-transparent px-12 py-4 text-[#10B981] transition-all hover:scale-105 hover:shadow-lg ">
          <h2 className="text-center text-lg font-bold" onClick={handleOpen}>
            Generate Quiz{" "}
          </h2>
        </div>

        <Modal
          isOpen={open}
          onRequestClose={onRequestClose}
          contentLabel="Order Modal"
          className="fixed left-1/2 top-1/2 z-50 w-[90%] max-w-[600px]  -translate-x-1/2 -translate-y-1/2 transform rounded-md bg-white p-4 shadow-lg outline-none dark:bg-[#1A222C] lg:left-[calc((100vw-290px)/2+290px)]"
          overlayClassName="fixed inset-0 bg-black bg-opacity-50"
        >
          <button
            onClick={onRequestClose}
            className="absolute right-3 top-1 z-10 text-black dark:text-white"
          >
            x
          </button>
          <div className="p-4">
            <h1 className="text-xl font-bold text-black dark:text-white">
              Tell us more about your Quiz test
            </h1>
            <p className="mt-1 text-xs text-gray-500 dark:text-white">
              Add details about topic, type of question, difficulty and number
              of questions.
            </p>

            <div className="mt-4 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-white">
                  Topic
                </label>
                <input
                  type="text"
                  value={topic}
                  onChange={(e) => setTopic(e.target.value)}
                  className="mt-1 w-full rounded-md border p-2 focus:outline-none focus:ring-2 focus:ring-green-500"
                  placeholder="Enter Topic"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-white">
                  Type of question
                </label>
                <select
                  className=" mt-1 w-full rounded border p-2"
                  value={questionType}
                  onChange={(e) => setQuestionType(e.target.value)}
                >
                  <option value="one correct">single choice</option>
                  <option value="multiple correct">multiple choice</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-white">
                  Difficulty
                </label>
                <select
                  className=" mt-1 w-full rounded border p-2"
                  value={difficulty}
                  onChange={(e) => setDifficulty(e.target.value)}
                >
                  <option value="easy">Easy</option>
                  <option value="medium">Medium</option>
                  <option value="difficult">Difficult</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-white">
                  Number of questions
                </label>
                <select
                  className="mb-4 mt-1 w-full rounded border p-2"
                  value={questionCount}
                  onChange={(e) => setQuestionCount(Number(e.target.value))}
                >
                  <option value={5}>5</option>
                  <option value={10}>10</option>
                  <option value={15}>15</option>
                  <option value={20}>20</option>
                </select>
              </div>
            </div>

            <div className="mt-6 flex justify-end space-x-4">
              <button
                onClick={onRequestClose}
                className="rounded-md bg-gray-500 px-4 py-2 text-white hover:bg-gray-600"
              >
                Cancel
              </button>
              {loading ? (
                <button
                  className="focus:shadow-outline flex items-center rounded bg-green-500 px-4 py-2 font-bold text-white hover:bg-green-600 focus:outline-none"
                  disabled
                >
                  <svg
                    className="-ml-1 mr-3 h-5 w-5 animate-spin text-white"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      stroke-width="4"
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    ></path>
                  </svg>
                  Loading...
                </button>
              ) : (
                <button
                  onClick={generateQuiz}
                  className="rounded-md bg-green-500 px-4 py-2 text-white hover:bg-green-600"
                >
                  Submit
                </button>
              )}
            </div>
          </div>
        </Modal>
      </div>
    </div>
  );
};

export default GenerateQuiz;
