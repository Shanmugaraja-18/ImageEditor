import React, { useState, useRef } from "react";
import "./DragDropFiles.css";

const DragDropFiles = () => {
  const [files, setFiles] = useState(null);
  const [uploadedImage, setUploadedImage] = useState(
    localStorage.getItem("uploadedImage")
  );
  const [addedText, setAddedText] = useState("");
  const [textSize, setTextSize] = useState(16); 
  const [dragging, setDragging] = useState(false);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [editMode, setEditMode] = useState(false);
  const inputRef = useRef();

  const handleDragOver = (event) => {
    event.preventDefault();
  };

  const handleDrop = (event) => {
    event.preventDefault();
    setFiles(event.dataTransfer.files);
  };

  const handleUpload = () => {
    if (files) {
      const reader = new FileReader();

      reader.onload = (e) => {
        const imageData = e.target.result;

        localStorage.setItem("uploadedImage", imageData);

        setUploadedImage(imageData);
        setFiles(null); 
      };

      reader.readAsDataURL(files[0]);
    }
  };

  const handleAddText = () => {
    setAddedText("Click to edit");
    setEditMode(true);
  };

  const handleTextSizeChange = (event) => {
    setTextSize(parseInt(event.target.value, 10));
  };

  const handleDragStart = (event) => {
    setDragging(true);

    const rect = event.target.getBoundingClientRect();
    const offsetX = event.clientX - rect.left;
    const offsetY = event.clientY - rect.top;

    setPosition({ x: offsetX, y: offsetY });

    event.dataTransfer.setData("text/plain", "dragging");
  };

  const handleDragEnd = () => {
    setDragging(false);
  };

  const handleDragOverImage = (event) => {
    event.preventDefault();
    if (dragging) {
      const rect = event.target.getBoundingClientRect();
      const offsetX = event.clientX - rect.left;
      const offsetY = event.clientY - rect.top;

      setPosition({ x: offsetX, y: offsetY });
    }
  };

  const handleDownload = () => {
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");

    const img = new Image();
    img.src = uploadedImage;

    canvas.width = img.width;
    canvas.height = img.height;

    ctx.drawImage(img, 0, 0);

    ctx.font = `${textSize}px Arial`;
    ctx.fillText(addedText, position.x, position.y + textSize);

    const dataUrl = canvas.toDataURL("image/png");
    const link = document.createElement("a");
    link.href = dataUrl;
    link.download = "result_image.png";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="container">
      <div className="side-by-side">
        <div
          className="dropzone"
          onDragOver={handleDragOver}
          onDrop={handleDrop}
        >
          <h1>Drag and Drop Files to Upload</h1>
          <h1>Or</h1>
          <input
            type="file"
            multiple
            onChange={(event) => setFiles(event.target.files)}
            hidden
            accept="image/png, image/jpeg"
            ref={inputRef}
          />
          <button onClick={() => inputRef.current.click()}>Select Files</button>
          {files && (
            <div className="actions">
              <button onClick={() => setFiles(null)}>Cancel</button>
              <button onClick={handleUpload}>Upload</button>
            </div>
          )}
        </div>

        {uploadedImage && (
          <div className="image-container" onDragOver={handleDragOverImage}>
            <div className="text-box">
              <button onClick={handleAddText}>Add Text</button>
              <input
                type="number"
                value={textSize}
                onChange={handleTextSizeChange}
                placeholder="Text Size"
              />
              {editMode ? (
                <input
                  type="text"
                  value={addedText}
                  onChange={(e) => setAddedText(e.target.value)}
                  placeholder="Edit text"
                />
              ) : (
                <div
                  className="added-text"
                  style={{
                    fontSize: textSize + "px",
                    position: "absolute",
                    top: position.y + "px",
                    left: position.x + "px",
                    cursor: dragging ? "grabbing" : "grab",
                  }}
                  draggable
                  onDragStart={handleDragStart}
                  onDragEnd={handleDragEnd}
                >
                  {addedText}
                </div>
              )}
            </div>
            <div className="uploaded-image">
              <h2>Uploaded Image:</h2>
              <img src={uploadedImage} alt="Uploaded" />
              <button onClick={handleDownload}>Download</button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default DragDropFiles;































