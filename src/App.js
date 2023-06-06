// 1. Install dependencies Done
// 2. Import dependencies Done
// 3. Setup webcam and canvas 
// 4. Define references to those 
// 5. Load posenet 
// 6. Detect function 
// 7. Drawing utilities from tensorflow 
// 8. Draw functions 

import React, { useRef, useEffect } from "react";
import "./App.css";
import * as tf from "@tensorflow/tfjs";

// NEW MODEL
import * as facemesh from "@tensorflow-models/facemesh";
import Webcam from "react-webcam";
import { drawMesh } from "./utilities";
// import { drawMesh } from "./utilities";



function App() {
  // Setup webcam and canvas
  const webcamRef = useRef(null);
  const canvasRef = useRef(null);

  // Load facemesh
  const runFacemesh = async () => {
    const net = await facemesh.load({
      inputResolution:{width:640, height:480}, scale:0.8
    })
    setInterval(()=>{
      detect(net)
    },100)
  };

  // Detect function 
  const detect = async (net) => {
    if (
      typeof webcamRef.current !== "undefined" &&
      webcamRef.current !== null &&
      webcamRef.current.video.readyState === 4
    ) {
      // Get Video Properties
      const video = webcamRef.current.video;
      const videoWidth = webcamRef.current.video.videoWidth;
      const videoHeight = webcamRef.current.video.videoHeight;

      // Set video width
      webcamRef.current.video.width = videoWidth;
      webcamRef.current.video.height = videoHeight;

      // Set canvas width
      canvasRef.current.width = videoWidth;
      canvasRef.current.height = videoHeight;
      
     const face = await net.estimateFaces(video);
     console.log(face);

     // Get canvas context for drawing
     const ctx = canvasRef.current.getContext("2d");
     drawMesh(face, ctx)



    }
  }

  runFacemesh();
  return (
    <div className="App">
      <div className="header">
        <h1>Facial landmark detection</h1>
        <p>with tensorflow js and react</p>
      </div>
      <Webcam ref={webcamRef} style={
        {
          position:"absolute",
          marginLeft:"auto",
          marginRight:"auto",
          left:0,
          right:0,
          textAlign:"center",
          zIndex:9,
          width:640,
          height:480
        }
      }
      />
     <canvas ref={canvasRef}
     style={
      {
        position:"absolute",
          marginLeft:"auto",
          marginRight:"auto",
          left:0,
          right:0,
          textAlign:"center",
          zIndex:9,
          width:640,
          height:480
      }
     }
     /> 

    </div>
  );
}

export default App;
