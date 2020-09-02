import React, { useState, useEffect } from "react";
import axios from "axios";
import { DEV_URL } from "../../../constants";
import { LoadedTrack } from "../../TopTracks";
import { copyFileSync } from "fs";
import { DiscoverTogetherProps } from "./models";
import getRandomFromArr from "../../../utils/getRandomFromArr";
import { difference } from "lodash";
import styled, { keyframes, css } from "styled-components";
import { TrackItem, TrackItemWrapper } from "../../TopTracks";
import ContentLoader from "react-content-loader";
import Loader from "../../Loader";
import { TiArrowShuffle } from "react-icons/ti";
import { APIError } from "../../../models";
import ErrorComp from "../../shared/ErrorComp";
import { breakpoints } from "../../../theme";

const DiscoverTogether = ({
  genresComparison,
  artistsComparison,
  tracksComparison,
}: DiscoverTogetherProps) => {
  const [isLoading, setIsLoading] = useState(false);
  const [apiError, setApiError] = useState<null | APIError>(null);
  const [isFirstLoading, setIsFirstLoading] = useState(true);
  const [shuffleRecommendations, setShuffleRecommendations] = useState(
    Math.random()
  );
  const [tracksData, setTracksData] = useState<null | LoadedTrack[]>(null);

  useEffect(() => {
    const getRecommendationData = async () => {
      setIsLoading(true);
      let genres = 0,
        artists = 0,
        tracks = 0;

      let genresToUse, artistsToUse, tracksToUse;

      if (
        genresComparison?.allTime?.shared &&
        genresComparison.allTime.shared.length > 0
      ) {
        genres = Math.min(genresComparison.allTime.shared.length, 2);
        genresToUse = getRandomFromArr(
          genresComparison.allTime.shared.slice(0, 5),
          genres
        );
      }

      if (
        artistsComparison?.allTime?.shared &&
        artistsComparison.allTime.shared.length > 0
      ) {
        artists = Math.min(artistsComparison.allTime.shared.length, 4 - genres);
        artistsToUse = getRandomFromArr(
          artistsComparison.allTime.shared.slice(0, 5),
          artists
        );
      }

      if (
        tracksComparison?.now?.shared &&
        tracksComparison.now.shared.length > 0
      ) {
        tracks = Math.min(
          tracksComparison.now.shared.length,
          5 - artists + genres
        );
        tracksToUse = getRandomFromArr(
          tracksComparison.now.shared.slice(0, 5),
          tracks
        );
      }

      try {
        const { data } = await axios.get(`${DEV_URL}/api/get/recommendations`, {
          params: {
            seed_genres: genresToUse ? genresToUse.join(",") : "",
            seed_artists: artistsToUse ? artistsToUse.join(",") : "",
            seed_tracks: tracksToUse ? tracksToUse.join(",") : "",
          },
        });
        const filteredTracks = data.filter((track: LoadedTrack) => {
          const allTrackIDs = tracksComparison?.now?.creatorUnique?.concat(
            tracksComparison?.now?.shared || [],
            tracksComparison?.now?.visitorUnique || []
          );
          const [currentTrackID] = track.href.split(":").slice(-1);
          return !allTrackIDs?.includes(currentTrackID);
        });
        setTracksData(filteredTracks.slice(0, 8));
        setIsLoading(false);
        setIsFirstLoading(false);
      } catch (error) {
        setApiError({
          isError: true,
          status: error.response.data.status,
          message: error.response.data.message,
        });
        console.error(error);
      }
    };
    getRecommendationData();
  }, [shuffleRecommendations]);

  if (apiError) {
    return (
      <>
        <DiscoverTogetherGroup>
          <div className="clippedHeading">
            <h2>Discover Together</h2>
          </div>
          <ErrorComp>
            <span>
              {apiError.status === 404
                ? apiError.message
                : `There was an error loading recommendations. Please try again later.`}
            </span>
          </ErrorComp>
        </DiscoverTogetherGroup>
      </>
    );
  }

  return (
    <DiscoverTogetherGroup>
      <div className="clippedHeading">
        <h2>Discover Together</h2>
      </div>
      {isFirstLoading ? (
        <Loader label={false} />
      ) : tracksData ? (
        <>
          <div className="sectionHeader">
            <span>Tracks we think both of you will enjoy</span>
          </div>
          <TracksGrid loadState={isLoading}>
            <TracksShuffleOverlay>
              Getting new recommendations
              <span role="img" aria-label="emoji">
                🤔
              </span>
            </TracksShuffleOverlay>
            {tracksData.slice(0, 8).map((item, idx) => (
              <TrackItemWrapper key={idx} {...item} />
            ))}
          </TracksGrid>
          <ShuffleButtonWrap>
            <ShuffleButton
              onClick={() => setShuffleRecommendations(Math.random())}
            >
              <TiArrowShuffle />
              <span>Shuffle</span>
            </ShuffleButton>
          </ShuffleButtonWrap>
        </>
      ) : (
        `Oops, there was an error loading recommendations 😿`
      )}
    </DiscoverTogetherGroup>
  );
};

const TracksShuffleOverlay = styled.div`
  width: calc(100% + 20px);
  height: calc(100% + 20px);
  align-items: center;
  justify-content: center;
  top: -10px;
  position: absolute;
  z-index: 3;
  font-size: 1.5em;
  font-weight: 500;
  text-shadow: 1px 1px 2px rgba(0, 0, 0, 0.5);
  border-radius: 0.66667em;
  left: -10px;
  @supports (backdrop-filter: opacity(1)) {
    backdrop-filter: blur(5px);
    -moz-backdrop-filter: blur(5px);
    -webkit-backdrop-filter: blur(5px);
  }
  @supports not (backdrop-filter: opacity(1)) {
    background: rgba(0, 0, 0, 0.5);
  }
  span {
    margin-left: 0.5em;
  }
`;

const TracksGrid = styled.div<{ loadState: boolean }>`
  display: grid;
  overflow: visible;
  grid-template-columns: repeat(4, 1fr);
  ${breakpoints.lessThan("66")`
    grid-template-columns: 1fr 1fr;
  `};
  ${breakpoints.lessThan("38")`
    grid-template-columns: 1fr;
    font-size: 0.875rem;
  `}
  grid-gap: 1em;
  position: relative;
  ${TracksShuffleOverlay} {
    display: ${({ loadState }) => (loadState ? `flex` : `none`)};
  }
  /* margin-top: 1em; */
`;

const ShuffleButtonWrap = styled.div`
  display: flex;
  justify-content: center;
`;
const ShuffleButton = styled.button`
  border-radius: 0.25em;
  border: 1px solid ${({ theme }) => theme.colors.darkBodyOverlayBorder};
  background: ${({ theme }) => theme.colors.darkBodyOverlay};
  color: ${({ theme }) => theme.colors.textPrimary};
  display: inline-block;
  margin-top: 2em;
  padding: 1.25em 5em;
  ${breakpoints.lessThan("48")`
    padding: 0.75em 3em;
  `};
  display: flex;
  align-items: center;
  justify-content: center;
  transition: 0.2s ease all;
  span {
    margin-left: 1em;
  }
  &:hover {
    background: ${({ theme: { colors } }) => colors.mainAccent};
  }
`;

const DiscoverTogetherGroup = styled.div`
  margin-top: 4em;
  display: flex;
  flex-direction: column;
`;

export default DiscoverTogether;
