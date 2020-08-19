import React from "react";
import { Bar } from "react-chartjs-2";
import styled from "styled-components";
import { featureGraphOptions, featureGraphLabels } from "./constants";
import { FeatureScores } from "../PersonalData";
import { colors } from "../../theme";
import { round5x } from "../../utils";

export type FeatureProps = {
  shortTerm: number;
  mediumTerm: number;
  longTerm: number;
};

type AudioFeatureProps = {
  scores: FeatureScores;
};

const AudioFeatures = ({ scores }: AudioFeatureProps) => {
  console.log(scores);

  const data = {
    danceability: {
      labels: featureGraphLabels,
      datasets: [
        {
          backgroundColor: colors.blueCityBlue,
          barPercentage: 0.5,
          hoverBackgroundColor: colors.white,
          data: [
            Math.floor(scores!.longTerm.danceability),
            Math.floor(scores!.mediumTerm.danceability),
            Math.floor(scores!.shortTerm.danceability),
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
            Math.floor(scores!.longTerm.energy),
            Math.floor(scores!.mediumTerm.energy),
            Math.floor(scores!.shortTerm.energy),
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
            Math.floor(scores!.longTerm.valence),
            Math.floor(scores!.mediumTerm.valence),
            Math.floor(scores!.shortTerm.valence),
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
            Math.floor(scores!.longTerm.tempo) / 100,
            Math.floor(scores!.mediumTerm.tempo) / 100,
            Math.floor(scores!.shortTerm.tempo) / 100,
          ],
        },
      ],
    },
  };

  return (
    <FeaturesDisplay>
      <ValenceDisplay>
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
        <FeatureContainer>
          <div className="featureInfo">
            <div className="featureTitle">
              <h2>Happiness</h2>
            </div>

            <div className="featureDescription">
              describes the musical positiveness conveyed by a track. Tracks
              with high valence sound more positive (e.g. happy, cheerful,
              euphoric), while tracks with low valence sound more negative (e.g.
              sad, depressed, angry).
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

        <FeatureContainer>
          <div className="featureInfo">
            <div className="featureTitle">
              <h2>Energy</h2>
            </div>

            <div className="featureDescription">
              represents a perceptual measure of intensity and activity.
              Typically, energetic tracks feel fast, loud, and noisy. For
              example, death metal has high energy, while a Bach prelude scores
              low on the scale. Perceptual features contributing to this
              attribute include dynamic range, perceived loudness, timbre, onset
              rate, and general entropy.
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
        <FeatureContainer>
          <div className="featureInfo">
            <div className="featureTitle">
              <h2>Danceability</h2>
            </div>

            <div className="featureDescription">
              describes how suitable a track is for dancing based on a
              combination of musical elements including tempo, rhythm stability,
              beat strength, and overall regularity.
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
                          Math.min(...data.danceability.datasets[0].data) - 20
                        ),
                        max: round5x(
                          Math.max(...data.danceability.datasets[0].data) + 5
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
        <FeatureContainer>
          <div className="featureInfo">
            <div className="featureTitle">
              <h2>Tempo</h2>
            </div>

            <div className="featureDescription">
              is the overall estimated tempo of a track in beats per minute
              (BPM). In musical terminology, tempo is the speed or pace of a
              given piece and derives directly from the average beat duration.
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
  align-items: center;
  position: relative;
`;

const FeaturesDisplay = styled.div`
  > div {
    padding: 4em 0;
    position: relative;
  }
  h2 {
    line-height: 1.5;
    display: inline-block;
  }
  .featureInfo {
    flex: 2;
    padding: 0 2em 0 0;
    order: 1;
  }
  .featureTitle {
    margin-bottom: 1em;
  }
  .featureDescription {
    color: ${({ theme }) => theme.colors.textPrimary};
    font-size: 1.25em;
  }
  .featureGraph {
    flex: 3;
    order: 2;
  }
  canvas {
    width: 100% !important;
  }
`;

const DanceabilityDisplay = styled.div`
  grid-area: danceability;
  min-height: 400px;
  h2 {
    border-bottom: 0.125em solid ${({ theme }) => theme.colors.blueCityBlue};
  }
`;

const EnergyDisplay = styled.div`
  min-height: 400px;
  .featureInfo {
    order: 2;
    padding: 0 0 0 2em;
  }
  .featureGraph {
    order: 1;
  }
  h2 {
    border-bottom: 0.125em solid ${({ theme }) => theme.colors.spanishViolet};
  }
`;

const ValenceDisplay = styled.div`
  min-height: 400px;
  h2 {
    border-bottom: 0.125em solid ${({ theme }) => theme.colors.straw};
  }
`;

const TempoDisplay = styled.div`
  min-height: 400px;
  .featureInfo {
    order: 2;
    padding: 0 0 0 2em;
  }
  .featureGraph {
    order: 1;
  }
  h2 {
    border-bottom: 0.125em solid ${({ theme }) => theme.colors.seaGreen};
  }
`;

export default AudioFeatures;
