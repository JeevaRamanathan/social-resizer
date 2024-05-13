import { Card, Container } from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";
import { motion } from "framer-motion";
import GithubOutlined from "@ant-design/icons/GithubOutlined";
import AnimationTitles from "./AnimationTitles";
import Navbar from "react-bootstrap/Navbar";
import { Steps } from "antd";
import React from "react";
import "./style.css";

function Loading() {
  const steps = ["Upload", "Transform/Select Image", "Download"];

  return (
    <>
      <Navbar expand="lg" className="py-3">
        <Container>
          <Navbar.Brand href="#" className="me-lg-5">
            <h3 className="text-warning">
              {" "}
              <u>Visual Feast</u>
            </h3>
          </Navbar.Brand>
          <span className="text-end">
            <a
              className="gray-90 mt-3 fs-9"
              target="_blank"
              href="https://dev.to/devteam/join-us-for-the-netlify-dynamic-site-challenge-3000-in-prizes-3mfn"
            >
              A Submission for Netlify Challenge
            </a>
            &nbsp;|&nbsp;
            <a href="https://github.com/jeevaramanathan/">
              <GithubOutlined />
            </a>
          </span>
        </Container>
      </Navbar>
      <div className="loading position-relative">
        <Container className="d-flex justify-content-between align-items-center gap-md-5 flex-column flex-md-row mt-3 mt-xl-4 overflow-hidden">
          <motion.div
            initial={{ x: -400 }}
            animate={{ x: 0 }}
            transition={{ duration: 0.8 }}
          >
            <AnimationTitles title="Social Resizer" />
            <h5 className="text-white">
              Perfectly-Sized Images for Every Platform
            </h5>
            <p className="gray-90 mt-3 fs-5">
              Effortlessly resize images, enhance, and adjust color for
              different social media platforms and post types. Social Resizer
              simplifies the process, ensuring your images fit perfectly for
              each platform, making sharing hassle-free.
            </p>
          </motion.div>
          <motion.div
            initial={{ x: 400 }}
            animate={{ x: 0 }}
            transition={{ duration: 0.8 }}
            className="w-100 my-5"
          >
            <div className="cards">
              <Card className="me-5 bg-black-100 rounded">
                <Card.Body className="p-2">
                  <div className="rounded overflow-hidden position-relative">
                    <Card.Img
                      variant="top"
                      src="https://d2v5dzhdg4zhx3.cloudfront.net/web-assets/images/storypages/short/socialmediaadsimageresizer/socialmediaadsimageresizer/wepb/HEADER.webp"
                      alt="img"
                    />
                  </div>

                  <div className="d-flex">
                    <div className="me-3">
                      <span className="gray-90"></span>
                    </div>
                    <div>
                      <h6 className="text-white">One click, all platforms</h6>
                    </div>
                  </div>
                </Card.Body>
              </Card>

              <Card className="mr-5 bg-black-100">
                <Card.Body className="p-2">
                  <div className="rounded overflow-hidden position-relative">
                    <Card.Img
                      variant="top"
                      src="https://d2v5dzhdg4zhx3.cloudfront.net/web-assets/images/storypages/short/socialmediaadsimageresizer/socialmediaadsimageresizer/wepb/001.webp"
                      alt="img"
                    />
                  </div>
                  <h6 className="mt-2 text-white fw-normal">
                    Stand out with optimized visuals
                  </h6>
                </Card.Body>
              </Card>
            </div>
          </motion.div>
        </Container>
        <div className=" d-flex justify-content-center align-items-center">
          <div className="stepper-container">
            <Steps current={-1}>
              {steps.map((label, index) => (
                <Steps.Step key={index} title={label} />
              ))}
            </Steps>
          </div>
        </div>
      </div>
    </>
  );
}

export default Loading;
