import * as faceapi from 'face-api.js';
import './App.css';
import { useState, useEffect, useRef } from 'react';

function App() {
  const videoHeight = 480;

  const videoWidth = 640;
  const [intilaizing, setintilaizing] = useState(false);
  const videoref = useRef();
  const canvasref = useRef();

  useEffect(() => {
    const loadModels = async () => {
      const MODEL_URL = process.env.PUBLIC_URL + '/models';
      setintilaizing(true);
      Promise.all([
        faceapi.nets.tinyFaceDetector.loadFromUri(MODEL_URL),
        faceapi.nets.faceLandmark68Net.loadFromUri(MODEL_URL),
        faceapi.nets.faceRecognitionNet.loadFromUri(MODEL_URL),
        faceapi.nets.faceExpressionNet.loadFromUri(MODEL_URL),
      ]).then(startVideo);
    };
    loadModels();
  }, []);
  const startVideo = () => {
    if (navigator.mediaDevices === undefined) {
      navigator.mediaDevices = {};
    }

    // Some browsers partially implement mediaDevices. We can't just assign an object
    // with getUserMedia as it would overwrite existing properties.
    // Here, we will just add the getUserMedia property if it's missing.
    if (navigator.mediaDevices.getUserMedia === undefined) {
      navigator.mediaDevices.getUserMedia = function (constraints) {
        // First get ahold of the legacy getUserMedia, if present
        var getUserMedia =
          navigator.webkitGetUserMedia || navigator.mozGetUserMedia;

        // Some browsers just don't implement it - return a rejected promise with an error
        // to keep a consistent interface
        if (!getUserMedia) {
          return Promise.reject(
            new Error('getUserMedia is not implemented in this browser')
          );
        }

        // Otherwise, wrap the call to the old navigator.getUserMedia with a Promise
        return new Promise(function (resolve, reject) {
          getUserMedia.call(navigator, constraints, resolve, reject);
        });
      };
    }

    navigator.mediaDevices
      .getUserMedia({ video: true })
      .then(function (stream) {
        // Older browsers may not have srcObject
        if ('srcObject' in videoref.current) {
          videoref.current.srcObject = stream;
        } else {
          // Avoid using this in new browsers, as it is going away.
          videoref.current.src = stream;
        }
        videoref.current.onloadedmetadata = function (e) {
          videoref.current.play();
        };
      })
      .catch(function (err) {
        console.log(err.name + ': ' + err.message);
      });
  };
  const handleVideoPlay = () => {
    setInterval(async () => {
      if (intilaizing) {
        setintilaizing(false);
      }
      const detection = await faceapi
        .detectSingleFace(
          videoref.current,
          new faceapi.TinyFaceDetectorOptions()
        )
        .withFaceExpressions();
      console.log(detection);
    }, 100);
  };
  return (
    <div className='App'>
      <span>{intilaizing ? 'Intializing' : 'ready'}</span>
      <video
        ref={videoref}
        autoPlay
        muted
        height={videoHeight}
        width={videoWidth}
        onPlay={handleVideoPlay}
      />
      <canvas ref={canvasref} />
    </div>
  );
}

export default App;
