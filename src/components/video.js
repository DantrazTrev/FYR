function Videos({ uploadedFiles }) {
  const src = URL.createObjectURL(uploadedFiles);
  return (
    <div>
      <h3>Videos</h3>
      <video>
        <source src={src} id='video' type='video/mp4' />
        Your browser does not support HTML5 video.
      </video>
    </div>
  );
}
export default Videos;
