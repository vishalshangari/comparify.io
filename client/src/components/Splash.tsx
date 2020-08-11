import React, { useState } from "react";
import { useMedia } from "react-use";
import splash2x from "../assets/img/splashBg@2x.jpg";
import splash from "../assets/img/splashBg.jpg";
import styled from "styled-components";

const Splash = () => {
  const isHighPixelDensity = useMedia("(-webkit-min-device-pixel-ratio: 2)");
  const [loading, setLoading] = useState(true);

  return (
    <SplashWrap>
      <span style={{ color: "white" }}>hello</span>
      <SplashBackground>
        <img src={isHighPixelDensity ? splash2x : splash} />
      </SplashBackground>
    </SplashWrap>
  );
};

const SplashWrap = styled.div`
  width: 100vw;
  height: 100vh;
  overflow: hidden;
`;

const SplashBackground = styled.div`
  img {
    max-height: 100vh;
  }
  display: flex;
  justify-content: center;
`;

export default Splash;
