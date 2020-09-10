import React, { useState } from "react";
import styled from "styled-components";
import { AudioFeaturesComparisonProps, AudioFeaturesState } from "./models";
import { audioFeatures } from "./constants";
import { audioFeatureDescriptions } from "../../AudioFeatures/constants";
import round5x from "../../../utils/round5x";
import { colors, breakpoints } from "../../../theme";
import { IoMdInformationCircle } from "react-icons/io";
import { Bar } from "react-chartjs-2";
import { useMedia } from "react-use";

const AudioFeatresComparison = ({
  audioFeaturesComparisonData,
  creatorUserInfo,
  visitorUserInfo,
}: AudioFeaturesComparisonProps) => {
  const [audioFeaturesState, setAudioFeaturesState] = useState<
    AudioFeaturesState
  >("valence");
  const handleAudioFeatureClick = (feature: AudioFeaturesState) => {
    setAudioFeaturesState(feature);
  };
  const isSmall = useMedia("(max-width: 42em)");

  const generateAudioFeaturesChartData = (feature: AudioFeaturesState) =>
    audioFeaturesComparisonData
      ? {
          labels: ["all-time", "recent", "now"],
          datasets: [
            {
              label: "You",
              backgroundColor: colors.iris90p,
              borderColor: colors.iris,
              borderWidth: 1,
              data: audioFeaturesComparisonData[feature].visitor,
            },
            {
              label: creatorUserInfo?.displayName.split(" ")[0],
              backgroundColor: colors.neonGreen90p,
              borderColor: colors.neonGreen,
              borderWidth: 1,
              data: audioFeaturesComparisonData[feature].creator,
            },
          ],
        }
      : {};
  return (
    <AudioFeaturesGroup>
      <div className="clippedHeading">
        <h2>Music Characterization</h2>
      </div>
      <AudioFeaturesOptions state={audioFeaturesState}>
        {audioFeatures.map((feature, idx) => (
          <AudioFeaturesButton
            key={idx}
            onClick={() => handleAudioFeatureClick(feature)}
            active={audioFeaturesState === feature ? true : false}
          >
            {feature === `valence` ? `happiness` : feature}
          </AudioFeaturesButton>
        ))}
      </AudioFeaturesOptions>
      <MobileAudioFeaturesOptions state={audioFeaturesState}>
        {audioFeatures.map((feature, idx) => (
          <MobileAudioFeaturesButton
            key={idx}
            onClick={() => handleAudioFeatureClick(feature)}
            active={audioFeaturesState === feature ? true : false}
          >
            {feature === `valence` ? `happiness` : feature}
          </MobileAudioFeaturesButton>
        ))}
      </MobileAudioFeaturesOptions>
      {audioFeaturesComparisonData ? (
        <AudioFeaturesChart>
          <AudioFeatureDescription>
            <div className="featureInfo">
              <div className="featureDescription">
                {audioFeatureDescriptions[audioFeaturesState].desc}
              </div>
              <div className="featureTechnical">
                <div className="icon">
                  <IoMdInformationCircle />
                </div>{" "}
                <p>
                  {" "}
                  {audioFeatureDescriptions[audioFeaturesState].measurement}
                </p>
              </div>
            </div>
          </AudioFeatureDescription>
          <AudioFeaturesChartInner>
            <Bar
              datasetKeyProvider={Math.random}
              data={generateAudioFeaturesChartData(audioFeaturesState)}
              options={{
                maintainAspectRatio: isSmall ? false : true,
                scales: {
                  xAxes: [
                    {
                      ticks: {
                        fontColor: colors.grey1,
                        fontSize: isSmall ? 12 : 16,
                        fontFamily: "'open sans', sans-serif",
                        fontStyle: "bold",
                      },
                      gridLines: {
                        display: false,
                      },
                    },
                  ],
                  yAxes: [
                    {
                      ticks: {
                        min: round5x(
                          Math.min(
                            ...audioFeaturesComparisonData[audioFeaturesState]
                              .creator,
                            ...audioFeaturesComparisonData[audioFeaturesState]
                              .visitor
                          ) - 20
                        ),
                        max: round5x(
                          Math.max(
                            ...audioFeaturesComparisonData[audioFeaturesState]
                              .creator,
                            ...audioFeaturesComparisonData[audioFeaturesState]
                              .visitor
                          ) + 5
                        ),
                        fontColor: colors.grey1,
                        stepSize: 5,
                      },
                      gridLines: {
                        color: "rgb(255,255,255,0.1)",
                        zeroLineColor: "rgb(255,255,255,0.1)",
                      },
                    },
                  ],
                },
                tooltips: {
                  displayColors: false,
                },
                legend: {
                  display: true,
                  position: `bottom`,
                  labels: {
                    fontSize: isSmall ? 12 : 16,
                    fontColor: colors.grey1,
                    fontFamily: "'open sans', sans-serif",
                    padding: 20,
                  },
                },
              }}
            />
          </AudioFeaturesChartInner>
        </AudioFeaturesChart>
      ) : (
        <div className="dataLoadError">
          Oops, there was an error loading analysis of moods.
        </div>
      )}
    </AudioFeaturesGroup>
  );
};

export default AudioFeatresComparison;

// Audio Features

const MobileAudioFeaturesOptions = styled.div<{ state: AudioFeaturesState }>`
  display: none;
  flex-wrap: wrap;
  margin: 1em 0;
  overflow: hidden;
  ${breakpoints.lessThan("48")`
    display: flex;
  `}
`;

const MobileAudioFeaturesButton = styled.button<{ active: boolean }>`
  flex: 0 0 50%;
  border-radius: 1em;
  font-size: 1.5rem;
  ${breakpoints.lessThan("38")`
    flex: 0 0 100%;
    font-size: 1rem;
  `}
  ${breakpoints.lessThan("30")`

    font-size: 1rem;
  `}
  padding: 0.75em;
  font-family: "roboto slab", "open sans", "sans-serif";
  font-weight: 700;
  text-transform: capitalize;
  &:nth-child(1) {
    /* background: ${({ theme, active }) =>
      active ? theme.colors.straw : `transparent`}; */
    color: ${({ theme, active }) =>
      active ? theme.colors.strawDark : theme.colors.textTertiary};
    background: ${({ theme, active }) => (active ? theme.colors.straw : ``)};
  }
  &:nth-child(2) {
    /* background: ${({ theme, active }) =>
      active ? theme.colors.spanishViolet : `transparent`}; */
    color: ${({ theme, active }) =>
      active ? theme.colors.spanishVioletDark : theme.colors.textTertiary};
    background: ${({ theme, active }) =>
      active ? theme.colors.spanishViolet : ``};
  }
  &:nth-child(3) {
    /* background: ${({ theme, active }) =>
      active ? theme.colors.blueCityBlue : `transparent`}; */
    color: ${({ theme, active }) =>
      active ? theme.colors.blueCityBlueDark : theme.colors.textTertiary};
    background: ${({ theme, active }) =>
      active ? theme.colors.blueCityBlue : ``};
  }
  &:nth-child(4) {
    /* background: ${({ theme, active }) =>
      active ? theme.colors.seaGreen : `transparent`}; */
    color: ${({ theme, active }) =>
      active ? theme.colors.seaGreenDark : theme.colors.textTertiary};
    background: ${({ theme, active }) => (active ? theme.colors.seaGreen : ``)};
  }
  &:hover {
    ${({ active, theme }) =>
      active ? `` : `color: ${theme.colors.textPrimary}`}
  }
  &:focus {
    outline: none;
  }
  transition: 0.2s ease all;
`;

const AudioFeaturesOptions = styled.div<{ state: AudioFeaturesState }>`
  display: flex;
  flex-wrap: wrap;
  ${breakpoints.lessThan("58")`
    border-top-left-radius: 1em;
    border-top-right-radius: 1em;
    background: ${({ theme }) => theme.colors.darkBodyOverlay};
    overflow: hidden;
    margin-top: 1em;
  `};
  ${breakpoints.lessThan("48")`
    display: none;
  `}
  /* border-top-right-radius: 1em;
  border-top-left-radius: 1em; */
  overflow: hidden;
  /* border: 1px solid ${({ theme }) =>
    theme.colors.darkBodyOverlayBorder};
  border-bottom: none; */
  transition: 0.4s ease all;
  border-bottom: 6px solid
    ${({ state, theme: { colors } }) =>
      state === `valence`
        ? colors.straw
        : state === `energy`
        ? colors.spanishViolet
        : state === `danceability`
        ? colors.blueCityBlue
        : state === `tempo`
        ? colors.seaGreen
        : colors.darkBodyOverlay};
`;

const AudioFeaturesButton = styled.button<{ active: boolean }>`
  flex: 1;
  ${breakpoints.lessThan("48")`
    flex: 0 0 50%;
    border-radius: 1em;
  `}
  ${breakpoints.lessThan("58")`
    font-size: 1.5rem;
  `}
  ${breakpoints.lessThan("38")`
    font-size: 1rem;
  `}
  font-size: 2rem;
  padding: 1em;
  font-family: "roboto slab", "open sans", "sans-serif";
  font-weight: 700;
  text-transform: capitalize;
  &:nth-child(1) {
    /* background: ${({ theme, active }) =>
      active ? theme.colors.straw : `transparent`}; */
    color: ${({ theme, active }) =>
      active ? theme.colors.straw : theme.colors.textTertiary};
  }
  &:nth-child(2) {
    /* background: ${({ theme, active }) =>
      active ? theme.colors.spanishViolet : `transparent`}; */
    color: ${({ theme, active }) =>
      active ? theme.colors.spanishViolet : theme.colors.textTertiary};
  }
  &:nth-child(3) {
    /* background: ${({ theme, active }) =>
      active ? theme.colors.blueCityBlue : `transparent`}; */
    color: ${({ theme, active }) =>
      active ? theme.colors.blueCityBlue : theme.colors.textTertiary};
  }
  &:nth-child(4) {
    /* background: ${({ theme, active }) =>
      active ? theme.colors.seaGreen : `transparent`}; */
    color: ${({ theme, active }) =>
      active ? theme.colors.seaGreen : theme.colors.textTertiary};
  }
  &:hover {
    ${({ active, theme }) =>
      active ? `` : `color: ${theme.colors.textPrimary}`}
  }
  &:focus {
    outline: none;
  }
  transition: 0.4s ease all;
`;

const AudioFeaturesChart = styled.div`
  canvas {
    width: 100% !important;
  }
  padding: 4em;
  ${breakpoints.lessThan("66")`
    padding: 2em;
  `}
  border-bottom-left-radius: 1em;
  border-bottom-right-radius: 1em;
  ${breakpoints.lessThan("48")`
    border-radius: 1em;
    padding: 1em;
  `}
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  background: ${({ theme }) =>
    `linear-gradient(180deg, rgba(29,31,33,1) 0%, ${theme.colors.darkBodyOverlay} 100%)`};
  box-shadow: 1px 2px 3px rgb(0, 0, 0, 0.3);
  border: 1px solid ${({ theme }) => theme.colors.darkBodyOverlayBorder};
  ${breakpoints.greaterThan("48")`
    border-top: none;
  `}
`;

const AudioFeaturesChartInner = styled.div`
  flex: 3;
  padding-left: 2em;
  ${breakpoints.lessThan("66")`
    padding-left: 0;
    flex-basis: 100%;
    height: 14em;
  `}
`;

const AudioFeatureDescription = styled.div`
  flex: 2;
  .featureDescription {
    color: ${({ theme }) => theme.colors.textPrimary};
    font-size: 1.25em;
    ${breakpoints.lessThan("66")`
      font-size: 1rem;
    `}
    ${breakpoints.lessThan("30")`
    font-size: 0.875rem;
  `}
  }
  .featureTechnical {
    margin-top: 1em;
    float: left;
    color: ${({ theme }) => theme.colors.textPrimary};
    background: ${({ theme }) => theme.colors.darkBodyOverlayBorder};
    padding: 1em;
    border-radius: 0.5em;
    display: flex;
    align-items: center;
    .icon {
      font-size: 1.5em;
      display: flex;
      align-items: center;
      color: ${({ theme }) => theme.colors.textPrimary};
      margin-right: 0.5em;
    }
    ${breakpoints.lessThan("74")`
        font-size: 0.875rem;
    `}
    ${breakpoints.lessThan("66")`
        padding: 0.5em;
    `}
  }
  ${breakpoints.lessThan("66")`
    flex-basis: 100%;
    margin-bottom: 2em;
  `}
`;

const AudioFeaturesGroup = styled.div`
  margin-top: 4em;
  ${breakpoints.lessThan("66")`
    margin-top: 2em;
  `}
  display: flex;
  flex-direction: column;
  justify-content: center;
  .clippedHeading {
    h2 {
      margin-bottom: 0;
    }
  }
  ${breakpoints.lessThan("22")`
    && h2 {
      font-size: 2rem;
    }
  `}
`;
