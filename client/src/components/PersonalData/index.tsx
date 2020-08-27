import React, { useState, useEffect } from "react";
import styled, { css } from "styled-components";
import axios from "axios";
import { ChartData } from "chart.js";
import { DEV_URL } from "../../constants";
import ComponentWithLoadingState from "../shared/ComponentWithLoadingState";
import TopGenres from "../TopGenres";
import { breakpoints } from "../../theme";
import Obscurity from "../Obscurity";
import TopTracks from "../TopTracks";
import TopArtists from "../TopArtists";
import AudioFeatures from "../AudioFeatures";
import { pieChartColors } from "./constants";
import { PageTitle, PageTitleInner } from "../shared/PageTitle";
import Header from "../shared/Header";
import fetchUserSavedData from "../../utils/fetchUserSavedData";
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

export type TopGenresDataType = null | {
  shortTerm: ChartData;
  longTerm: ChartData;
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
  shortTerm: { [key: string]: number };
  mediumTerm: { [key: string]: number };
  longTerm: { [key: string]: number };
};

const PersonalData = () => {
  const [loading, setLoading] = useState(true);
  const [topGenres, setTopGenres] = useState<TopGenresDataType>(null);
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
          longTerm: filterTopGenresForDisplay(userData.topGenres.longTerm),
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
      }
    };

    getUserData();
  }, []);

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
  ${breakpoints.lessThan("66")`
    grid-template-areas:                          
    "tracks tracks tracks tracks tracks tracks tracks tracks tracks tracks tracks tracks";
  `}
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
  h2 {
    font-size: 4rem;
    font-weight: 700;
    white-space: nowrap;
  }
  ${breakpoints.lessThan("74")`
    h2 {
      font-size: 2.5rem
    }
  `}
  ${breakpoints.lessThan("66")`
    min-height: 600px;
    h2 {
      font-size: 4rem
    }
  `}
`;

export default PersonalData;
