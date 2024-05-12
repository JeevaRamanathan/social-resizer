import React, { useState } from "react";
import { Card } from "react-bootstrap";
import SocialMediaPreview from "./SocialMediaPreview";
import ImageModal from "./ImageModal";

const socialMediaSizes = {
  instagram: [
    { name: "Profile Photo", width: 320, height: 320 },
    { name: "Landscape", width: 1080, height: 566 },
    { name: "Portrait", width: 1080, height: 1350 },
    { name: "Square", width: 1080, height: 1080 },
    { name: "Stories and Reels", width: 1080, height: 1920 },
  ],
  facebook: [
    { name: "Profile Photo", width: 170, height: 170 },
    { name: "Landscape", width: 1200, height: 630 },
    { name: "Portrait", width: 630, height: 1200 },
    { name: "Square", width: 1200, height: 1200 },
    { name: "Stories and Reels", width: 1080, height: 1920 },
    { name: "Cover Photo", width: 851, height: 315 },
  ],
  twitter: [
    { name: "Profile Photo", width: 400, height: 400 },
    { name: "Landscape", width: 1600, height: 900 },
    { name: "Portrait", width: 1080, height: 1350 },
    { name: "Square", width: 1080, height: 1080 },
    { name: "Cover Photo", width: 1500, height: 500 },
  ],
  linkedin: [
    { name: "Profile Photo", width: 400, height: 400 },
    { name: "Landscape", width: 1200, height: 627 },
    { name: "Portrait", width: 627, height: 1200 },
    { name: "Square", width: 1080, height: 1080 },
    { name: "Cover Photo", width: 1128, height: 191 },
  ],
};
const SocialSection = ({ previewUrl }) => {
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedImageUrl, setSelectedImageUrl] = useState("");
  const [selectedSize, setSelectedSize] = useState({});
  const [selectedPlatform, setSelectedPlatform] = useState();

  const handleSocialMediaPreviewClick = (imageUrl, size, platform) => {
    setModalVisible(true);
    setSelectedImageUrl(imageUrl);
    setSelectedSize(size);
    setSelectedPlatform(platform);
  };

  const generateSocialImageUrl = (height, width) => {
    let url = `/.netlify/images?url=${previewUrl}`;
    url += `&fit=cover`;
    url += `&w=${width}`;
    url += `&h=${height}`;
    return url;
  };

  return (
    <div className="row mt-4 p-4">
      <ImageModal
        imageUrl={previewUrl}
        imageSize={selectedSize}
        visible={modalVisible}
        onClose={() => setModalVisible(false)}
        platform={selectedPlatform}
      />
      {Object.keys(socialMediaSizes).map((platform) => (
        <div key={platform} className="col-12 col-sm-6 col-md-4 col-lg-3">
          <Card className="bg-black-100 rounded">
            <Card.Header>
              <h3 className="platform-title">{platform.toUpperCase()}</h3>
            </Card.Header>
            {socialMediaSizes[platform].map((size) => (
              <Card.Body key={size.name} className="p-2">
                <div className="rounded overflow-hidden position-relative">
                  <SocialMediaPreview
                    imageUrl={previewUrl}
                    size={size}
                    onClick={(imageUrl, size) =>
                      handleSocialMediaPreviewClick(
                        generateSocialImageUrl(size.height, size.width),
                        size,
                        platform.toUpperCase()
                      )
                    }
                  />
                </div>
              </Card.Body>
            ))}
          </Card>
        </div>
      ))}
    </div>
  );
};

export default SocialSection;
