import React from "react";
import { Card } from "react-bootstrap";
import { EditOutlined } from "@ant-design/icons";
import { useState } from "react";
import "./style.css";

const SocialMediaPreview = ({ imageUrl, size, onClick }) => {
  const [isLoading, setIsLoading] = useState(true);

  const generateSocialMediaUrl = (size) => {
    return `/.netlify/images?url=${imageUrl}&fit=cover&w=${size.width}&h=${size.height}&q=100`;
  };

  return (
    <Card
      className="bg-black-100 rounded"
      onClick={() => onClick(imageUrl, size)}
    >
      <Card.Body className="p-2">
        <div className="rounded overflow-hidden position-relative">
          <div className="image-container">
            {isLoading && <div className="loader2"></div>}

            <Card.Img
              className="image-hover"
              variant="top"
              alt={`Preview for ${size.name}`}
              src={generateSocialMediaUrl(size)}
              onLoad={() => setIsLoading(false)}
            />
            <div className="middle">
              <EditOutlined style={{ fontSize: "25px" }} className="icon" />
            </div>
          </div>
        </div>
        <Card.Title className="mt-2 text-white fw-normal">
          {size.name}
        </Card.Title>
        <span className="gray-90">
          {size.width}x{size.height}
        </span>
      </Card.Body>
    </Card>
  );
};

export default SocialMediaPreview;
