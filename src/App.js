import * as faceapi from 'face-api.js';
import './App.css';
import { useState, useRef } from 'react';
import Camera from './components/camera';

function App() {
  const [intilaizing, setintilaizing] = useState(false);
  const videoref = useRef();
  const player = useRef();
  const progress = useRef();

  const [start, setStart] = useState(false);
  const [play, setPlay] = useState(false);
  const [selectedFile, setSelectedFile] = useState();
  const [detection, setdetection] = useState('');
  var toHHMMSS = (secs) => {
    var sec_num = parseInt(secs, 10);
    var hours = Math.floor(sec_num / 3600);
    var minutes = Math.floor(sec_num / 60) % 60;
    var seconds = sec_num % 60;

    return [hours, minutes, seconds]
      .map((v) => (v < 10 ? '0' + v : v))
      .filter((v, i) => v !== '00' || i > 0)
      .join(':');
  };

  const handleVideoPlay = () => {
    setInterval(async () => {
      if (intilaizing) {
        setintilaizing(false);
      }
      const detections = await faceapi
        .detectSingleFace(
          videoref.current,
          new faceapi.TinyFaceDetectorOptions()
        )
        .withFaceExpressions();
      if (detections) {
        console.log(detections);
        //For each face detection
        if ('expressions' in detections) {
          let status = Object.keys(detections.expressions).reduce((a, b) =>
            detections.expressions[a] > detections.expressions[b] ? a : b
          );
          setdetection(toHHMMSS(player.current.currentTime) + ' ' + status);
          // const marker = document.createElement('div');

          // marker.style.position = 'absolute';
          // marker.style.backgroundColor = 'red';
          // marker.style.height = '95%';
          // marker.style.width = '2%';
          // marker.style.left = `${
          //   (player.current.currentTime / player.current.duration) * 100
          // }%`;

          // progress.current.appendChild(marker);
        }
      }
    }, 100);
    player.current.play();
  };
  const changeHandler = (event) => {
    setSelectedFile(URL.createObjectURL(event.target.files[0]));
    setStart(true);
  };

  // const onFileUpload = () => {
  //   const formData = new FormData();

  //   // Update the formData object
  //   formData.append(
  //     'myFile',
  //     this.state.selectedFile,
  //     this.state.selectedFile.name
  //   );
  // };
  return (
    <div id='app' className='app'>
      <div id='preview'>
        <div id='thumb-cont'>
          {selectedFile && (
            <>
              <video
                ref={player}
                height={501}
                width={906}
                onPlay={() => {
                  setPlay(true);
                }}
              >
                <source src={selectedFile} id='video' type='video/mp4' />
              </video>
              <div class='progress' ref={progress}>
                <div
                  class='progress-filled'
                  style={
                    play
                      ? {
                          width: `${
                            (player.current.currentTime /
                              player.current.duration) *
                            100
                          }%`,
                        }
                      : {}
                  }
                ></div>
              </div>
            </>
          )}
        </div>
        {!start ? (
          <div
            style={{ display: 'flex', width: '100%', flexDirection: 'column' }}
          >
            <label for='file'>Choose Video</label>
            <label for='file'>Use Link</label>
          </div>
        ) : (
          <div className='text'>{detection}</div>
        )}
        <input
          type='file'
          id='file'
          style={{ display: 'none' }}
          onChange={changeHandler}
          accept='video/mp4'
        />
      </div>

      {start ? (
        <>
          <Camera
            handleVideoPlay={handleVideoPlay}
            videoref={videoref}
            setintilaizing={setintilaizing}
          />
          <p className='note'>
            You are not being recorded, it all happens in your own browser!
          </p>
        </>
      ) : (
        ''
      )}
    </div>
  );
}

export default App;
