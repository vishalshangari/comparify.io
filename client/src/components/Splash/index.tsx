import React, { useState } from "react";
import { useMedia } from "react-use";
import { splash, splash2x, artist, artistLink } from "./constants";
import styled from "styled-components";
import media from "styled-media-query";
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
        timeout={1500}
        onEntered={() => setSplashEntered(true)}
      >
        {(state) => (
          <SplashBackground state={state}>
            <img
              onLoad={() => setSplashLoading(false)}
              src={isHighPixelDensity ? splash2x : splash}
            />
            <SplashBackgroundLabel>
              <a href={artistLink}>{artist}</a>
              via Unsplash
            </SplashBackgroundLabel>
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
              <h1>Comparify</h1>
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
                <h2>
                  Compare your taste with{" "}
                  <span className="brandUnderline">friends and the world</span>.
                </h2>
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
                <h2>
                  <span className="brandUnderline">Discover</span> new music.
                </h2>
              </FrontSubtitle>
            )}
          </Transition>
        </FrontSubtitleWrap>

        <Transition in={allTitlesEntered} timeout={1000}>
          {(state) => (
            <FrontActionButtonWrap state={state}>
              <ActionButton>
                <span>GET STARTED</span> <IoIosArrowDroprightCircle />
              </ActionButton>
              <FrontActionButtonLabel>
                By clicking, you agree to our{" "}
                <a href="http://google.ca">
                  <span>terms &amp; conditions</span>
                </a>
                .
              </FrontActionButtonLabel>
            </FrontActionButtonWrap>
          )}
        </Transition>
      </SplashInner>
    </SplashWrap>
  );
};

const FrontActionButtonLabel = styled.div`
  margin-top: 10px;
  font-size: 1rem;
  color: ${({ theme }) => theme.colors.textTertiary};
  opacity: 0.8;
  line-height: 2rem;
  a {
    border-bottom: 1px solid ${({ theme }) => theme.colors.textTertiary};
    text-decoration: none;
    color: ${({ theme }) => theme.colors.textTertiary};
    &:hover {
      color: #fff;
      border-bottom: 1px solid ${({ theme }) => theme.colors.textPrimary};
    }
  }
`;

const ActionButton = styled.button`
  border: 0;
  outline: 0;
  padding: 1.25rem 1.5rem;
  font-size: 1.25rem;
  margin: 0 auto;
  background: ${({ theme }) => theme.colors.spotifyGreen};
  color: ${({ theme }) => theme.colors.textPrimary};
  border-radius: 0.25em;
  display: flex;
  align-items: center;
  transition: 0.2s ease all;
  cursor: pointer;
  line-height: 1;
  span {
    margin-right: 10px;
    letter-spacing: 1px;
    text-transform: uppercase;
  }
  &:hover {
    padding: 1.25rem 2.25rem;
  }
`;

const FrontActionButtonWrap = styled.div<{ state: string }>`
  position: absolute;
  bottom: 3em;
  text-align: center;
  width: 100%;
  ${({ state }) =>
    state === "entered" || state === `entering` ? `opacity: 1;` : `opacity: 0;`}
  transition: 0.5s ease opacity;
`;

const FrontSubtitle = styled.div<{ state: string }>`
  display: flex;
  justify-content: center;
  transition: 0.5s ease all;
  margin-bottom: 1em;
  padding: 0 1em;
  h2 {
    text-shadow: 2px 2px 2px rgb(0, 0, 0, 0.5);
    font-weight: 500;
    color: ${({ theme }) => theme.colors.textPrimary};
    margin: 0;
    text-align: center;

    .brandUnderline {
      font-weight: 800;
      border-bottom: 3px solid ${({ theme }) => theme.colors.spotifyGreen};
    }
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
  transition: 1s ease all;
  h1 {
    text-shadow: 2px 2px 8px rgb(0, 0, 0, 0.5);
    font-weight: 700;
    color: white;
    margin: 0;
  }
  display: flex;
  justify-content: center;
  ${({ state }) =>
    state === "entered" || state === `entering`
      ? `opacity: 1; transform: translate(-50%, -50%);`
      : `opacity: 0; transform: translate(-50%, -35%);`}
`;

const SplashInner = styled.div`
  max-width: 960px;
  height: 100%;
  position: relative;
  margin: 0 auto;
`;

const SplashBackgroundLabel = styled.div`
  position: absolute;
  right: 0;
  bottom: 0;
  text-align: right;
  font-size: 0.75rem;
  padding: 1em;
  transition: 3s ease opacity;
  color: ${({ theme }) => theme.colors.textTertiary};
  a {
    display: block;
    font-size: 1rem;
    margin-bottom: 0.25em;
    border-bottom: 1px solid ${({ theme }) => theme.colors.textTertiary};
    &:hover {
      color: ${({ theme }) => theme.colors.textPrimary};
      border-bottom: 1px solid ${({ theme }) => theme.colors.textPrimary};
    }
  }
`;

const SplashBackground = styled.div<{ state: string }>`
  img {
    max-height: 100vh;
    z-index: -1;
    opacity: 0;
    transition: 3s ease opacity;
    ${({ state }) =>
      state === "entered" || state === `entering`
        ? `opacity: 0.5;`
        : `opacity: 0;`}
  }
  ${SplashBackgroundLabel} {
    ${({ state }) =>
      state === "entered" || state === `entering`
        ? `opacity: 0.5;`
        : `opacity: 0;`}
  }
  display: flex;
  width: 100%;
  position: absolute;
  justify-content: center;
`;

const SplashWrap = styled.div`
  width: 100vw;
  height: 100vh;
  min-height: 600px;
  overflow: hidden;
  position: relative;
  /* All splash page media queries */
  h1 {
    font-size: 8rem;
    letter-spacing: -2px;
  }
  h2 {
    font-size: 1.75rem;
  }
  ${media.lessThan("large")`
    h2 {
    }
  `}
  ${media.lessThan("medium")`
    h1 {
      font-size: 6rem;
      letter-spacing: -4px;
    }
    h2 {
      font-size: 1.5rem;
    }
    ${FrontSubtitle} {
      margin-bottom: 20px;
    }
    ${ActionButton} {
      font-size: 1rem;
    }
  `}
  ${media.lessThan("small")`
    ${FrontTitle} {
      top: 30%;
    }
    h1 {
      font-size: 3.75rem;
      letter-spacing: -3px;
    }
    h2 {
      font-size: 1.25rem;
    }
    ${SplashBackgroundLabel} {
      display: none;
    }
    ${FrontActionButtonLabel} {
      font-size: 0.75rem;
    }
  `}
`;

export default Splash;
