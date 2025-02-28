import axios from "axios";
import React, { useEffect, useState } from "react";
import InterviewItemCard from "./InterviewItemCard";

const InterviewList = () => {
  const [data, setData] = useState([]);

  const fetchData = () => {
    axios
      .get("http://localhost:5000/api/interview/user/67a9ca365e04634d04aea7aa")
      .then((response) => {
        setData(response.data.interviews);
      });
  };
  useEffect(() => {
    fetchData();
  }, []);
  console.log(data);
  return (
    <div className="mt-4 ">
      <h2 className="text-xl font-medium text-black dark:text-white">
        Interview List
      </h2>
      <div className="my-3 grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3">
        {data &&
          data.map((interview, index) => (
            <InterviewItemCard key={index} interview={interview} />
          ))}
      </div>
    </div>
  );
};

export default InterviewList;
