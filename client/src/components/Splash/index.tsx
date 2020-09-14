import React, { useState } from "react";
// import { useMedia } from "react-use";
import {
  // splash,
  splash2x,
  artist,
  artistLink,
  unsplash,
  unsplashLink,
} from "./constants";
import styled, { createGlobalStyle } from "styled-components";
import media from "styled-media-query";
import { Transition } from "react-transition-group";
import { IoIosArrowDroprightCircle } from "react-icons/io";
import { Theme } from "../../theme";
import { DEV_URL } from "../../constants";
import useWindowSize from "../../hooks/useWindowSize";

const Splash = () => {
  // If retina display query needed for bg
  // const isHighPixelDensity = useMedia(
  //   "(-webkit-min-device-pixel-ratio: 2), (min-resolution: 192dpi)"
  // );
  const [splashLoading, setSplashLoading] = useState(true);
  const [splashEntered, setSplashEntered] = useState(false);
  const [titleEntered, setTitleEntered] = useState(false);
  const [subtitleEntered, setSubtitleEntered] = useState(false);
  const [allTitlesEntered, setAllTitlesEntered] = useState(false);
  const size = useWindowSize();

  document.title = `Comparify - Compare your music with others' and discover new music`;

  return (
    <SplashWrap style={{ height: size?.height }}>
      <SplashGlobalStyle />
      <Transition
        in={!splashLoading}
        timeout={1500}
        onEntered={() => setSplashEntered(true)}
      >
        {(state) => (
          <>
            <SplashBackgroundLabel state={state}>
              <a href={artistLink}>{artist}</a>
              {` / `}
              <a href={unsplashLink}>{unsplash}</a>
            </SplashBackgroundLabel>
            <SplashBackground state={state}>
              <img
                onLoad={() => setSplashLoading(false)}
                // src={isHighPixelDensity ? splash2x : splash}
                alt={""}
                src={splash2x}
              />
            </SplashBackground>
          </>
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
          {/* <Transition
            in={titleEntered}
            timeout={1000}
            onEntered={() => setSubtitleEntered(true)}
          >
            {(state) => (
              <FrontSubtitle state={state}>
                <h3>
                  What does your music say{" "}
                  <span className="brandUnderline">about you</span>?
                </h3>
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
                <h3>
                  Compare your taste with{" "}
                  <span className="brandUnderline">friends and the world</span>.
                </h3>
              </FrontSubtitle>
            )}
          </Transition> */}
          {/* <Transition
            in={subtitleEntered}
            timeout={1000}
            onEntered={() => setAllTitlesEntered(true)}
          >
            {(state) => (
              <FrontSubtitle state={state}>
                <h3>
                  <span className="brandUnderline">Discover</span> new music.
                </h3>
              </FrontSubtitle>
            )}
          </Transition> */}
        </FrontSubtitleWrap>

        <Transition in={allTitlesEntered} timeout={1000}>
          {(state) => (
            <FrontActionButtonWrap state={state}>
              <ActionButton href={`${DEV_URL}/api/auth/login`}>
                <span>Log in with Spotify</span> <IoIosArrowDroprightCircle />
              </ActionButton>
              <FrontActionButtonLabel>
                By clicking, you agree to our{" "}
                <a href="/privacy">
                  <span>privacy policy</span>
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
  font-weight: 600;
  color: ${({ theme }) => theme.colors.textPrimary};
  opacity: 0.7;
  width: 100%;
  line-height: 2rem;
  a {
    border-bottom: 1px solid ${({ theme }) => theme.colors.mainAccent};
    background: ${({ theme }) => theme.colors.mainAccent10p};
    color: ${({ theme }) => theme.colors.textPrimary};
    &:hover {
      background: ${({ theme }) => theme.colors.mainAccent};
    }
  }
`;

const ActionButton = styled.a`
  border: 0;
  outline: 0;
  z-index: 3;
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
    font-weight: 600;
    letter-spacing: 1px;
    text-transform: uppercase;
  }
  &:hover {
    padding: 1.25rem 2.25rem;
  }
`;

const FrontActionButtonWrap = styled.div<{ state: string }>`
  bottom: 3em;
  text-align: center;
  width: 100%;
  flex-wrap: wrap;
  display: flex;
  justify-content: center;
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
  h3 {
    text-shadow: 2px 2px 2px rgb(0, 0, 0, 0.2);
    font-weight: 500;
    color: ${({ theme }) => theme.colors.textPrimary};
    margin: 0;
    text-align: center;

    .brandUnderline {
      font-weight: 700;
      border-bottom: 3px solid ${({ theme }) => theme.colors.spotifyGreen};
    }
  }
  ${({ state }) =>
    state === "entered" || state === `entering` ? `opacity: 1;` : `opacity: 0;`}
`;

const FrontSubtitleWrap = styled.div`
  width: 100%;
  margin: 2em 0 5em;
`;

const FrontTitle = styled.div<{ state: string }>`
  margin-top: 30vh;
  transition: 1s ease opacity, 1s ease transform;
  h1 {
    text-shadow: 2px 2px 8px rgb(0, 0, 0, 0.2);
    font-weight: 700;
    color: ${({ theme }) => theme.colors.textPrimary};
    margin: 0;
    text-align: center;
    line-height: 1;
  }
  display: flex;
  justify-content: center;
  ${({ state }) =>
    state === "entered" || state === `entering`
      ? `opacity: 1; transform: translate(0, -50%);`
      : `opacity: 0; transform: translate(0, -35%);`}
`;

const SplashInner = styled.div`
  height: 100%;
  margin: 0 auto;
`;

const SplashBackgroundLabel = styled.div<{ state: string }>`
  position: absolute;
  right: 0;
  bottom: 0;
  text-align: right;
  /* font-size: 1rem; */
  padding: 1em;
  transition: 3s ease opacity;
  color: ${({ theme }) => theme.colors.textTertiary};
  a {
    font-weight: 600;
    &:hover {
      color: ${({ theme }) => theme.colors.textPrimary};
      border-bottom: 1px solid ${({ theme }) => theme.colors.textPrimary};
    }
  }
  ${({ state }) =>
    state === "entered" || state === `entering` ? `opacity: 1;` : `opacity: 0;`}
`;

const SplashBackground = styled.div<{ state: string }>`
  height: 100%;
  -webkit-user-select: none; /* Chrome all / Safari all */
  -moz-user-select: none; /* Firefox all */
  -ms-user-select: none; /* IE 10+ */
  img {
    max-height: 100%;
    width: auto;
    z-index: -1;
    opacity: 0;
    transition: 3s ease opacity;
    ${({ state }) =>
      state === "entered" || state === `entering`
        ? `opacity: 0.5;`
        : `opacity: 0;`}
  }
  display: flex;
  width: 100%;
  position: absolute;
  justify-content: center;
  z-index: -3;
`;

const SplashWrap = styled.div`
  width: 100vw;

  overflow: hidden;
  position: relative;
  /* All splash page media queries */
  h1 {
    font-size: 9rem;
    letter-spacing: -2px;
  }
  h3 {
    font-size: 1.75rem;
  }
  ${media.lessThan("large")`
    h3 {
    }
  `}
  ${media.lessThan("medium")`
    h1 {
      font-size: 5.75rem;
      letter-spacing: -1px;
    }
    h3 {
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
    height: auto;
    min-height: 650px;
    ${FrontTitle} {
      margin-top: 30vh;
    };
    h1 {
      font-size: 4rem;
      letter-spacing: -1px;
    }
    h3 {
      font-size: 1.25rem;
    }
    ${SplashBackgroundLabel} {
      display: none;
    }
    ${FrontActionButtonLabel} {
      font-size: 0.75rem;
    }
    ${FrontSubtitle} {
      line-height: 1.5;
    }
  `}
`;

const SplashGlobalStyle = createGlobalStyle<{ theme: Theme }>`
  body {
    background: #000;
  }
`;

export default Splash;
