import React from "react";
import { Bar } from "react-chartjs-2";
import styled from "styled-components";
import {
  featureGraphOptions,
  featureGraphLabels,
  audioFeatureDescriptions,
} from "./constants";
import { colors, breakpoints } from "../../theme";
import { IoMdInformationCircle } from "react-icons/io";
import round5x from "../../utils/round5x";
import { AudioFeatureProps } from "./models";
import ErrorComp from "../shared/ErrorComp";

const AudioFeatures = ({ scores }: AudioFeatureProps) => {
  const data = scores
    ? {
        danceability: {
          labels: featureGraphLabels,
          datasets: [
            {
              backgroundColor: colors.blueCityBlue,
              barPercentage: 0.5,
              hoverBackgroundColor: colors.white,
              data: [
                Math.round(scores.danceability.shortTerm || 0),
                Math.round(scores.danceability.mediumTerm || 0),
                Math.round(scores.danceability.longTerm || 0),
              ],
            },
          ],
        },
        energy: {
          labels: featureGraphLabels,
          datasets: [
            {
              backgroundColor: colors.spanishViolet,
              barPercentage: 0.5,
              hoverBackgroundColor: colors.white,
              data: [
                Math.round(scores.energy.longTerm || 0),
                Math.round(scores.energy.mediumTerm || 0),
                Math.round(scores.energy.shortTerm || 0),
              ],
            },
          ],
        },
        valence: {
          labels: featureGraphLabels,
          datasets: [
            {
              backgroundColor: colors.straw,
              barPercentage: 0.5,
              hoverBackgroundColor: colors.white,
              data: [
                Math.round(scores.valence.longTerm || 0),
                Math.round(scores.valence.mediumTerm || 0),
                Math.round(scores.valence.shortTerm || 0),
              ],
            },
          ],
        },
        tempo: {
          labels: featureGraphLabels,
          datasets: [
            {
              backgroundColor: colors.seaGreen,
              barPercentage: 0.5,
              hoverBackgroundColor: colors.white,
              data: [
                Math.round(scores.tempo.longTerm || 0),
                Math.round(scores.tempo.mediumTerm || 0),
                Math.round(scores.tempo.shortTerm || 0),
              ],
            },
          ],
        },
      }
    : null;

  const backgroundGifs = false;

  return data ? (
    <FeaturesDisplay>
      <FeaturesHeaderWrap>
        <FeaturesHeader>
          <h2>Your Moods</h2>
          <p>Changes in your listening habits and preferences over time</p>
          <PeriodLabels>
            <div>
              <strong>All-Time:</strong> your full music history
            </div>
            <div>
              <strong>Recent:</strong> over the last 4 to 6 months
            </div>
            <div>
              <strong>Now:</strong> over the last month
            </div>
          </PeriodLabels>
        </FeaturesHeader>
      </FeaturesHeaderWrap>
      <ValenceDisplay>
        {backgroundGifs && (
          <FeatureBackground>
            <div
              style={{
                width: "100%",
                height: 0,
                paddingBottom: "56%",
                position: "relative",
              }}
            >
              <iframe
                title="valencebackground"
                src="https://giphy.com/embed/S5WhyGI8gRdKSjobRo"
                style={{
                  width: "100%",
                  height: "100%",
                  position: "absolute",
                  border: 0,
                }}
                className="giphy-embed"
                allowFullScreen
              ></iframe>
            </div>
          </FeatureBackground>
        )}
        <FeatureContainer>
          <div className="featureInfo">
            <div className="featureTitle">
              <h2>Happiness</h2>
            </div>

            <div className="featureDescription">
              {audioFeatureDescriptions.valence.desc}
            </div>

            <div className="featureTechnical">
              <div className="icon">
                <IoMdInformationCircle />
              </div>{" "}
              <p> {audioFeatureDescriptions.valence.measurement}</p>
            </div>
          </div>
          <div className="featureGraph">
            <Bar
              data={data.valence}
              options={{
                scales: {
                  xAxes: featureGraphOptions.scales.xAxes,
                  yAxes: [
                    {
                      ticks: {
                        min: round5x(
                          Math.min(...data.valence.datasets[0].data) - 20
                        ),
                        max: round5x(
                          Math.max(...data.valence.datasets[0].data) + 5
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
                  display: false,
                },
              }}
            />
          </div>
        </FeatureContainer>
      </ValenceDisplay>
      <EnergyDisplay>
        {backgroundGifs && (
          <FeatureBackground>
            <div
              style={{
                width: "100%",
                height: 0,
                paddingBottom: "54%",
                position: "relative",
              }}
            >
              <iframe
                src="https://giphy.com/embed/LpoosGQsF6iM9AHThG"
                title="energybackground"
                style={{
                  width: "100%",
                  height: "100%",
                  position: "absolute",
                  border: 0,
                }}
                className="giphy-embed"
                allowFullScreen
              ></iframe>
            </div>
          </FeatureBackground>
        )}

        <FeatureContainer>
          <div className="featureInfo">
            <div className="featureTitle">
              <h2>Energy</h2>
            </div>

            <div className="featureDescription">
              {audioFeatureDescriptions.energy.desc}
            </div>
            <div className="featureTechnical">
              <div className="icon">
                <IoMdInformationCircle />
              </div>{" "}
              <p> {audioFeatureDescriptions.energy.measurement}</p>
            </div>
          </div>

          <div className="featureGraph">
            <Bar
              data={data.energy}
              options={{
                scales: {
                  xAxes: featureGraphOptions.scales.xAxes,
                  yAxes: [
                    {
                      ticks: {
                        min: round5x(
                          Math.min(...data.energy.datasets[0].data) - 20
                        ),
                        max: round5x(
                          Math.max(...data.energy.datasets[0].data) + 5
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
                  display: false,
                },
              }}
            />
          </div>
        </FeatureContainer>
      </EnergyDisplay>
      <DanceabilityDisplay>
        {backgroundGifs && (
          <FeatureBackground>
            <div
              style={{
                width: "100%",
                height: 0,
                paddingBottom: "55.7%",
                position: "relative",
              }}
            >
              <iframe
                title="danceabilitybackground"
                src="https://giphy.com/embed/l4FsoQbfD0J53F8Xe"
                style={{
                  width: "100%",
                  height: "100%",
                  position: "absolute",
                  border: 0,
                }}
                className="giphy-embed"
                allowFullScreen
              ></iframe>
            </div>
          </FeatureBackground>
        )}
        <FeatureContainer>
          <div className="featureInfo">
            <div className="featureTitle">
              <h2>Danceability</h2>
            </div>

            <div className="featureDescription">
              {audioFeatureDescriptions.danceability.desc}
            </div>
            <div className="featureTechnical">
              <div className="icon">
                <IoMdInformationCircle />
              </div>{" "}
              <p> {audioFeatureDescriptions.danceability.measurement}</p>
            </div>
          </div>

          <div className="featureGraph">
            <Bar
              data={data.danceability}
              options={{
                scales: {
                  xAxes: featureGraphOptions.scales.xAxes,
                  yAxes: [
                    {
                      ticks: {
                        min: round5x(
                          Math.min(...data.danceability.datasets[0]!.data) - 20
                        ),
                        max: round5x(
                          Math.max(...data.danceability.datasets[0]!.data) + 5
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
                  display: false,
                },
              }}
            />
          </div>
        </FeatureContainer>
      </DanceabilityDisplay>
      <TempoDisplay>
        {backgroundGifs && (
          <FeatureBackground>
            <div
              style={{
                width: "100%",
                height: 0,
                paddingBottom: "45%",
                position: "relative",
              }}
            >
              <iframe
                title="tempobackground"
                src="https://giphy.com/embed/cOEwxyi9cWNst5l81a"
                style={{
                  width: "100%",
                  height: "100%",
                  position: "absolute",
                  border: 0,
                }}
                className="giphy-embed"
                allowFullScreen
              ></iframe>
            </div>
          </FeatureBackground>
        )}
        <FeatureContainer>
          <div className="featureInfo">
            <div className="featureTitle">
              <h2>Tempo</h2>
            </div>

            <div className="featureDescription">
              {audioFeatureDescriptions.tempo.desc}
            </div>
            <div className="featureTechnical">
              <div className="icon">
                <IoMdInformationCircle />
              </div>{" "}
              <p> {audioFeatureDescriptions.tempo.measurement}</p>
            </div>
          </div>

          <div className="featureGraph">
            <Bar
              data={data.tempo}
              options={{
                scales: {
                  xAxes: featureGraphOptions.scales.xAxes,
                  yAxes: [
                    {
                      ticks: {
                        min: round5x(
                          Math.min(...data.tempo.datasets[0].data) - 20
                        ),
                        max: round5x(
                          Math.max(...data.tempo.datasets[0].data) + 5
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
                  display: false,
                },
              }}
            />
          </div>
        </FeatureContainer>
      </TempoDisplay>
    </FeaturesDisplay>
  ) : (
    <ErrorComp>
      <span>There was an error loading your moods data.</span>
    </ErrorComp>
  );
};

const FeatureBackground = styled.div`
  position: absolute;
  top: 0;
  z-index: -1;
  width: 100%;
  height: 100%;
  opacity: 0.2;
  overflow: hidden;
`;

const FeatureContainer = styled.div`
  width: 88%;
  margin: 0 auto;
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  position: relative;
  flex-wrap: wrap;
`;

const FeaturesDisplay = styled.div`
  margin: 4em 0;
  ${breakpoints.lessThan("66")`
    margin: 2em 0;
  `}
  > div {
    padding: 4em 0;
    position: relative;
  }
  ${breakpoints.lessThan("58")`
    > div {
      padding: 1em 0;
    }
  `};
  h2 {
    line-height: 1.5;
    display: inline-block;
  }
  .featureInfo {
    flex: 2;
    /* padding: 0 2em 0 0; */
    order: 1;
  }
  .featureTitle {
    margin-bottom: 1em;
  }
  .featureDescription {
    color: ${({ theme }) => theme.colors.textPrimary};
    font-size: 1.25rem;
    ${breakpoints.lessThan("74")`
      font-size: 1rem;
    `}
  }
  .featureGraph {
    flex: 3;
    order: 2;
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
  }
  canvas {
    width: 100% !important;
  }
  ${breakpoints.lessThan("58")`
    .featureInfo, .featureGraph {
      flex-basis: 100%;
    }
    .featureInfo {
      margin-bottom: 2em;
      text-align: center;
    }
    .featureTechnical {
      margin: 1em auto;
      float: none;
      display: inline-flex;
      margin-top: 1em;
    }
    .featureGraph {
      max-width: 40em;
    }
  `}
`;

const FeaturesHeaderWrap = styled.div`
  && {
    padding: 0;
    margin-bottom: 1em;
  }
`;

const FeaturesHeader = styled.div`
  width: 94%;
  margin: 0 auto;
  h2 {
    display: block;
    text-align: center;
    line-height: 1;
    margin-bottom: 0.25em;
  }
  p {
    display: block;
    text-align: center;
    color: ${({ theme }) => theme.colors.textPrimary};
    font-size: 1.25em;
    ${breakpoints.lessThan("74")`
      font-size: 1rem;
    `}
  }
`;

const PeriodLabels = styled.div`
  margin: 2em 0 0 0;
  display: flex;
  justify-content: center;
  color: ${({ theme }) => theme.colors.textTertiary};
  strong {
    color: ${({ theme }) => theme.colors.textPrimary};
  }
  flex-wrap: wrap;
  > div {
    margin: 0em 1em 1em 0;
    padding: 1em 2em;
    text-align: center;
    box-shadow: 1px 2px 3px rgb(0, 0, 0, 0.3);
    background: ${({ theme }) => theme.colors.darkBodyOverlay};
    border-radius: 0.5em;
    border: 1px solid ${({ theme }) => theme.colors.darkBodyOverlayBorder};
    &:last-child {
      margin-right: 0;
    }
    ${breakpoints.lessThan("66")`
      flex-basis: 100%;
      background: none;
      border: none;
      padding: 0.5em 0;
      margin: 0;
      box-shadow: none;
      margin-right: 0;
      &:last-child {
        margin-bottom: 0;
      }
    `}
  }
  ${breakpoints.lessThan("66")`
    box-shadow: 1px 2px 3px rgb(0, 0, 0, 0.3);
    background: ${({ theme }) => theme.colors.darkBodyOverlay};
    border-radius: 0.5em;
    border: 1px solid ${({ theme }) => theme.colors.darkBodyOverlayBorder};
    margin: 2em auto;
    max-width: 80%;
    font-size: 0.875rem;
  `}
`;

const DanceabilityDisplay = styled.div`
  background: ${({ theme }) => theme.colors.blueCityBlue10p};
  min-height: 400px;
  h2 {
    border-bottom: 0.125em solid ${({ theme }) => theme.colors.blueCityBlue};
  }
`;

const EnergyDisplay = styled.div`
  background: ${({ theme }) => theme.colors.spanishViolet10p};
  min-height: 400px;
  ${breakpoints.greaterThan("58")`
    .featureInfo {
      order: 2;
      padding: 0 0 0 2em;
    }
    .featureGraph {
      order: 1;
    }
  `}

  h2 {
    border-bottom: 0.125em solid ${({ theme }) => theme.colors.spanishViolet};
  }
`;

const ValenceDisplay = styled.div`
  background: ${({ theme }) => theme.colors.straw10p};
  min-height: 400px;
  h2 {
    border-bottom: 0.125em solid ${({ theme }) => theme.colors.straw};
  }
`;

const TempoDisplay = styled.div`
  background: ${({ theme }) => theme.colors.seaGreen10p};
  min-height: 400px;
  ${breakpoints.greaterThan("58")`
    .featureInfo {
      order: 2;
      padding: 0 0 0 2em;
    }
    .featureGraph {
      order: 1;
    }
  `}
  h2 {
    border-bottom: 0.125em solid ${({ theme }) => theme.colors.seaGreen};
  }
`;

export default AudioFeatures;
