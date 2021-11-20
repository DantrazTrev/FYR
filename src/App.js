import * as faceapi from 'face-api.js';
import './App.css';
import { useState, useRef } from 'react';
import Camera from './components/camera';

function App() {
  const [intilaizing, setintilaizing] = useState(false);
  const videoref = useRef();
  const player = useRef();

  const [start, setStart] = useState(false);
  const [selectedFile, setSelectedFile] = useState();

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
            <video ref={player} height={501} width={906}>
              <source src={selectedFile} id='video' type='video/mp4' />
            </video>
          )}
        </div>
        {!start && (
          <div
            style={{ display: 'flex', width: '100%', flexDirection: 'column' }}
          >
            <label for='file'>Choose Video</label>
            <label for='file'>Use Link</label>
          </div>
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
