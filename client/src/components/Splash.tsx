import React, { useState } from "react";
import { useMedia } from "react-use";
import splash2x from "../assets/img/splashBg@2x.jpg";
import splash from "../assets/img/splashBg.jpg";
import styled from "styled-components";
import { Transition } from "react-transition-group";
import { IoIosArrowDroprightCircle } from "react-icons/io";

const Splash = () => {
  const isHighPixelDensity = useMedia(
    "(-webkit-min-device-pixel-ratio: 2), (min-resolution: 192dpi)"
  );
  const [splashLoading, setSplashLoading] = useState(true);
  const [splashEntered, setSplashEntered] = useState(false);
  const [titleEntered, setTitleEntered] = useState(false);
  const [subtitleEntered, setSubtitleEntered] = useState(false);
  const [allTitlesEntered, setAllTitlesEntered] = useState(false);

  return (
    <SplashWrap>
      <Transition
        in={!splashLoading}
        timeout={1000}
        onEntered={() => setSplashEntered(true)}
      >
        {(state) => (
          <SplashBackground state={state}>
            <img
              onLoad={() => setSplashLoading(false)}
              src={isHighPixelDensity ? splash2x : splash}
            />
          </SplashBackground>
        )}
      </Transition>
      <SplashInner>
        <Transition
          in={splashEntered}
          timeout={1500}
          onEntered={() => setTitleEntered(true)}
        >
          {(state) => (
            <FrontTitle state={state}>
              <h1>Comparify.</h1>
            </FrontTitle>
          )}
        </Transition>
        <FrontSubtitleWrap>
          <Transition
            in={titleEntered}
            timeout={1000}
            onEntered={() => setSubtitleEntered(true)}
          >
            {(state) => (
              <FrontSubtitle state={state}>
                <h2>Compare your taste with friends and the world.</h2>
              </FrontSubtitle>
            )}
          </Transition>
          <Transition
            in={subtitleEntered}
            timeout={1000}
            onEntered={() => setAllTitlesEntered(true)}
          >
            {(state) => (
              <FrontSubtitle state={state}>
                <h2>Discover new music.</h2>
              </FrontSubtitle>
            )}
          </Transition>
        </FrontSubtitleWrap>

        <Transition in={allTitlesEntered} timeout={1000}>
          {(state) => (
            <FrontActionButtonWrap state={state}>
              <ActionButton>
                <span>Get Started</span> <IoIosArrowDroprightCircle />
              </ActionButton>
            </FrontActionButtonWrap>
          )}
        </Transition>
      </SplashInner>
    </SplashWrap>
  );
};

const ActionButton = styled.button`
  border: 0;
  outline: 0;
  padding: 1.25rem 1.5rem;
  font-size: 1.5rem;
  background: ${({ theme }) => theme.colors.spotifyGreen};
  color: ${({ theme }) => theme.colors.textPrimary};
  border-radius: 0.25em;
  display: flex;
  align-items: center;
  transition: 0.2s ease all;
  cursor: pointer;
  span {
    margin-right: 10px;
  }
  &:hover {
    padding: 1.25rem 2.25rem;
    background: ${({ theme }) => theme.colors.spotifyGreenDim};
  }
`;

const FrontActionButtonWrap = styled.div<{ state: string }>`
  position: absolute;
  bottom: 3em;
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
`;

const FrontSubtitle = styled.div<{ state: string }>`
  display: flex;
  justify-content: center;
  transition: 1s ease all;
  margin-bottom: 5px;
  h2 {
    font-family: "open sans";
    font-size: 2rem;
    text-shadow: 2px 2px 4px rgb(0, 0, 0, 0.5);
    font-weight: normal;
    color: ${({ theme }) => theme.colors.textPrimary};
    margin: 0;
  }
  ${({ state }) =>
    state === "entered" || state === `entering` ? `opacity: 1;` : `opacity: 0;`}
`;

const FrontSubtitleWrap = styled.div`
  position: absolute;
  width: 100%;
  left: 50%;
  transform: translateX(-50%);
  top: calc(45% + 7em);
`;

const FrontTitle = styled.div<{ state: string }>`
  position: absolute;
  left: 50%;
  top: 45%;
  transition: 1.5s ease all;
  h1 {
    font-family: "open sans";
    font-size: 8rem;
    letter-spacing: -5px;
    text-shadow: 2px 2px 8px rgb(0, 0, 0, 0.5);
    font-weight: bolder;
    color: ${({ theme }) => theme.colors.textPrimary};
    margin: 0;
  }
  display: flex;
  justify-content: center;
  ${({ state }) =>
    state === "entered" || state === `entering`
      ? `opacity: 1; transform: translate(-50%, -50%);`
      : `opacity: 0; transform: translate(-50%, 0);`}
`;

const SplashInner = styled.div`
  max-width: 960px;
  height: 100%;
  position: relative;
  margin: 0 auto;
`;

const SplashWrap = styled.div`
  width: 100vw;
  height: 100vh;
  overflow: hidden;
  position: relative;
`;

const SplashBackground = styled.div<{ state: string }>`
  img {
    max-height: 100vh;
    z-index: -1;
    opacity: 0;
    transition: 3s ease all;
    ${({ state }) =>
      state === "entered" || state === `entering`
        ? `opacity: 0.3;`
        : `opacity: 0;`}
  }
  display: flex;
  width: 100%;
  position: absolute;
  justify-content: center;
`;

export default Splash;
