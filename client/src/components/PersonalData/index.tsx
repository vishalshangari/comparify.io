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
import { ComparifyPage } from "../../hooks/useComparifyPage";
import filterTopGenresForDisplay from "../../utils/filterTopGenresForDisplay";
import { AnimatedActionBtn } from "../compare/ComparifyPreview";
import copyToClipboard from "../../utils/copyToClipboard";
import { MdShare } from "react-icons/md";
import { Transition } from "react-transition-group";
import CopyToClipboardAlert from "../shared/CopyToClipboardAlert";

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
  profileImageUrl: string;
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
  const [
    userComparifyPage,
    setUserComparifyPage,
  ] = useState<null | ComparifyPage>(null);
  const [pageTitle, setPageTitle] = useState(`Loading...`);
  const [showCopyAlert, setShowCopyAlert] = useState(false);

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
        setUserComparifyPage(userData.comparifyPage);
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

  const handleCopyClick = () => {
    copyToClipboard(`https://www.comparify.io/${userComparifyPage?.id}`);
    setShowCopyAlert(true);
  };

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
      <Transition
        in={showCopyAlert}
        timeout={1500}
        onEntered={() => setTimeout(() => setShowCopyAlert(false), 1000)}
      >
        {(state) => (
          <CopyToClipboardAlert state={state}>
            Link copied to clipboard
          </CopyToClipboardAlert>
        )}
      </Transition>
      <Header standardNav={true} pageTitle={pageTitle} loading={loading} />
      <PersonalDataWrapper>
        <ComponentWithLoadingState label={false} loading={loading}>
          <UserComparifyPagePreview>
            <div className="dataItemInner">
              <ComparifyPagePreviewDisplay>
                <div className="profileImage">
                  <img src={userInfo?.profileImageUrl} />
                </div>
                {userComparifyPage?.exists && userComparifyPage?.id ? (
                  <div className="comparifyURLDisplay">
                    {`comparify.io/`}
                    <span>{`${userComparifyPage.id}`}</span>
                  </div>
                ) : (
                  <div className="noComparifyPageDisplay">
                    You don't have a Comparify page yet.
                  </div>
                )}
              </ComparifyPagePreviewDisplay>
            </div>
            <div className="comparifyPageActions">
              {userComparifyPage?.exists ? (
                <>
                  <AnimatedActionBtn onClick={handleCopyClick}>
                    <span className="icon">
                      <MdShare />
                    </span>
                    Share
                  </AnimatedActionBtn>
                  <AnimatedActionBtn>Preview</AnimatedActionBtn>
                </>
              ) : (
                <AnimatedActionBtn>Create</AnimatedActionBtn>
              )}
            </div>
          </UserComparifyPagePreview>
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

const ComparifyPagePreviewDisplay = styled.div`
  display: flex;
  align-items: center;
  .profileImage {
    flex: 0 0 5em;
    margin-right: 1em;
    height: 5em;
    border-radius: 50%;
    overflow: hidden;
    img {
      height: 100%;
      width: 100%;
      object-fit: cover;
    }
  }
  .comparifyURLDisplay {
    overflow-wrap: anywhere;
    font-size: 2rem;
    line-height: 1;
    letter-spacing: 1px;
    font-weight: 300;
    font-family: "roboto slab", "open sans", "sans-serif";
    color: ${({ theme }) => theme.colors.textTertiary};
    span {
      font-weight: 500;
      color: ${({ theme }) => theme.colors.textPrimary};
    }
  }
  .noComparifyPageDisplay {
    font-size: 2rem;
  }
  ${breakpoints.lessThan("85")`
    .comparifyURLDisplay {
      font-size: 1.5rem;
    }
  `}
  ${breakpoints.lessThan("74")`
    .comparifyURLDisplay {
      font-size: 1.375rem;
      span {
        display: block;
        margin-top: 0.25em;
      }
    }
    .noComparifyPageDisplay {
      font-size: 1.75rem;
    }
  `}
  ${breakpoints.lessThan("58")`
    .comparifyURLDisplay {
      font-size: 1.25rem;
    }
  `}
  ${breakpoints.lessThan("48")`
    .comparifyURLDisplay {
      font-size: 2rem;
    }
    .noComparifyPageDisplay {
      font-size: 1.5rem;
    }
  `}
  ${breakpoints.lessThan("42")`
    .comparifyURLDisplay {
      font-size: 1.5rem;
    }
  `}
  ${breakpoints.lessThan("38")`
    .noComparifyPageDisplay {
      font-size: 1.25rem;
    }
  `}
  ${breakpoints.lessThan("33")`
    .comparifyURLDisplay {
      font-size: 1.25rem;
    }
  `}
`;

const UserComparifyPagePreview = styled.div`
  width: 94%;
  margin: 0 auto 4em;
  display: flex;
  align-items: center;
  justify-content: center;
  > div {
    margin-right: 2em;
  }
  > div:last-child {
    margin-right: 0;
  }
  .comparifyPageActions {
    display: flex;
    a:first-child {
      margin-right: 1em;
    }
  }
  ${breakpoints.lessThan("66")`
    margin: 0 auto 2em;
  `}
  ${breakpoints.lessThan("48")`
    flex-wrap: wrap;
    > div {
      flex-basis: 100%;
      margin: 0;
    }
    > div:last-child {
      margin-top: 1em;
      display: flex;
      align-items: center;
      justify-content: center;
    }
    && .dataItemInner {
      padding: 1em;
    }
    && ${AnimatedActionBtn} {
      font-size: 1.25em;
    }
  `}
  ${breakpoints.lessThan("58")`
    && ${AnimatedActionBtn} {
      font-size: 1em;
    }
  `}
`;

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

export default PersonalData;
