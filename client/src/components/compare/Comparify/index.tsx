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
import { TiChevronRight } from "react-icons/ti";
import AudioFeaturesComparison from "../AudioFeaturesComparison";
import ErrorComp from "../../shared/ErrorComp";
import { ObscurityComparisonDataType } from "../ObscurityComparison/models";
import {
  AudioFeaturesComparisonDataType,
  AudioFeaturesState,
} from "../AudioFeaturesComparison/models";
import ObscurityComparison from "../ObscurityComparison";
import ProfileSnippet from "../../shared/ProfileSnippet";
import { APIError } from "../../../models";
import DiscoverTogether from "../DiscoverTogether";

function getPromiseResult<T>(result: PromiseSettledResult<T>) {
  if (result.status !== `fulfilled`) {
    return undefined;
  }
  return result.value;
}

type ComparifyProps = {
  pageID: string;
};

export type UserInfo = {
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

export type ComparisonData<DataItem> = {
  now?: ComparisonDataForPeriod<DataItem>;
  recent?: ComparisonDataForPeriod<DataItem>;
  allTime?: ComparisonDataForPeriod<DataItem>;
};

const Comparify = ({ pageID }: ComparifyProps) => {
  const [isLoading, setIsLoading] = useState(true);
  const [apiError, setApiError] = useState<null | APIError>(null);
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
    artistsComparisonRawData,
    setArtistsComparisonRawData,
  ] = useState<null | ComparisonData<string>>(null);
  const [
    tracksComparisonData,
    setTracksComparisonData,
  ] = useState<null | ComparisonData<LoadedTrack>>(null);
  const [
    tracksComparisonRawData,
    setTracksComparisonRawData,
  ] = useState<null | ComparisonData<string>>(null);
  const [
    audioFeaturesComparisonData,
    setAudioFeaturesComparisonData,
  ] = useState<null | AudioFeaturesComparisonDataType>(null);
  const audioFeatures: AudioFeaturesState[] = [
    "valence",
    "energy",
    "danceability",
    "tempo",
  ];
  const [audioFeaturesState, setAudioFeaturesState] = useState<
    AudioFeaturesState
  >("valence");
  const [
    obscurityComparisonData,
    setObscurityComparisonData,
  ] = useState<null | ObscurityComparisonDataType>(null);

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
            obscurityComparison,
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

        const comparisonDisplayData = await Promise.allSettled([
          sharedAllTimeArtists, // result[0]
          creatorUniqueAllTimeArtists,
          visitorUniqueAllTimeArtists,
          sharedNowTracks,
          creatorUniqueNowTracks,
          visitorUniqueNowTracks,
        ]);

        setArtistsComparisonRawData(artistsComparison);

        setArtistsComparisonData({
          allTime: {
            shared: getPromiseResult(comparisonDisplayData[0]),
            creatorUnique: getPromiseResult(comparisonDisplayData[1]),
            visitorUnique: getPromiseResult(comparisonDisplayData[2]),
          },
        });

        setTracksComparisonRawData(tracksComparison);

        setTracksComparisonData({
          now: {
            shared: getPromiseResult(comparisonDisplayData[3]),
            creatorUnique: getPromiseResult(comparisonDisplayData[4]),
            visitorUnique: getPromiseResult(comparisonDisplayData[5]),
          },
        });

        setCreatorUserInfo(creator.info);
        setVisitorUserInfo(visitor.info);
        setGenresComparisonData(genresComparison);
        setAudioFeaturesComparisonData(audioFeaturesComparison);
        setAudioFeaturesState("valence");
        setObscurityComparisonData(obscurityComparison);
        setIsLoading(false);
      } catch (error) {
        console.error(error);
        setApiError({
          isError: true,
          status: error.response.data.status,
          message: error.response.data.message,
        });
      }
    };
    getComparisonData();
  }, [pageID]);

  if (apiError) {
    return (
      <ComparifyDisplayWrap>
        <ErrorComp art>
          <span>{apiError.message}</span>
        </ErrorComp>
      </ComparifyDisplayWrap>
    );
  }

  return (
    <ComponentWithLoadingState label={false} loading={isLoading}>
      <ComparifyDisplayWrap>
        {!creatorUserInfo || !visitorUserInfo ? (
          <ErrorComp art>
            <span>
              There was an error loading the requested users' data. Please try
              again.
            </span>
          </ErrorComp>
        ) : (
          <>
            <UserProfilesGroup>
              {/* Group 1: Names */}

              <ProfileSnippet>
                <div className="profileImage">
                  <img src={visitorUserInfo?.profileImageUrl} />
                </div>
                <a
                  href={`spotify:user:${visitorUserInfo?._id}`}
                  className="userName"
                >
                  {visitorUserInfo?.displayName}
                </a>
              </ProfileSnippet>

              <NameSeparator>
                <BsX />
              </NameSeparator>

              <ProfileSnippet>
                <div className="profileImage">
                  <img src={creatorUserInfo?.profileImageUrl} />
                </div>

                <a
                  href={`spotify:user:${creatorUserInfo?._id}`}
                  className="userName"
                >
                  {creatorUserInfo?.displayName}
                </a>
              </ProfileSnippet>
            </UserProfilesGroup>
            <GenresGroup>
              <div className="clippedHeading">
                <h2>Top Genres</h2>
              </div>
              {genresComparisonData && genresComparisonData.allTime ? (
                <GenresGrid>
                  <UserGenres>
                    <div className="sectionHeader">
                      <span>
                        {visitorUserInfo?.displayName.split(" ")[0]}'s others
                      </span>
                    </div>
                    <div className="genresDisplayContainer">
                      {genresComparisonData.allTime.visitorUnique &&
                      genresComparisonData.allTime.visitorUnique.length > 0 ? (
                        genresComparisonData.allTime.visitorUnique
                          .slice(0, 5)
                          .map((genre, idx) => (
                            <div key={idx} className="genreItem">
                              {genre}
                            </div>
                          ))
                      ) : (
                        <span className="noResultsError">
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
                      {genresComparisonData.allTime.shared &&
                      genresComparisonData.allTime.shared.length > 0 ? (
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
                      {genresComparisonData.allTime.creatorUnique &&
                      genresComparisonData.allTime.creatorUnique.length > 0 ? (
                        genresComparisonData.allTime.creatorUnique
                          .slice(0, 5)
                          .map((genre, idx) => (
                            <div key={idx} className="genreItem">
                              {genre}
                            </div>
                          ))
                      ) : (
                        <span className="noResultsError">
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
                <ErrorComp>
                  Oops, there was an error loading analysis of genres.
                </ErrorComp>
              )}
            </GenresGroup>
            <Separator />
            <ArtistsGroup>
              <div className="clippedHeading">
                <h2>Top Artists</h2>
              </div>
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
                        <span className="noResultsError">
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
                        <span className="noResultsError">
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
                <ErrorComp>
                  Oops, there was an error loading analysis of artists.
                </ErrorComp>
              )}
            </ArtistsGroup>
            <Separator />
            <TracksGroup>
              {tracksComparisonData && tracksComparisonData.now ? (
                <TracksGrid>
                  <CommonTracks>
                    <div className="clippedHeading">
                      <h2>Now Playing</h2>
                    </div>

                    {
                      tracksComparisonData.now.shared &&
                      tracksComparisonData.now.shared.length > 0 ? (
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
                      ) : null
                      // <div className="noCommonTracks">
                      //   Doesn't look like you are loving any of the same tracks
                      //   recently.
                      // </div>
                    }
                  </CommonTracks>
                  <VisitorTracks>
                    <div className="sectionHeader">
                      <span>Your top tracks</span>
                    </div>
                    {tracksComparisonData.now.visitorUnique &&
                    tracksComparisonData.now.visitorUnique.length > 0 ? (
                      <>
                        <UserTracksGrid>
                          {tracksComparisonData.now.visitorUnique
                            .slice(0, 10)
                            .map((item, idx) => (
                              <TrackItemWrapper key={idx} {...item} />
                            ))}
                        </UserTracksGrid>
                      </>
                    ) : (
                      <div className="noResultsError">
                        Couldn't find anything here...{" "}
                        <span role="img" aria-label="emoji">
                          😯
                        </span>
                      </div>
                    )}
                  </VisitorTracks>
                  <CreatorTracks>
                    <div className="sectionHeader">
                      <span>
                        {creatorUserInfo?.displayName.split(" ")[0]}'s top
                        tracks
                      </span>
                    </div>
                    {tracksComparisonData.now.creatorUnique &&
                    tracksComparisonData.now.creatorUnique.length > 0 ? (
                      <>
                        <UserTracksGrid>
                          {tracksComparisonData.now.creatorUnique
                            .slice(0, 10)
                            .map((item, idx) => (
                              <TrackItemWrapper key={idx} {...item} />
                            ))}
                        </UserTracksGrid>
                      </>
                    ) : (
                      <div className="noResultsError">
                        Couldn't find anything here...{" "}
                        <span role="img" aria-label="emoji">
                          😯
                        </span>
                      </div>
                    )}
                  </CreatorTracks>
                </TracksGrid>
              ) : (
                <ErrorComp>
                  Oops, there was an error loading analysis of tracks.
                </ErrorComp>
              )}
            </TracksGroup>
            <Separator />
            <AudioFeaturesComparison
              audioFeaturesComparisonData={audioFeaturesComparisonData}
              creatorUserInfo={creatorUserInfo!}
              visitorUserInfo={visitorUserInfo!}
            />
            <ObscurityComparison
              obscurityComparisonData={obscurityComparisonData}
              creatorUserInfo={creatorUserInfo!}
              visitorUserInfo={visitorUserInfo!}
            />
            <Separator />
            <DiscoverTogether
              genresComparison={genresComparisonData}
              artistsComparison={artistsComparisonRawData}
              tracksComparison={tracksComparisonRawData}
            />
            <Separator />
            {tracksComparisonData &&
            artistsComparisonData &&
            genresComparisonData &&
            obscurityComparisonData ? (
              <ActionsGroup>
                <div className="sectionHeader">
                  <span>
                    Like what you see?{" "}
                    <span role="img" aria-label="emoji">
                      😏
                    </span>
                  </span>
                </div>
                <MakeAPage>
                  <span className="title">
                    Get your own <span className="brand">Comparify</span> page
                  </span>
                </MakeAPage>

                <span className="description">
                  An easy, beautiful, and free way to compare taste in music.
                </span>
              </ActionsGroup>
            ) : null}{" "}
          </>
        )}
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

// Actions

const ActionsGroup = styled.div`
  margin-top: 4em;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  .sectionHeader {
    margin-bottom: 1em;
  }
  .description {
    margin-top: 1em;
  }
  ${breakpoints.lessThan("66")`
    margin-top: 2em;
  `}
`;

const MakeAPage = styled.button`
  border-radius: 0.25em;
  padding: 2em 4em;
  display: flex;
  align-items: center;
  justify-content: center;
  color: ${({ theme }) => theme.colors.textPrimary};
  ${commonItemsDisplayBackgroundAnimated};
  text-shadow: 1px 1px 2px rgba(0, 0, 0, 0.25);
  transition: 0.2s ease color;
  .brand {
    font-family: "roboto slab", "open sans", "sans-serif";
    font-weight: 700;
  }
  .title {
    display: block;
    font-size: 2rem;
    color: ${({ theme }) => theme.colors.textPrimary};
  }
  :hover {
    background: ${({ theme }) => theme.colors.textPrimary};
    .title {
      color: ${({ theme }) => theme.colors.mainAccent};
      text-shadow: none;
    }
  }
`;

// Tracks

const TracksGroup = styled.div`
  margin-top: 4em;
  ${breakpoints.lessThan("66")`
    margin-top: 2em;
  `}
`;

const VisitorTracks = styled.div`
  grid-area: visitor;
  position: relative;
  padding: 1em;
  ${TrackItem} {
    box-shadow: 2px 2px ${({ theme }) => theme.colors.iris};
  }
`;

const CreatorTracks = styled.div`
  position: relative;
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
  ${breakpoints.lessThan("66")`
    margin-top: 2em;
  `}
  .artistsDisplayContainer,
  .artistsDisplayGridContainer {
    position: relative;
  }
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
    margin-bottom: 0.5em;
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
    position: relative;
    flex-basis: 4rem;
  }
  .error {
    position: absolute;
    left: 50%;
    top: 1rem;
    transform: translateX(-50%);
  }
`;

// Genres

const SharedGenres = styled.div`
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
    margin-bottom: 0.3125em;
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
  ${breakpoints.lessThan("66")`
    margin-top: 2em;
  `}
  .genresDisplayContainer {
    padding: 1em;
    text-align: center;
    border-radius: 1em;
    position: relative;
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
  ${breakpoints.lessThan("48")`
    grid-template-columns: 1fr;
    ${NameSeparator} {
      margin: 0.25em 0;
      font-size: 2rem;
    }
  `}
  margin-bottom: 2em;
`;

const Separator = styled.div`
  height: 1px;
  width: 80%;
  border-top: 2px dashed ${({ theme }) => theme.colors.darkBodyOverlayBorder};
  margin: 5em auto 0;
  ${breakpoints.lessThan("66")`
    margin-top: 2.5em;
  `}
`;

const ComparifyDisplayWrap = styled.div`
  .sectionHeader {
    text-align: center;
    font-size: 2rem;
    margin-bottom: 1em;
    color: ${({ theme }) => theme.colors.textPrimary};
    font-weight: 700;
    ${breakpoints.lessThan("66")`
      font-size: 1.5rem;
    `}
  }
  h2 {
    font-family: "roboto slab", "open sans", "sans-serif";
    font-size: 5rem;
    text-align: center;
    line-height: 1.2;
    margin-bottom: 0.5em;
    ${breakpoints.lessThan("66")`
      font-size: 3.5rem;
  `}
  }
  .clippedHeading {
    ${commonItemsDisplayBackgroundAnimated};
    -webkit-text-fill-color: transparent;
    -webkit-background-clip: text;
    background-clip: text;
  }
  .noResultsError {
    padding: 1em;
    background: ${({ theme }) => theme.colors.errorRed};
    border-radius: 0.5em;
    text-align: center;
    position: absolute;
    left: 50%;
    transform: translateX(-50%);
  }
`;

export default Comparify;
