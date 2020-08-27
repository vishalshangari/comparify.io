import React, { useEffect, useState } from "react";
import ComponentWithLoadingState from "../../shared/ComponentWithLoadingState";
import axios from "axios";
import { DEV_URL } from "../../../constants";
import styled, { keyframes, css } from "styled-components";
import { BsX } from "react-icons/bs";
import { Genre } from "../../PersonalData";
import { LoadedArtist, ArtistItem } from "../../TopArtists";
import { TrackItem, TrackItemWrapper } from "../../TopTracks";
import fetchMultipleArtists from "../../../utils/fetchMultipleArtists";
import fetchMultipleTracks from "../../../utils/fetchMultipleTracks";
import { GoLinkExternal } from "react-icons/go";
import { LoadedTrack } from "../../TopTracks";
import { colors, breakpoints } from "../../../theme";
import {
  featureGraphLabels,
  audioFeatureDescriptions,
} from "../../AudioFeatures/constants";
import round5x from "../../../utils/round5x";
import { Bar } from "react-chartjs-2";
import { IoMdInformationCircle } from "react-icons/io";

type ComparifyProps = {
  pageID: string;
};

type UserInfo = {
  _id: string;
  country: string;
  createdAt: number;
  displayName: string;
  profileImageUrl: string;
};
type ComparisonDataForPeriod<DataItem> = {
  shared: null | DataItem[];
  creatorUnique: null | DataItem[];
  visitorUnique: null | DataItem[];
};

type ComparisonData<DataItem> = {
  now?: ComparisonDataForPeriod<DataItem>;
  recent?: ComparisonDataForPeriod<DataItem>;
  allTime?: ComparisonDataForPeriod<DataItem>;
};

type AudioFeatureDataForComparison = {
  visitor: number[];
  creator: number[];
};

type AudioFeaturesComparison = {
  valence: AudioFeatureDataForComparison;
  energy: AudioFeatureDataForComparison;
  danceability: AudioFeatureDataForComparison;
  tempo: AudioFeatureDataForComparison;
};

type AudioFeaturesState = keyof AudioFeaturesComparison;

const Comparify = ({ pageID }: ComparifyProps) => {
  const [isLoading, setIsLoading] = useState(true);
  const [creatorUserInfo, setCreatorUserInfo] = useState<null | UserInfo>(null);
  const [visitorUserInfo, setVisitorUserInfo] = useState<null | UserInfo>(null);
  const [
    genresComparisonData,
    setGenresComparisonData,
  ] = useState<null | ComparisonData<string>>(null);
  const [
    artistsComparisonData,
    setArtistsComparisonData,
  ] = useState<null | ComparisonData<LoadedArtist>>(null);
  const [
    tracksComparisonData,
    setTracksComparisonData,
  ] = useState<null | ComparisonData<LoadedTrack>>(null);
  const [
    audioFeaturesComparisonData,
    setAudioFeaturesComparisonData,
  ] = useState<null | AudioFeaturesComparison>(null);
  const audioFeatures: AudioFeaturesState[] = [
    "valence",
    "energy",
    "danceability",
    "tempo",
  ];
  const [audioFeaturesState, setAudioFeaturesState] = useState<
    AudioFeaturesState
  >("valence");

  useEffect(() => {
    const getComparisonData = async () => {
      try {
        const {
          data: {
            visitor,
            creator,
            genresComparison,
            artistsComparison,
            tracksComparison,
            audioFeaturesComparison,
          },
        } = await axios.get(`${DEV_URL}/api/comparify/${pageID}`, {
          withCredentials: true,
        });

        // Get artist comparison data
        const sharedAllTimeArtists = fetchMultipleArtists(
          artistsComparison.allTime.shared
        );
        const creatorUniqueAllTimeArtists = fetchMultipleArtists(
          artistsComparison.allTime.creatorUnique
        );
        const visitorUniqueAllTimeArtists = fetchMultipleArtists(
          artistsComparison.allTime.visitorUnique
        );

        // Get tracks comparison data
        const sharedNowTracks = fetchMultipleTracks(
          tracksComparison.now.shared
        );
        const creatorUniqueNowTracks = fetchMultipleTracks(
          tracksComparison.now.creatorUnique
        );
        const visitorUniqueNowTracks = fetchMultipleTracks(
          tracksComparison.now.visitorUnique
        );

        const comparisonDisplayData = await Promise.all([
          sharedAllTimeArtists, // result[0]
          creatorUniqueAllTimeArtists,
          visitorUniqueAllTimeArtists,
          sharedNowTracks,
          creatorUniqueNowTracks,
          visitorUniqueNowTracks,
        ]);

        setArtistsComparisonData({
          allTime: {
            shared: comparisonDisplayData[0],
            creatorUnique: comparisonDisplayData[1],
            visitorUnique: comparisonDisplayData[2],
          },
        });

        setTracksComparisonData({
          now: {
            shared: comparisonDisplayData[3],
            creatorUnique: comparisonDisplayData[4],
            visitorUnique: comparisonDisplayData[5],
          },
        });

        setCreatorUserInfo(creator.info);
        setVisitorUserInfo(visitor.info);
        setGenresComparisonData(genresComparison);
        setAudioFeaturesComparisonData(audioFeaturesComparison);
        setAudioFeaturesState("valence");
        setIsLoading(false);
      } catch (error) {
        console.error(error);
      }
    };
    getComparisonData();
  }, [pageID]);

  const handleAudioFeatureClick = (feature: AudioFeaturesState) => {
    setAudioFeaturesState(feature);
  };

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
    <ComponentWithLoadingState label={false} loading={isLoading}>
      <ComparifyDisplayWrap>
        <UserProfilesGroup>
          {/* Group 1: Names */}

          <ProfileSnippet>
            {visitorUserInfo ? (
              <>
                <div className="profileImage">
                  <img src={visitorUserInfo.profileImageUrl} />
                </div>
                <div className="userName">{visitorUserInfo.displayName}</div>
              </>
            ) : (
              <div className="profileError">
                Oops, there was an error loading this user's profile.
              </div>
            )}
          </ProfileSnippet>

          <NameSeparator>
            <BsX />
          </NameSeparator>

          <ProfileSnippet>
            {creatorUserInfo ? (
              <>
                <div className="profileImage">
                  <img src={creatorUserInfo.profileImageUrl} />
                </div>
                <div className="userName">{creatorUserInfo.displayName}</div>
              </>
            ) : (
              <div className="profileError">
                Oops, there was an error loading this user's profile.
              </div>
            )}
          </ProfileSnippet>
        </UserProfilesGroup>

        <GenresGroup>
          <h2>Top Genres</h2>
          {genresComparisonData && genresComparisonData.allTime ? (
            <GenresGrid>
              <UserGenres>
                <div className="sectionHeader">
                  <span>
                    {visitorUserInfo?.displayName.split(" ")[0]}'s others
                  </span>
                </div>
                <div className="genresDisplayContainer">
                  {genresComparisonData.allTime.visitorUnique ? (
                    genresComparisonData.allTime.visitorUnique
                      .slice(0, 5)
                      .map((genre, idx) => (
                        <div key={idx} className="genreItem">
                          {genre}
                        </div>
                      ))
                  ) : (
                    <span className="error">
                      Nothing to show{" "}
                      <span role="img" aria-label="emoji">
                        🤔
                      </span>
                    </span>
                  )}
                </div>
              </UserGenres>
              <SharedGenres>
                <div className="sectionHeader">
                  <span>
                    <span role="img" aria-label="emoji">
                      ⚡️
                    </span>{" "}
                    In common{" "}
                    <span role="img" aria-label="emoji">
                      ⚡️
                    </span>
                  </span>
                </div>
                <div className="genresDisplayContainer">
                  {genresComparisonData.allTime.shared ? (
                    genresComparisonData.allTime.shared
                      .slice(0, 10)
                      .map((genre, idx) => (
                        <div key={idx} className="genreItem">
                          {genre}
                        </div>
                      ))
                  ) : (
                    <span className="error">
                      No genres in common{" "}
                      <span role="img" aria-label="emoji">
                        😅
                      </span>
                    </span>
                  )}
                </div>
              </SharedGenres>
              <UserGenres>
                <div className="sectionHeader">
                  <span>
                    {creatorUserInfo?.displayName.split(" ")[0]}'s others
                  </span>
                </div>
                <div className="genresDisplayContainer">
                  {genresComparisonData.allTime.creatorUnique ? (
                    genresComparisonData.allTime.creatorUnique
                      .slice(0, 5)
                      .map((genre, idx) => (
                        <div key={idx} className="genreItem">
                          {genre}
                        </div>
                      ))
                  ) : (
                    <span className="error">
                      Nothing to show{" "}
                      <span role="img" aria-label="emoji">
                        🤔
                      </span>
                    </span>
                  )}
                </div>
              </UserGenres>
            </GenresGrid>
          ) : (
            <div className="error">
              Oops, there was an error loading this data.
            </div>
          )}
        </GenresGroup>
        <Separator />

        <ArtistsGroup>
          <h2>Top Artists</h2>
          {artistsComparisonData && artistsComparisonData.allTime ? (
            <ArtistsGrid>
              <UserArtists>
                <div className="sectionHeader">
                  <span>
                    {visitorUserInfo?.displayName.split(" ")[0]}'s others
                  </span>
                </div>
                <div
                  className={
                    artistsComparisonData.allTime.visitorUnique &&
                    artistsComparisonData.allTime.visitorUnique.length < 4
                      ? `artistsDisplayContainer`
                      : `artistsDisplayGridContainer`
                  }
                >
                  {artistsComparisonData.allTime.visitorUnique ? (
                    artistsComparisonData.allTime.visitorUnique
                      .slice(0, 6)
                      .map((artist, idx) => (
                        <ArtistItem href={artist.href} title={artist.name}>
                          <div className="image">
                            <img
                              src={artist.images![0].url}
                              alt={artist.name}
                            />
                          </div>
                          <div className="infoOverlay"></div>
                          <div className="linkOverlay">
                            <GoLinkExternal />
                          </div>
                          <div className="info">
                            <div className="name">{artist.name}</div>
                          </div>
                        </ArtistItem>
                      ))
                  ) : (
                    <span className="error">
                      Nothing to see here{" "}
                      <span role="img" aria-label="emoji">
                        👀
                      </span>
                    </span>
                  )}
                </div>
              </UserArtists>
              <SharedArtists>
                <div className="sectionHeader">
                  <span>
                    <span role="img" aria-label="emoji">
                      ⚡️
                    </span>{" "}
                    In common{" "}
                    <span role="img" aria-label="emoji">
                      ⚡️
                    </span>
                  </span>
                </div>
                <div
                  className={
                    artistsComparisonData.allTime.shared &&
                    artistsComparisonData.allTime.shared.length < 4
                      ? `artistsDisplayContainer`
                      : `artistsDisplayGridContainer`
                  }
                >
                  {artistsComparisonData.allTime.shared ? (
                    artistsComparisonData.allTime.shared
                      .slice(0, 12)
                      .map((artist, idx) => (
                        <ArtistItem href={artist.href} title={artist.name}>
                          <div className="image">
                            <img
                              src={artist.images![0].url}
                              alt={artist.name}
                            />
                          </div>
                          <div className="infoOverlay"></div>
                          <div className="linkOverlay">
                            <GoLinkExternal />
                          </div>
                          <div className="info">
                            <div className="name">{artist.name}</div>
                          </div>
                        </ArtistItem>
                      ))
                  ) : (
                    <span className="error">
                      No artists in common{" "}
                      <span role="img" aria-label="emoji">
                        😕
                      </span>
                    </span>
                  )}
                </div>
              </SharedArtists>
              <UserArtists>
                <div className="sectionHeader">
                  <span>
                    {creatorUserInfo?.displayName.split(" ")[0]}'s others
                  </span>
                </div>
                <div
                  className={
                    artistsComparisonData.allTime.creatorUnique &&
                    artistsComparisonData.allTime.creatorUnique.length < 4
                      ? `artistsDisplayContainer`
                      : `artistsDisplayGridContainer`
                  }
                >
                  {artistsComparisonData.allTime.creatorUnique ? (
                    artistsComparisonData.allTime.creatorUnique
                      .slice(0, 6)
                      .map((artist, idx) => (
                        <ArtistItem href={artist.href} title={artist.name}>
                          <div className="image">
                            <img
                              src={artist.images![0].url}
                              alt={artist.name}
                            />
                          </div>
                          <div className="infoOverlay"></div>
                          <div className="linkOverlay">
                            <GoLinkExternal />
                          </div>
                          <div className="info">
                            <div className="name">{artist.name}</div>
                          </div>
                        </ArtistItem>
                      ))
                  ) : (
                    <span className="error">
                      Nothing to see here{" "}
                      <span role="img" aria-label="emoji">
                        👀
                      </span>
                    </span>
                  )}
                </div>
              </UserArtists>
            </ArtistsGrid>
          ) : (
            <div className="dataLoadError">
              Oops, there was an error loading analysis of artists.
            </div>
          )}
        </ArtistsGroup>
        <Separator />

        <TracksGroup>
          {tracksComparisonData && tracksComparisonData.now ? (
            <TracksGrid>
              <CommonTracks>
                <h2>Now Playing</h2>

                {tracksComparisonData.now.shared ? (
                  <>
                    <div className="sectionHeader">
                      <span>
                        Tracks you both{" "}
                        <span role="img" aria-label="emoji">
                          💜
                        </span>{" "}
                        recently
                      </span>
                    </div>
                    <CommonTracksGridWrap>
                      <CommonTracksGrid
                        length={tracksComparisonData.now.shared.length}
                      >
                        {tracksComparisonData.now.shared
                          .slice(0, 10)
                          .map((item, idx) => (
                            <TrackItemWrapper key={idx} {...item} />
                          ))}
                      </CommonTracksGrid>
                    </CommonTracksGridWrap>
                  </>
                ) : (
                  <div className="noCommonTracks">
                    Doesn't look like you are loving any of the same tracks
                    recently.
                  </div>
                )}
              </CommonTracks>
              <VisitorTracks>
                {tracksComparisonData.now.visitorUnique ? (
                  <>
                    <div className="sectionHeader">
                      <span>Your top tracks</span>
                    </div>
                    <UserTracksGrid>
                      {tracksComparisonData.now.visitorUnique
                        .slice(0, 10)
                        .map((item, idx) => (
                          <TrackItemWrapper key={idx} {...item} />
                        ))}
                    </UserTracksGrid>
                  </>
                ) : (
                  <div className="noUserTracks">
                    Couldn't find anything here...{" "}
                    <span role="img" aria-label="emoji">
                      😯
                    </span>
                  </div>
                )}
              </VisitorTracks>
              <CreatorTracks>
                {tracksComparisonData.now.creatorUnique ? (
                  <>
                    <div className="sectionHeader">
                      <span>
                        {creatorUserInfo?.displayName.split(" ")[0]}'s top
                        tracks
                      </span>
                    </div>
                    <UserTracksGrid>
                      {tracksComparisonData.now.creatorUnique
                        .slice(0, 10)
                        .map((item, idx) => (
                          <TrackItemWrapper key={idx} {...item} />
                        ))}
                    </UserTracksGrid>
                  </>
                ) : (
                  <div className="noUserTracks">
                    Couldn't find anything here...{" "}
                    <span role="img" aria-label="emoji">
                      😯
                    </span>
                  </div>
                )}
              </CreatorTracks>
            </TracksGrid>
          ) : (
            <div className="dataLoadError">
              Oops, there was an error loading analysis of tracks.
            </div>
          )}
        </TracksGroup>
        <Separator />

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
                    scales: {
                      xAxes: [
                        {
                          ticks: {
                            fontColor: colors.grey1,
                            fontSize: 16,
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
                                ...audioFeaturesComparisonData[
                                  audioFeaturesState
                                ].creator,
                                ...audioFeaturesComparisonData[
                                  audioFeaturesState
                                ].visitor
                              ) - 20
                            ),
                            max: round5x(
                              Math.max(
                                ...audioFeaturesComparisonData[
                                  audioFeaturesState
                                ].creator,
                                ...audioFeaturesComparisonData[
                                  audioFeaturesState
                                ].visitor
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
                        fontSize: 16,
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
      </ComparifyDisplayWrap>
    </ComponentWithLoadingState>
  );
};

// General

const gradientAnimation = keyframes`
  0% {
		background-position: 0% 50%;
	}
	50% {
		background-position: 100% 50%;
	}
	100% {
		background-position: 0% 50%;
	}
`;

const commonItemsDisplayBackgroundAnimated = css`
  background: ${({ theme: { colors } }) =>
    `linear-gradient(-45deg, #DBAB00, ${colors.orangeRed}, ${colors.mainAccent}, ${colors.mainAccent10p})`};
  background-size: 400% 400%;
  animation: ${gradientAnimation} 10s ease infinite;
`;

// Audio Features

const AudioFeaturesOptions = styled.div<{ state: AudioFeaturesState }>`
  display: flex;
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
  padding: 4em;
  border-bottom-left-radius: 1em;
  border-bottom-right-radius: 1em;
  display: flex;
  align-items: center;
  background: ${({ theme }) =>
    `linear-gradient(180deg, rgba(29,31,33,1) 0%, ${theme.colors.darkBodyOverlay} 100%)`};
  box-shadow: 1px 2px 3px rgb(0, 0, 0, 0.3);
  border: 1px solid ${({ theme }) => theme.colors.darkBodyOverlayBorder};
  border-top: none;
`;

const AudioFeaturesChartInner = styled.div`
  flex: 3;
  padding-left: 2em;
`;

const AudioFeatureDescription = styled.div`
  flex: 2;
  .featureDescription {
    color: ${({ theme }) => theme.colors.textPrimary};
    font-size: 1.25em;
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
`;

const AudioFeaturesGroup = styled.div`
  margin-top: 4em;
  display: flex;
  flex-direction: column;
  justify-content: center;
  .clippedHeading {
    display: inline-block;
    margin: 0 auto;
    ${commonItemsDisplayBackgroundAnimated};
    -webkit-text-fill-color: transparent;
    -webkit-background-clip: text;
    background-clip: text;
    h2 {
      margin-bottom: 0;
      display: inline-block;
    }
  }
`;

// Tracks

const TracksGroup = styled.div`
  margin-top: 4em;
  && .sectionHeader {
    color: ${({ theme }) => theme.colors.textPrimary};
    font-weight: 700;
  }
`;

const VisitorTracks = styled.div`
  grid-area: visitor;
  padding: 1em;
  ${TrackItem} {
    box-shadow: 2px 2px ${({ theme }) => theme.colors.iris};
  }
`;

const CreatorTracks = styled.div`
  grid-area: creator;
  padding: 1em;
  ${TrackItem} {
    box-shadow: 2px 2px ${({ theme }) => theme.colors.neonGreen};
  }
`;

const TracksGrid = styled.div`
  display: grid;
  grid-gap: 2em;
  grid-template-columns: repeat(4, 1fr);
  grid-template-areas:
    ". common common ."
    "visitor visitor creator creator";
`;

const UserTracksGrid = styled.div`
  display: grid;
  grid-gap: 1em;
  grid-template-columns: 1fr 1fr;
`;

const commonTracksGridDisplayStyles = css`
  display: grid;
  grid-gap: 1em;
  grid-template-columns: 1fr 1fr;
`;

const commonTracksNonGridDisplayStyles = css`
  display: flex;
  margin: 0 auto;
  justify-content: center;
  align-items: center;
  > a {
    display: inline-flex;
    flex-basis: 50%;
  }
`;

const CommonTracksGridWrap = styled.div`
  display: block;
  ${commonItemsDisplayBackgroundAnimated};
  border-radius: 1em;
  overflow: hidden;
  ${TrackItem} {
    border: none;
  }
`;

const CommonTracksGrid = styled.div<{ length: number }>`
  padding: 1em;
  ${({ length }) =>
    length > 1
      ? commonTracksGridDisplayStyles
      : commonTracksNonGridDisplayStyles}
`;

const CommonTracks = styled.div`
  grid-area: common;
  && .sectionHeader {
    margin-bottom: 0.625em;
  }
`;

// Artists

const ArtistsGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 40% 1fr;
  grid-gap: 2em;
  ${ArtistItem} {
    /* box-shadow: none; */
    border: none;
    &:hover {
      border: none;
    }
  }
  > div {
    display: flex;
    flex-direction: column;
    justify-content: center;
  }
`;

const ArtistsGroup = styled.div`
  margin-top: 4em;
  .artistsDisplayContainer {
    padding: 1em;
    justify-content: center;
    border-radius: 1em;
    display: flex;
    > a {
      flex: 0 0 8em;
      margin-left: 1em;
      height: 8em;
      &:first-child {
        margin-left: 0;
      }
    }
  }
  .artistsDisplayGridContainer {
    padding: 1em;
    border-radius: 1em;
    display: grid;
    justify-content: center;
    grid-gap: 1em;
    grid-template-columns: repeat(auto-fill, minmax(8em, 1fr));
    grid-auto-rows: 8em;
    /* > a {
      width: calc(25% - 0.75em);
      padding-top: calc(25% - 0.75em);
      margin-left: 1em;

      display: inline-block;
      .image {
        position: absolute;
        top: 0;
        left: 0;
      }
      .infoOverlay {
        content: "";
      }
      &:first-child {
        margin-left: 0;
      }
      &:nth-child(4n + 1) {
        margin-left: 0;
      }
    } */
  }
`;

const UserArtists = styled.div`
  .artistsDisplayGridContainer {
    grid-template-columns: repeat(auto-fill, minmax(6em, 1fr));
    grid-auto-rows: 6em;
  }
  && .sectionHeader {
    margin-bottom: 0;
  }
  &:first-child {
    ${ArtistItem} {
      box-shadow: 2px 2px ${({ theme }) => theme.colors.iris};
    }
  }
  &:last-child {
    ${ArtistItem} {
      box-shadow: 2px 2px ${({ theme }) => theme.colors.neonGreen};
    }
  }
`;

const SharedArtists = styled.div`
  .artistsDisplayContainer,
  .artistsDisplayGridContainer {
    ${commonItemsDisplayBackgroundAnimated};
  }
  && .sectionHeader {
    margin-bottom: 0.625em;
  }
`;

// Genres

const SharedGenres = styled.div`
  && .sectionHeader {
    margin-bottom: 0.625em;
  }
  .genresDisplayContainer {
    ${commonItemsDisplayBackgroundAnimated};
  }
  .genreItem {
    background: rgba(255, 255, 255, 0.1);
    border: 1px solid rgba(255, 255, 255, 0.2);
  }
`;

const UserGenres = styled.div`
  && .sectionHeader {
    margin-bottom: 0;
  }
  &:first-child {
    /* .genresDisplayContainer {
      background: ${({ theme }) =>
      theme.colors.iris10p};
      border: 1px solid ${({ theme }) =>
      theme.colors.iris};
    } */
    .genreItem {
      border: none;
      background: ${({ theme }) => theme.colors.iris10p};
      box-shadow: 2px 2px ${({ theme }) => theme.colors.iris};
    }
  }
  &:last-child {
    /* .genresDisplayContainer {
      background: ${({ theme }) =>
      theme.colors.neonGreen10p};
      border: 1px solid ${({ theme }) =>
      theme.colors.neonGreen};
    } */
    .genreItem {
      border: none;
      background: ${({ theme }) => theme.colors.neonGreen10p};
      box-shadow: 2px 2px ${({ theme }) => theme.colors.neonGreen};
    }
  }
`;

const GenresGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 30% 1fr;
  grid-gap: 2em;
  > div {
    display: flex;
    flex-direction: column;
    justify-content: center;
  }
`;

const GenresGroup = styled.div`
  margin-top: 4em;
  .genresDisplayContainer {
    padding: 1em;
    text-align: center;
    border-radius: 1em;
  }
  .genreItem {
    display: inline-block;
    padding: 0.5em;
    font-size: 1.5rem;
    margin: 0.25em;
    border-radius: 0.25em;
    transition: 0.2s ease-in-out all;
    &:hover {
      transform: scale(1.05);
    }
  }
`;
// Profile Display

const ProfileSnippet = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 1.5em;
  border-radius: 1em;

  .profileImage {
    flex: 0 0 4.5em;
    margin-right: 2em;
    height: 4.5em;
    border-radius: 50%;
    overflow: hidden;
    img {
      height: 100%;
      width: 100%;
      object-fit: cover;
    }
  }
  .userName {
    color: ${({ theme }) => theme.colors.textPrimary};
    font-size: 2rem;
    font-weight: 700;
  }
  &:last-child {
    background: ${({ theme }) => theme.colors.neonGreen10p};
    box-shadow: 4px 4px 0 0 ${({ theme }) => theme.colors.neonGreen};
  }
  &:first-child {
    box-shadow: 4px 4px 0 0 ${({ theme }) => theme.colors.iris};
    background: ${({ theme }) => theme.colors.iris10p};
    /* .userName {
      order: 1;
      text-align: right;
    }
    .profileImage {
      order: 2;
      margin-left: 1em;
      margin-right: 0;
    } */
  }
`;

const NameSeparator = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  color: ${({ theme }) => theme.colors.textTertiary};
  font-size: 3rem;
`;

const UserProfilesGroup = styled.div`
  display: grid;
  grid-template-columns: 1fr 10% 1fr;
  margin-bottom: 2em;
`;

const Separator = styled.div`
  height: 1px;
  width: 80%;
  border-top: 2px dashed ${({ theme }) => theme.colors.darkBodyOverlayBorder};
  margin: 4.5em auto 0;
`;

const ComparifyDisplayWrap = styled.div`
  .sectionHeader {
    text-align: center;
    font-size: 2rem;
    margin-bottom: 0.5em;
    color: ${({ theme }) => theme.colors.textPrimary};
    font-weight: 700;
  }
  h2 {
    font-family: "roboto slab", "open sans", "sans-serif";
    font-size: 5em;
    text-align: center;
    margin-bottom: 0.5em;
  }
`;

export default Comparify;
