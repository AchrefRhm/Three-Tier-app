"use client";
import dynamic from "next/dynamic";
import React from "react";
import ChartOne from "../Charts/ChartOne";
import ChartTwo from "../Charts/ChartTwo";
import ChatCard from "../Chat/ChatCard";
import TableOne from "../Tables/TableOne";
import CardDataStats from "../CardDataStats";
import AddNewInterview from "../AddNewInterview";
import InterviewList from "../InterviewList";

const MapOne = dynamic(() => import("@/components/Maps/MapOne"), {
  ssr: false,
});

const ChartThree = dynamic(() => import("@/components/Charts/ChartThree"), {
  ssr: false,
});

const ECommerce: React.FC = () => {
  return (
    <div className="min-h-screen p-3 dark:bg-boxdark">
      <h1 className="font-bold dark:text-white">Dashboard</h1>
      <p className="mb-6 mt-2 text-gray-700 dark:text-white">
        Create and start your AI Mockup interview
      </p>
      <AddNewInterview />
      <InterviewList />
    </div>
  );
};

export default ECommerce;
