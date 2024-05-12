import React, { useState, useRef, useEffect } from "react";
import { InboxOutlined, DeleteOutlined } from "@ant-design/icons";
import { Upload, Slider, Button, Tooltip } from "antd";
import "./CustomPreview.css";
const { Dragger } = Upload;
const CustomPreview = ({ deleteImage, fileprops, previewUrl, tone }) => {
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [scale, setScale] = useState(1);
  const [sliderValue, setSliderValue] = useState(100);
  const containerRef = useRef(null);
  const imageRef = useRef(null);
  const [isDragging, setIsDragging] = useState(false);
  const [dragStartPos, setDragStartPos] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const container = containerRef.current;
    container.addEventListener("touchmove", handlePinchZoom);
    return () => {
      container.removeEventListener("touchmove", handlePinchZoom);
    };
  }, []);

  const handlePinchZoom = (e) => {
    e.preventDefault();
    if (e.touches.length >= 2) {
      const touch1 = e.touches[0];
      const touch2 = e.touches[1];
      const distance = Math.sqrt(
        (touch1.clientX - touch2.clientX) ** 2 +
          (touch1.clientY - touch2.clientY) ** 2
      );
      const initialDistance = Math.sqrt(
        (touch1.clientX - touch2.clientX) ** 2 +
          (touch1.clientY - touch2.clientY) ** 2
      );
      const newScale = scale + (distance - initialDistance) / 100;
      const sliderVal = Math.floor(Math.min(Math.max(newScale * 100, 5), 700));
      setScale(newScale);
      setSliderValue(Math.round(sliderVal));
    }
  };

  const handleMouseDown = (e) => {
    e.preventDefault();
    setIsDragging(true);
    const startX = e.clientX - position.x;
    const startY = e.clientY - position.y;
    setDragStartPos({ x: startX, y: startY });
  };

  const handleMouseMove = (e) => {
    e.preventDefault();
    if (isDragging) {
      const mouseX = e.clientX;
      const mouseY = e.clientY;
      const newX = mouseX - dragStartPos.x;
      const newY = mouseY - dragStartPos.y;
      setPosition({ x: newX, y: newY });
    }
  };

  const handleMouseUp = () => {
    setIsDragging(false);
    window.removeEventListener("mousemove", handleMouseMove);
    window.removeEventListener("mouseup", handleMouseUp);
  };

  useEffect(() => {
    if (isDragging) {
      window.addEventListener("mousemove", handleMouseMove);
      window.addEventListener("mouseup", handleMouseUp);
    } else {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseup", handleMouseUp);
    }

    return () => {
      window.removeEventListener("mouseup", handleMouseUp);
    };
  }, [isDragging]);

  const handleImageLoad = () => {
    const imageWidth = imageRef.current.width;
    const containerWidth = containerRef.current.offsetWidth;
    const newScale = containerWidth / imageWidth;
    setScale(newScale);
    setSliderValue(Math.round(newScale * 100));
  };

  const getFilterFromTone = () => {
    switch (tone) {
      case "sepia":
        return "sepia(100%)";
      case "grayscale":
        return "grayscale(100%)";
      case "invert":
        return "invert(100%)";
      case "brightness":
        return "brightness(150%)";
      case "contrast":
        return "contrast(200%)";
      case "blur":
        return "blur(5px)";
      default:
        return "none"; // Default to no filter
    }
  };

  return (
    <div
      className="custom-preview-outer-container"
      style={{ maxWidth: "600px", height: "600px",width:"100%",minWidth:"300px"}}
    >
      <div
        className="custom-preview-container"
        ref={containerRef}
        onWheel={(e) => {
          e.preventDefault();
          const scaleFactor = e.deltaY < 0 ? 1.1 : 0.9;
          const newScale = Math.min(Math.max(scale * scaleFactor, 0.5), 5);
          const sliderVal = Math.min(Math.max(newScale * 100, 5), 700);
          setScale(newScale);
          if (previewUrl != "") setSliderValue(Math.round(sliderVal));
        }}
        onMouseDown={handleMouseDown}
      >
        {console.log(previewUrl)}
        {previewUrl != "" ? (
          <>
            <div
              className="custom-preview-inner-container"
              style={{
                transform: `translate(${position.x}px, ${position.y}px) scale(${scale})`,
              }}
            >
              <img
                ref={imageRef}
                className="custom-preview-image"
                src={previewUrl}
                style={{ filter: getFilterFromTone() }}
                draggable="false"
                alt="Preview"
                onLoad={handleImageLoad}
              />
            </div>
          </>
        ) : (
          <Dragger {...fileprops}>
            <p className="ant-upload-drag-icon">
              <InboxOutlined />
            </p>
            <p className="ant-upload-text">
              Click or drag file to this area to upload
            </p>
          </Dragger>
        )}
      </div>

      <span className="d-flex justify-content-center align-items-center w-100 mt-4">
        <span className="mb-2">Zoom</span>
        <span
          style={{
            display: "flex",
            alignItems: "center",
            width: "80%",
            marginBottom: "10px",
          }}
        >
          <Slider
            className="custom-preview-slider"
            value={sliderValue}
            min={5}
            disabled={previewUrl === ""}
            max={700}
            onChange={(value) => {
              const newScale = value / 100;
              setScale(newScale);
              setSliderValue(value);
            }}
            style={{ width: "80%", marginRight: "20px" }}
          />
          <span>{sliderValue}</span>

          {previewUrl && (
            <Tooltip title="Delete Image">
              <div
                className="ms-5"
                style={{ display: "flex", justifyContent: "flex-end" }}
              >
                <Button icon={<DeleteOutlined />} onClick={deleteImage} />
              </div>
            </Tooltip>
          )}
        </span>
      </span>
    </div>
  );
};

export default CustomPreview;
