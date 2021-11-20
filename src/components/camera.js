/* eslint no-use-before-define: 0 */ // --> OFF

import React, { useEffect } from 'react';
import * as faceapi from 'face-api.js';

function Camera({ videoref, handleVideoPlay, setintilaizing }) {
  const videoHeight = 180;

  const videoWidth = 240;

  useEffect(() => {
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
  }, [setintilaizing, videoref]);

  return (
    <>
      <div className='overlay'></div>
      <div className='mockup'>
        <div id='browser ' className='browser'>
          <video
            className='video'
            ref={videoref}
            autoPlay
            muted
            height={videoHeight}
            width={videoWidth}
            onPlay={handleVideoPlay}
          />
        </div>
      </div>
    </>
  );
}

export default Camera;
