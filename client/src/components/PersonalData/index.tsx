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
import AudioFeatures from "../AudioFeatures";
import { pieChartColors } from "./constants";

type Genre = {
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
  name: string;
};

export type Track = {
  id: string;
  name: string;
  popularity: number;
};

export type TopTracks = null | {
  shortTerm: Track[];
  mediumTerm: Track[];
  longTerm: Track[];
};

export type FeatureScores = null | {
  shortTerm: { [key: string]: number };
  mediumTerm: { [key: string]: number };
  longTerm: { [key: string]: number };
};

const PersonalData = () => {
  const [loading, setLoading] = useState(true);
  const [topGenres, setTopGenres] = useState<TopGenresDataType>(null);
  const [popularityScores, setPopularityScores] = useState(0);
  const [userInfo, setUserInfo] = useState<UserInfo>(null);
  const [topTracks, setTopTracks] = useState<TopTracks>(null);
  const [featureScores, setFeatureScores] = useState<FeatureScores>(null);

  useEffect(() => {
    const getGenresData = async () => {
      try {
        setLoading(true);
        const {
          data: {
            topGenres,
            popularityScores,
            userInfo,
            topTracks,
            featureScores: userFeatureScores,
          },
        } = await axios.get(`${DEV_URL}/api/get/saved-data`, {
          withCredentials: true,
        });
        const filterTopGenres = (data: Genre[]) => {
          let names = [];
          let counts = [];
          let colors = [];
          for (let i = 0; i < 10; i++) {
            names.push(`${i + 1}. ` + data[i].name);
            counts.push(data[i].count);
            colors.push(`#` + pieChartColors[i]);
          }
          return {
            labels: names,
            datasets: [
              {
                data: counts,
                backgroundColor: colors,
                borderColor: "rgb(220,220,220)",
                borderWidth: 2,
              },
            ],
          };
        };
        const filteredTopGenres = {
          shortTerm: filterTopGenres(topGenres.shortTerm),
          longTerm: filterTopGenres(topGenres.longTerm),
        };
        setUserInfo(userInfo);
        setTopGenres(filteredTopGenres);
        const calculatedObscurityScore =
          100 -
          (popularityScores.artists * 0.6 + popularityScores.tracks * 0.4);
        setPopularityScores(Math.floor(calculatedObscurityScore));
        setTopTracks(topTracks);
        setFeatureScores(userFeatureScores);
        setLoading(false);
      } catch (error) {
        console.error(error);
      }
    };

    getGenresData();
  }, []);

  return (
    <>
      <HomeTitle>{loading ? null : <h1>Hi, {userInfo!.name}</h1>}</HomeTitle>
      <PersonalDataWrapper>
        <ComponentWithLoadingState loading={loading}>
          <PersonalDataInner position="top">
            <TopGenres data={topGenres} />
            <Obscurity score={popularityScores} />
          </PersonalDataInner>
          <AudioFeatures scores={featureScores} />
          <PersonalDataInner position="bottom">
            <TopTracks tracks={topTracks} />
          </PersonalDataInner>
        </ComponentWithLoadingState>
      </PersonalDataWrapper>
    </>
  );
};

const HomeTitle = styled.div`
  width: 94%;
  max-width: 1500px;
  margin: -8em auto 3em;
  h1 {
    color: ${({ theme }) => theme.colors.textPrimary};
    font-size: 6rem;
    z-index: 3;
    position: relative;
    display: inline-block;
    line-height: 1.3;
    border-bottom: 8px solid ${({ theme }) => theme.colors.mainAccent};
  }
`;

const topGridLayout = css`
  grid-template-areas: "genres genres genres genres genres genres genres obscurity obscurity obscurity obscurity obscurity";
  ${breakpoints.lessThan("66")`
    grid-template-areas: 
    "genres genres genres genres genres genres genres genres genres genres genres genres"
    "obscurity obscurity obscurity obscurity obscurity obscurity obscurity obscurity obscurity obscurity obscurity obscurity";
  `}
`;

const bottomGridLayout = css`
  grid-template-areas: "tracks tracks tracks tracks tracks tracks . . . . . . ";
  ${breakpoints.lessThan("66")`
    grid-template-areas: 
    "tracks tracks tracks tracks tracks tracks tracks tracks tracks tracks tracks tracks";
  `}
`;

const PersonalDataInner = styled.div<{ position?: string }>`
  width: 94%;
  max-width: 1500px;
  margin: 0 auto 2em;
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
    border: 1px solid rgb(255, 255, 255, 0.07);
    &:hover {
      border: 1px solid rgb(255, 255, 255, 0.25);
    }
    transition: 0.2s ease all;
  }
`;

const PersonalDataWrapper = styled.div`
  min-height: 800px;
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
