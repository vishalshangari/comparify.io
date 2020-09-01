import React, { useState, useEffect } from "react";
import styled, { css } from "styled-components";
import { ChartData } from "chart.js";
import ComponentWithLoadingState from "../shared/ComponentWithLoadingState";
import TopGenres from "../TopGenres";
import { breakpoints } from "../../theme";
import Obscurity from "../Obscurity";
import TopTracks from "../TopTracks";
import TopArtists from "../TopArtists";
import AudioFeatures from "../AudioFeatures";

import Header from "../shared/Header";
import fetchUserSavedData from "../../utils/fetchUserSavedData";
import { APIError } from "../../models";
import ErrorComp from "../shared/ErrorComp";
import filterTopGenresForDisplay from "../../utils/filterTopGenresForDisplay";

export type Genre = {
  name: string;
  count: number;
};

type GenresByPeriod = null | Genre[];

type GenresDataArrays = {
  names: string[];
  counts: number[];
};

export type TopGenresDataType = {
  shortTerm: ChartData;
  mediumTerm: null | ChartData;
  longTerm: null | ChartData;
};

type UserInfo = null | {
  names: string[];
};

type AristTrackType = {
  id: string;
  name: string;
  popularity: number;
};

export type Track = AristTrackType;

export type TopTracksType = null | {
  shortTerm: Track[];
  mediumTerm: Track[];
  longTerm: Track[];
};

export type Artist = AristTrackType;

export type TopArtistsType = null | {
  shortTerm: Artist[];
  mediumTerm: Artist[];
  longTerm: Artist[];
};

export type FeatureScores = null | {
  [key: string]: {
    shortTerm: number;
    mediumTerm: number;
    longTerm: number;
  };
};

const PersonalData = () => {
  const [loading, setLoading] = useState(true);
  const [apiError, setApiError] = useState<null | APIError>(null);
  const [topGenres, setTopGenres] = useState<null | TopGenresDataType>(null);
  const [obscurityScore, setObscurityScore] = useState(0);
  const [userInfo, setUserInfo] = useState<UserInfo>(null);
  const [topTracks, setTopTracks] = useState<TopTracksType>(null);
  const [topArtists, setTopArtists] = useState<TopArtistsType>(null);
  const [featureScores, setFeatureScores] = useState<FeatureScores>(null);
  const [pageTitle, setPageTitle] = useState(`Loading...`);

  useEffect(() => {
    const getUserData = async () => {
      try {
        const userData = await fetchUserSavedData();
        const filteredTopGenres = {
          shortTerm: filterTopGenresForDisplay(userData.topGenres.shortTerm),
          mediumTerm:
            userData.topGenres.mediumTerm &&
            userData.topGenres.mediumTerm.length > 0
              ? filterTopGenresForDisplay(userData.topGenres.mediumTerm)
              : null,
          longTerm:
            userData.topGenres.longTerm &&
            userData.topGenres.longTerm.length > 0
              ? filterTopGenresForDisplay(userData.topGenres.longTerm)
              : null,
        };
        setUserInfo(userData.userInfo);
        setPageTitle(`Hi, ${userData.userInfo.names[0]}`);
        setTopGenres(filteredTopGenres);
        setObscurityScore(Math.floor(userData.obscurityScore));
        setFeatureScores(userData.userFeatureScores);
        setTopTracks(userData.topTracks);
        setTopArtists(userData.topArtists);
        setLoading(false);
      } catch (error) {
        console.log(error);
        setApiError({
          isError: true,
          status: error.response.data.status,
          message: error.response.data.message,
        });
      }
    };

    getUserData();
  }, []);

  if (apiError) {
    return (
      <>
        <Header standardNav={true} />
        <PersonalDataWrapper>
          <ErrorComp art>
            <span>
              {apiError.status === 404
                ? apiError.message
                : `There was an error loading your data. Please try again later.`}
            </span>
          </ErrorComp>
        </PersonalDataWrapper>
      </>
    );
  }

  return (
    <>
      <Header standardNav={true} pageTitle={pageTitle} loading={loading} />
      <PersonalDataWrapper>
        <ComponentWithLoadingState label={false} loading={loading}>
          <PersonalDataInner position="top">
            <TopGenres data={topGenres} />
            <Obscurity score={obscurityScore} />
          </PersonalDataInner>
          <AudioFeatures scores={featureScores} />
          <PersonalDataInner position="bottom">
            <TopTracks tracks={topTracks} />
            <TopArtists artists={topArtists} />
          </PersonalDataInner>
        </ComponentWithLoadingState>
      </PersonalDataWrapper>
    </>
  );
};

const topGridLayout = css`
  grid-template-areas: "genres genres genres genres genres genres genres obscurity obscurity obscurity obscurity obscurity";
  ${breakpoints.lessThan("74")`
      grid-template-areas: "genres genres genres genres genres genres genres genres obscurity obscurity obscurity obscurity";
    `}
  ${breakpoints.lessThan("66")`
    grid-template-areas: 
    "genres genres genres genres genres genres genres genres genres genres genres genres"
    "obscurity obscurity obscurity obscurity obscurity obscurity obscurity obscurity obscurity obscurity obscurity obscurity";
  `}
`;

const bottomGridLayout = css`
  grid-template-areas:
    "tracks tracks tracks tracks tracks tracks tracks tracks tracks tracks tracks tracks"
    "artists artists artists artists artists artists artists artists artists artists artists artists";
`;

const PersonalDataInner = styled.div<{ position?: string }>`
  width: 94%;
  /* max-width: 1500px; */
  margin: 0 auto;
  display: grid;
  grid-template-columns: repeat(12, 1fr);
  grid-gap: 2em;
  ${({ position }) => (position === "top" ? topGridLayout : "")};
  ${({ position }) => (position === "bottom" ? bottomGridLayout : "")};

  > div {
    position: relative;
    display: flex;
    flex-direction: column;
  }
  .dataItemHeader {
    display: flex;
    align-items: center;
    flex-wrap: wrap;
    justify-content: space-between;
    margin-bottom: 1.5em;
  }
  .dataItemInner {
    padding: 2em;
    flex-grow: 1;
    box-shadow: 1px 2px 3px rgb(0, 0, 0, 0.3);
    background: ${({ theme }) => theme.colors.darkBodyOverlay};
    border-radius: 0.5em;
    border: 1px solid ${({ theme }) => theme.colors.darkBodyOverlayBorder};
    &:hover {
      border: 1px solid rgb(255, 255, 255, 0.25);
    }
    transition: 0.2s ease all;
  }
`;

const PersonalDataWrapper = styled.div`
  flex-grow: 1;
  display: flex;
  flex-direction: column;
  background: ${({ theme }) => theme.colors.mainContentBg};
  padding: 4em 0;
  ${breakpoints.lessThan("66")`
    padding: 2em 0;
  `}
  h2 {
    font-size: 5rem;
    font-weight: 400;
    white-space: nowrap;
  }
  ${breakpoints.lessThan("90")`
    h2 {
      font-size: 3.75rem
    }
  `}
  ${breakpoints.lessThan("74")`
    h2 {
      font-size: 3rem
    }
  `}
  ${breakpoints.lessThan("66")`
    min-height: 600px;
    h2 {
      font-size: 3.75rem;
    }
  `}
  ${breakpoints.lessThan("38")`
    h2 {
      font-size: 2.75rem;
    }
  `}
`;

export default PersonalData;
