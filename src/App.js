import * as faceapi from 'face-api.js';
import './App.css';
import { useState, useEffect, useRef } from 'react';
import Camera from './components/camera';

function App() {
  const [intilaizing, setintilaizing] = useState(false);
  const videoref = useRef();
  const player = useRef();

  const [start, setStart] = useState(false);
  const [selectedFile, setSelectedFile] = useState();
  const [isFilePicked, setIsFilePicked] = useState(false);

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
  const changeHandler = (event) => {
    setSelectedFile(URL.createObjectURL(event.target.files[0]));
    setIsFilePicked(true);
  };

  const onFileUpload = () => {
    const formData = new FormData();

    // Update the formData object
    formData.append(
      'myFile',
      this.state.selectedFile,
      this.state.selectedFile.name
    );
  };
  return (
    <div id='app' className='app'>
      <input
        type='file'
        id='file'
        onChange={changeHandler}
        accept='video/mp4'
      />

      <div className='text'>
        Please Upload a video file
        {/* <span aria-label='emoji' role='img' id='emoji'>
          😐
        </span>
        You look <span id='textStatus'>...</span>! */}
      </div>
      {selectedFile && (
        <video ref={player} autoPlay height={200} width={400}>
          <source src={selectedFile} id='video' type='video/mp4' />
        </video>
      )}
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
