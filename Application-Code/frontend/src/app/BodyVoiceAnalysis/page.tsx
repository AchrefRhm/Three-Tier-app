"use client";

import { useEffect, useRef, useState } from "react";
import * as mpPose from "@mediapipe/pose";
import * as cam from "@mediapipe/camera_utils";
import axios from "axios";

export default function BodyVoiceAnalysis() {
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const [transcription, setTranscription] = useState("");
  const [poseData, setPoseData] = useState(null);
  const [analysisResult, setAnalysisResult] = useState(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [isCameraActive, setIsCameraActive] = useState(false); // Track if camera is active
  let camera;

  console.log(analysisResult);

  useEffect(() => {
    if (!videoRef.current) return;

    const pose = new mpPose.Pose({
      locateFile: (file) =>
        `https://cdn.jsdelivr.net/npm/@mediapipe/pose/${file}`,
    });

    pose.setOptions({
      modelComplexity: 1,
      smoothLandmarks: true,
      minDetectionConfidence: 0.5,
      minTrackingConfidence: 0.5,
    });

    pose.onResults((results) => {
      setPoseData(results.poseLandmarks);
      //   drawPose(results);
    });

    const startCamera = () => {
      if (videoRef.current) {
        camera = new cam.Camera(videoRef.current, {
          onFrame: async () => {
            await pose.send({ image: videoRef.current });
          },
          width: 640,
          height: 480,
        });
        camera.start();
      }
    };

    const stopCamera = () => {
      if (camera) {
        camera.stop();
      }
    };

    // Start or stop the camera based on isCameraActive state
    if (isCameraActive) {
      startCamera();
    } else {
      stopCamera();
    }

    return () => {
      stopCamera();
    };
  }, [isCameraActive]);

  //   const drawPose = (results) => {
  //     if (!canvasRef.current) return;
  //     const ctx = canvasRef.current.getContext("2d");
  //     ctx.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);

  //     if (results.poseLandmarks) {
  //       results.poseLandmarks.forEach((landmark) => {
  //         ctx.beginPath();
  //         ctx.arc(landmark.x * 640, landmark.y * 480, 5, 0, 2 * Math.PI);
  //         ctx.fillStyle = "red";
  //         ctx.fill();
  //       });
  //     }
  //   };

  const startListening = () => {
    if (!window.webkitSpeechRecognition) {
      alert("Speech recognition is not supported in this browser.");
      return;
    }

    const recognition = new window.webkitSpeechRecognition();
    recognition.lang = "fr-FR";
    recognition.continuous = true;

    recognition.onresult = (event) => {
      const transcript = Array.from(event.results)
        .map((result) => result[0].transcript)
        .join(" ");
      setTranscription(transcript);
    };

    recognition.onend = () => {};

    recognition.start();
  };

  const submitAnalysis = async () => {
    if (!transcription || !poseData) {
      alert("Please provide both voice transcription and body pose data.");
      return;
    }

    setIsAnalyzing(true);

    try {
      const response = await axios.post(
        "http://localhost:5000/api/analyse/generate",
        {
          transcription,
          poseData,
        },
      );
      setAnalysisResult(response.data);
      console.log("Server Response:", response.data);
    } catch (error) {
      console.error("Error sending data to server:", error);
    } finally {
      setIsAnalyzing(false);
    }
  };

  return (
    <div className="relative flex flex-col items-center">
      <h1 className="text-xl font-bold">
        Analyse du Langage Corporel et de la Voix
      </h1>

      {/* Video and Canvas for Pose Detection */}
      <video ref={videoRef} className="w-80" autoPlay playsInline />
      <canvas
        ref={canvasRef}
        className="absolute left-0 top-0"
        width="640"
        height="480"
      />

      {/* Button for starting/stopping the camera */}
      <button
        className="z-10 mt-4 rounded bg-yellow-500 p-2 text-white"
        onClick={() => setIsCameraActive((prevState) => !prevState)}
      >
        {isCameraActive ? "Arrêter la caméra" : "Démarrer la caméra"}
      </button>

      {/* Button for Voice Recognition */}
      <button
        className="z-10 mt-4 rounded bg-blue-500 p-2 text-white"
        onClick={startListening}
      >
        Démarrer l'analyse vocale
      </button>

      <p className="mt-2 w-80 bg-gray-100 p-2">{transcription}</p>

      {/* Submit Button */}
      <button
        className="z-10 mt-4 rounded bg-green-500 p-2 text-white"
        onClick={submitAnalysis}
        disabled={isAnalyzing}
      >
        {isAnalyzing ? "En cours..." : "Soumettre l'analyse"}
      </button>

      {/* Display Analysis Result */}
      {analysisResult && (
        <div className="mt-4 rounded border border-gray-300 bg-gray-50 p-4">
          <h2 className="font-bold">Résultat de l'analyse</h2>
          <pre>{JSON.stringify(analysisResult, null, 2)}</pre>
        </div>
      )}
    </div>
  );
}
