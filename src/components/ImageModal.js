import React, { useState, useEffect, useRef } from "react";
import {
  Modal,
  Button,
  Select,
  Slider,
  Form,
  Input,
  Row,
  Col,
  Tooltip,
  message,
  Alert,
} from "antd";
import { InfoCircleOutlined } from "@ant-design/icons";

const ImageModal = ({ imageUrl, onClose, visible, imageSize, platform }) => {
  const [previewUrl, setPreviewUrl] = useState(imageUrl);
  const [quality, setQuality] = useState(100);
  const [fit, setFit] = useState("cover");
  const [position, setPosition] = useState("center");
  const [format, setFormat] = useState("png");
  const [tones, setTones] = useState("normal");

  const handleDownload = () => {
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

  const handleToneChange = (value) => {
    setTones(value);
  };

  const generateImageUrl = () => {
    let url = `/.netlify/images?url=${imageUrl}`;

    url += `&fit=${fit}`;
    url += `&w=${imageSize.width}`;
    url += `&h=${imageSize.height}`;
    url += `&q=${quality}`;
    url += `&position=${position}`;
    url += `&fm=${format}`;

    setPreviewUrl(url);
  };
  useEffect(() => {
    generateImageUrl();
  }, []);

  useEffect(() => {
    generateImageUrl();
  }, [quality, fit, position, format, imageUrl, visible]);

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
      default:
        return "none"; // Default to no filter
    }
  };
  return (
    <Modal
      title="Image Preview"
      open={visible}
      closable={false}
      footer={[
        <Button key="back" onClick={onClose}>
          Close
        </Button>,
      ]}
    >
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        <h6 className="text-white">
          {" "}
          {platform} - {imageSize.width} x {imageSize.height}
        </h6>
        <Alert
          style={{ maxWidth: "100%" }}
          message={previewUrl}
          type="warning"
          showIcon
        />

        <div
          style={{
            marginTop: "20px",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          <img
            src={previewUrl}
            alt="Preview"
            style={{
              filter: getFilterFromTone(),
              maxWidth: "100%",
              maxHeight: "calc(100vh - 300px)",
            }}
          />
        </div>
      </div>
      <div style={{ marginTop: "20px" }}>
        <Form layout="vertical" style={{ width: "100%" }}>
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item label="Width">
                <Input placeholder="Width" value={imageSize.width} disabled />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item label="Height">
                <Input
                  style={{ width: "100%" }}
                  placeholder="Height"
                  value={imageSize.height}
                  disabled
                />
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item label="Fit">
                <Select value={fit} style={{ width: "100%" }} onChange={setFit}>
                  <Select.Option value="cover">Cover</Select.Option>
                  <Select.Option value="contain">Contain</Select.Option>
                  <Select.Option value="fill">Fill</Select.Option>
                </Select>
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item label="Position">
                <Select
                  style={{ width: "100%" }}
                  value={position}
                  onChange={setPosition}
                >
                  <Select.Option value="center">Center</Select.Option>
                  <Select.Option value="top">Top</Select.Option>
                  <Select.Option value="bottom">Bottom</Select.Option>
                  <Select.Option value="left">Left</Select.Option>
                  <Select.Option value="right">Right</Select.Option>
                </Select>
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item label="Format">
                <Select
                  style={{ width: "100%" }}
                  value={format}
                  onChange={setFormat}
                >
                  <Select.Option value="webp">WEBP</Select.Option>
                  <Select.Option value="jpg">JPG</Select.Option>
                  <Select.Option value="png">PNG</Select.Option>
                  <Select.Option value="auto">Auto</Select.Option>
                  <Select.Option value="avif">AVIF</Select.Option>
                </Select>
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
                <Select
                  placeholder="Select Color Tone"
                  value={tones}
                  onChange={handleToneChange}
                >
                  <Select.Option value="normal">Normal</Select.Option>
                  <Select.Option value="sepia">Sepia</Select.Option>
                  <Select.Option value="grayscale">Grayscale</Select.Option>
                  <Select.Option value="invert">Invert</Select.Option>
                  <Select.Option value="brightness">Brightness</Select.Option>
                  <Select.Option value="blur">Blur</Select.Option>
                </Select>
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={16}>
            <Col span={24}>
              <Form.Item>
                <Button type="primary" block onClick={handleDownload}>
                  Download Image
                </Button>
              </Form.Item>
            </Col>
          </Row>
        </Form>
      </div>
    </Modal>
  );
};

export default ImageModal;
