import React, { useState } from "react";
import {
  // splash,
  splash2x,
  artist,
  artistLink,
  unsplash,
  unsplashLink,
} from "./constants";
import styled, { createGlobalStyle } from "styled-components";
import { Transition } from "react-transition-group";
import { IoIosArrowDroprightCircle } from "react-icons/io";
import { breakpoints, colors, Theme } from "../../theme";
import { DEV_URL } from "../../constants";
import useWindowSize from "../../hooks/useWindowSize";

type ColoredTicker = {
  label: string;
  color: string;
};

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

  const coloredTickers: ColoredTicker[] = [
    {
      label: "happy",
      color: "#F0A66C",
    },
    {
      label: "danceable",
      color: colors.blueCityBlue,
    },
    {
      label: "energetic",
      color: colors.spanishViolet,
    },
    {
      label: "mainstream",
      color: colors.spotifyGreen,
    },
  ];
  const [activeTickerItem, setActiveTickerItem] = useState(0);

  const setNextTickerItem = () => {
    setActiveTickerItem((prevIndex) =>
      prevIndex < coloredTickers.length - 1 ? prevIndex + 1 : 0
    );
  };

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
          <Transition
            in={titleEntered}
            timeout={300}
            onEntered={() => {
              setSubtitleEntered(true);
              setTimeout(() => {
                setNextTickerItem();
              }, 1500);
            }}
          >
            {(state) => (
              <FrontSubtitle state={state}>
                <span>How</span>
                <TextTicker
                  tickerBorder={coloredTickers[activeTickerItem].color}
                >
                  {coloredTickers.map((ticker, index) => (
                    <Transition
                      in={activeTickerItem === index}
                      timeout={1500}
                      onEntered={() => setNextTickerItem()}
                    >
                      {(state) => (
                        <TextTickerItem
                          style={{ color: "white" }}
                          state={state}
                        >
                          {ticker.label}
                        </TextTickerItem>
                      )}
                    </Transition>
                  ))}
                </TextTicker>
                <span>is your music?</span>
              </FrontSubtitle>
            )}
          </Transition>
          <Transition
            in={subtitleEntered}
            timeout={300}
            onEntered={() => setAllTitlesEntered(true)}
          >
            {(state) => (
              <FrontSubtitle style={{ marginBottom: 0 }} state={state}>
                <h3>Find out what your music says about you.</h3>
              </FrontSubtitle>
            )}
          </Transition>
        </FrontSubtitleWrap>

        <Transition in={allTitlesEntered} timeout={300}>
          {(state) => (
            <FrontActionButtonWrap state={state}>
              <ActionButton href={`${DEV_URL}/api/auth/login`}>
                <span>Log-in with Spotify</span> <IoIosArrowDroprightCircle />
              </ActionButton>
              <FrontActionButtonLabel>
                Our{" "}
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

const TextTicker = styled.div<{ tickerBorder: string }>`
  position: relative;
  width: 8em;
  background: ${({ tickerBorder }) => tickerBorder};
  transition: 0.2s cubic-bezier(0.165, 0.84, 0.44, 1) all;
  height: 1.75em;
  padding: 0.375em 0.25em;
  font-size: 1.5em;
  margin: 0 0.25em;
  border-radius: 0.25em;
`;

const TextTickerItem = styled.span<{ state: string }>`
  position: absolute;
  line-height: 1em;
  transition: 0.2s cubic-bezier(0.165, 0.84, 0.44, 1) all;
  font-weight: 800;
  ${({ state }) =>
    state === "entered" || state === `entering`
      ? `opacity: 1; transform: translateY(0);`
      : state === `exiting`
      ? `opacity: 0; transform: scale(0.85) translate(-10%, -100%);`
      : `opacity: 0; transform: scale(0.85) translate(-10%, 100%);`};
`;

const FrontActionButtonLabel = styled.div`
  margin-top: 1em;
  ${breakpoints.lessThan("38")`
    margin-top: 0;
  `}
  font-size: 0.75em;
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
  padding: 1em 1.5em;
  font-size: 1em;
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
    margin-right: 0.75em;
    font-weight: 600;
    ${breakpoints.greaterThan("38")`
      text-transform: uppercase;  
      letter-spacing: 1px;
    `}
  }
  ${breakpoints.greaterThan("38")`
    &:hover {
      padding: 1em 2.25em;
    }
  `}
`;

const FrontActionButtonWrap = styled.div<{ state: string }>`
  bottom: 3em;
  font-size: 1.25rem;
  text-align: center;
  width: 100%;
  flex-wrap: wrap;
  display: flex;
  justify-content: center;
  transition: 0.2s cubic-bezier(0.165, 0.84, 0.44, 1) all;
  ${({ state }) =>
    state === "entered" || state === `entering`
      ? `opacity: 1; transform: translateY(0);`
      : `opacity: 0; transform: translateY(200%);`}
`;

const FrontSubtitle = styled.div<{ state: string }>`
  display: flex;
  align-items: center;
  justify-content: center;
  text-shadow: 2px 2px 2px rgb(0, 0, 0, 0.2);
  font-size: 1.75rem;
  transition: 0.2s cubic-bezier(0.165, 0.84, 0.44, 1) all;
  margin-bottom: 3em;
  ${({ state }) =>
    state === "entered" || state === `entering`
      ? `opacity: 1; transform: translateY(0);`
      : `opacity: 0; transform: translateY(200%);`}
`;

const FrontSubtitleWrap = styled.div`
  width: 100%;
  margin: 2em 0;
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
  width: 100%;
  -webkit-user-select: none; /* Chrome all / Safari all */
  -moz-user-select: none; /* Firefox all */
  -ms-user-select: none; /* IE 10+ */
  img {
    height: 100%;
    width: 100%;
    object-fit: cover;
    z-index: -1;
    opacity: 0;
    transition: 3s ease opacity;
    ${({ state }) =>
      state === "entered" || state === `entering`
        ? `opacity: 0.5;`
        : `opacity: 0;`}
  }
  display: flex;
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
  ${breakpoints.lessThan("74")`
    h1 {
      font-size: 7rem;
      letter-spacing: -1px;
    }
    ${FrontSubtitle} {
      font-size: 1.5rem;
    }
  `};
  ${breakpoints.lessThan("48")`
    h1 {
      font-size: 5rem;
    }
    ${FrontSubtitle} {
      font-size: 1.25rem;
    }
    ${FrontActionButtonWrap} {
      font-size: 1.25rem;
    }
  `};
  ${breakpoints.lessThan("38")`
    ${SplashInner} {
      padding: 0 3%;
    }
    ${FrontTitle} {
      display: block;
    }
    ${FrontSubtitle} {
      justify-content: flex-start;
    }
    ${FrontSubtitleWrap} {
      margin-bottom: 1em;
    }
    ${TextTicker} {
      font-size: 1.25em;
      width: 7em;
    }
    h1 {
      font-size: 4rem;
      text-align: left;
    }
    ${FrontSubtitle} {
      font-size: 1.25rem;
    }
    ${SplashBackgroundLabel} {
      display: none;
    }
    ${FrontActionButtonWrap} {
      text-align: left;
      justify-content: flex-start;
      font-size: 1rem;
      a {
        margin: 0;
      }
    }
    ${ActionButton} {
      padding: .75em 1em;
    }
  `};
  ${breakpoints.lessThan("26")`
    ${FrontSubtitle} {
      font-size: 1rem;
    }
  `}
  ${breakpoints.lessThan("22")`
    ${SplashInner} {
      padding: 0.5em;
    }
    h1 {
      font-size: 2.75rem;
      text-align: left;
    }
    ${TextTicker} {
      font-size: 1em;
    }
  `}
`;

const SplashGlobalStyle = createGlobalStyle<{ theme: Theme }>`
  body {
    overflow: hidden;
  }
`;

export default Splash;
