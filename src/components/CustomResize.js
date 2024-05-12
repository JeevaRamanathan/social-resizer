import { Button, Container } from "react-bootstrap";
import React, { useRef } from "react";
import { Row, Col, Select, Slider, Input, Form, Tooltip } from "antd";
import { useState, useEffect } from "react";
import { Alert, Space } from "antd";
import { message } from "antd";
import InfoCircleOutlined from "@ant-design/icons/InfoCircleOutlined";
import { motion } from "framer-motion";
import SocialSection from "./SocialSection";
import "./style.css";
import CustomPreview from "./CustomPreview";

const { Option } = Select;

function CustomResize() {
  const [width, setWidth] = useState(800);
  const [height, setHeight] = useState(600);
  const [quality, setQuality] = useState(10);
  const [fit, setFit] = useState("cover");
  const [position, setPosition] = useState("center");
  const [format, setFormat] = useState("png");
  const [isUploading, setIsUploading] = useState(false);

  const [tones, setTones] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [previewUrl, setPreviewUrl] = useState("");

  const handleToneChange = (value) => {
    setTones(value);
  };

  useEffect(() => {
    generateImageUrl();
  }, [width, height, quality, fit, position, format, tones]);

  const uploadImage = async (base64Img, fileName) => {
    setIsUploading(true);
    try {
      const response = await fetch("/.netlify/functions/upload", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ base64Img, fileName }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      setImageUrl(data.url);
      generateImageUrl(data.url);
      message.success("Image loaded successfully");
    } catch (error) {
      message.error("Error" + error.message);
      console.error(
        "There was a problem with the fetch operation: " + error.message
      );
    } finally {
      setIsUploading(false);
    }
  };

  const generateImageUrl = (tempUrl) => {
    if (!tempUrl && !imageUrl) return;

    let _imageUrl = tempUrl ? tempUrl : imageUrl;
    let url = `/.netlify/images?url=${_imageUrl}`;

    url += `&fit=${fit}`;
    url += `&w=${width}`;
    url += `&h=${height}`;
    url += `&q=${quality}`;
    url += `&position=${position}`;
    url += `&fm=${format}`;

    setPreviewUrl(url);
    console.log(url);
  };

  const deleteImage = () => {
    setImageUrl("");
    setPreviewUrl("");
    setWidth(800);
    setHeight(600);
    setQuality(10);
    setFit("cover");
    setPosition("center");
    setFormat("png");
    setTones("");
  };

  const fileprops = {
    name: "file",
    beforeUpload: (file) => {
      const isLt2M = file.size / 1024 / 1024 < 3;
      if (!isLt2M) {
        message.error("Image must smaller than 3MB!");
        return false;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        uploadImage(reader.result, file.name);
      };
      reader.readAsDataURL(file);
      return false;
    },
    onChange(info) {
      const { status } = info.file;

      if (status === "done") {
        message.success(`${info.file.name} file uploaded successfully.`);
      } else if (status === "error") {
        message.error(`${info.file.name} file upload failed.`);
      }
    },
    onDrop(e) {
      console.log("Dropped files", e.dataTransfer.files);
    },
  };

  const getFilterFromTone = () => {
    switch (tones) {
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
    }
  };

  const downloadImage = (previewUrl) => {
    const image = new Image();
    image.crossOrigin = "anonymous";
    image.onload = () => {
      const canvas = document.createElement("canvas");
      const ctx = canvas.getContext("2d");
      canvas.width = image.width;
      canvas.height = image.height;
      ctx.filter = getFilterFromTone();
      ctx.drawImage(image, 0, 0);
      const link = document.createElement("a");
      link.download = "modified_image.png";
      link.href = canvas.toDataURL();
      link.click();
    };
    image.src = previewUrl;
    message.success("Image downloaded successfully");
  };

  return (
    <div className="custom-resize">
      {isUploading && <div className="loader"></div>}
      <Container>
        <h3 className="d-flex justify-content-center">Custom Resize</h3>

        {previewUrl && (
          <Space
            direction="vertical"
            className="mb-2"
            style={{ width: "100%" }}
          >
            <Alert message={previewUrl} type="warning" showIcon />
          </Space>
        )}
        <Row>
          <Col lg={15} md={15}>
            <CustomPreview
              fileprops={fileprops}
              deleteImage={deleteImage}
              previewUrl={previewUrl}
              tone={tones}
            ></CustomPreview>
          </Col>
          <Col lg={6} md={6}>
            <motion.div
              initial={{ x: -100 }}
              whileInView={{ x: 0 }}
              transition={{ duration: 0.8 }}
            >
              <div className="preview-controls">
                <Form
                  layout="vertical"
                  style={{ width: "100%" }}
                  disabled={!previewUrl}
                >
                  <Row gutter={16}>
                    <Col span={12}>
                      <Form.Item label="Width">
                        <Input
                          placeholder="Width"
                          value={width}
                          onChange={(e) => setWidth(e.target.value)}
                        />
                      </Form.Item>
                    </Col>
                    <Col span={12}>
                      <Form.Item label="Height">
                        <Input
                          style={{ width: "100%" }}
                          placeholder="Height"
                          value={height}
                          onChange={(e) => setHeight(e.target.value)}
                        />
                      </Form.Item>
                    </Col>
                  </Row>
                  <Row gutter={16}>
                    <Col span={12}>
                      <Form.Item label="Fit">
                        <div style={{ width: "100%" }}>
                          <div className="select-container">
                            <Select
                              value={fit}
                              style={{ width: "100%" }}
                              onChange={setFit}
                            >
                              <Option value="cover">Cover</Option>
                              <Option value="contain">Contain</Option>
                              <Option value="fill">Fill</Option>
                            </Select>
                          </div>
                        </div>
                      </Form.Item>
                    </Col>
                    <Col span={12}>
                      <Form.Item label="Position">
                        <div className="select-container">
                          <Select
                            style={{ width: "100%" }}
                            value={position}
                            onChange={setPosition}
                          >
                            <Option value="center">Center</Option>
                            <Option value="top">Top</Option>
                            <Option value="bottom">Bottom</Option>
                            <Option value="left">Left</Option>
                            <Option value="right">Right</Option>
                          </Select>
                        </div>
                      </Form.Item>
                    </Col>
                  </Row>
                  <Row gutter={16}>
                    <Col span={12}>
                      <Form.Item label="Format" style={{ width: "100%" }}>
                        <div className="select-container">
                          <Select
                            style={{ width: "100%" }}
                            value={format}
                            onChange={setFormat}
                          >
                            <Option value="webp">WEBP</Option>
                            <Option value="jpg">JPG</Option>
                            <Option value="png">PNG</Option>
                            <Option value="auto">Auto</Option>
                            <Option value="avif">AVIF</Option>
                          </Select>
                        </div>
                      </Form.Item>
                    </Col>
                    <Col span={12}>
                      <Form.Item label="Quality">
                        <Slider
                          className="custom-preview-slider"
                          style={{ width: "100%" }}
                          value={quality}
                          onChange={setQuality}
                          min={1}
                          max={100}
                        />
                      </Form.Item>
                    </Col>
                  </Row>
                  <Row gutter={16}>
                    <Col span={24}>
                      <Form.Item
                        label={
                          <span>
                            Color Tone&nbsp;
                            <Tooltip title="Color tone is applied through CSS, not Netlify Image CDN">
                              <InfoCircleOutlined type="info-circle" />
                            </Tooltip>
                          </span>
                        }
                      >
                        <div className="select-container">
                          <Select
                            placeholder="Select Color Tone"
                            value={tones}
                            onChange={handleToneChange}
                          >
                            <Option value="normal">Normal</Option>
                            <Option value="sepia">Sepia</Option>
                            <Option value="grayscale">Grayscale</Option>
                            <Option value="invert">Invert</Option>
                            <Option value="brightness">Brightness</Option>
                            <Option value="blur">Blur</Option>
                          </Select>
                        </div>
                      </Form.Item>
                    </Col>
                  </Row>

                  <Row gutter={16}>
                    <Col span={24}>
                      <Form.Item>
                        <Button
                          disabled={!previewUrl}
                          className="download-button"
                          type="primary"
                          block
                          onClick={() => {
                            downloadImage(previewUrl);
                          }}
                        >
                          Download Image
                        </Button>
                      </Form.Item>
                    </Col>
                  </Row>
                </Form>
              </div>
            </motion.div>
          </Col>
        </Row>
        {previewUrl && (
          <div
            className="scroll"
            style={{
              position: "absolute",
              bottom: 50,
              left: "50%",
            }}
          >
            <div className="mouse"></div>
          </div>
        )}
      </Container>
      {previewUrl && <SocialSection previewUrl={imageUrl} />}
    </div>
  );
}
export default CustomResize;
