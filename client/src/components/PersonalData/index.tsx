import React, { useState, useEffect } from "react";
import styled, { css, keyframes } from "styled-components";
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
import * as QueryString from "query-string";
import SlidingAlert from "../shared/SlidingAlert";
import { useLocation } from "react-router-dom";
import userMagenta from "../../assets/img/user-magenta.png";

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
  const [showSuccessAlert, setShowSuccessAlert] = useState(false);
  const [showScrollIndicator, setShowScrollIndicator] = useState(false);
  const location = useLocation();

  const queryValue = QueryString.parse(location.search);

  useEffect(() => {
    if (queryValue.deleted) {
      setShowSuccessAlert(true);
    }
    const getUserData = async () => {
      try {
        const userData = await fetchUserSavedData();
        if (userData.insufficientUserData) {
          throw new Error("INSUFFICIENT_DATA");
        }
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
        setPageTitle(
          userData.userInfo.names
            ? `Hi, ${userData.userInfo.names[0]}`
            : `Welcome`
        );
        setTopGenres(filteredTopGenres);
        setObscurityScore(Math.floor(userData.obscurityScore));
        setFeatureScores(userData.userFeatureScores);
        setTopTracks(userData.topTracks);
        setTopArtists(userData.topArtists);
        setLoading(false);
        setShowScrollIndicator(true);
      } catch (error) {
        if (error.message === `INSUFFICIENT_DATA`) {
          setApiError({
            isError: true,
            status: 404,
            message:
              "Looks like you don't have enough Spotify data to use Comparify yet. Keep listening and check back soon!",
          });
        } else {
          setApiError({
            isError: true,
            status: error.response?.data?.status || 500,
            message:
              error.response?.data?.message ||
              "Oops, something went wrong. Please try again later.",
          });
        }
      }
    };

    getUserData();
    const handleScroll = () => {
      setShowScrollIndicator(false);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, [queryValue.deleted]);

  const handleCopyClick = () => {
    copyToClipboard(`https://www.comparify.io/${userComparifyPage?.id}`);
    setShowCopyAlert(true);
  };

  if (apiError) {
    return (
      <>
        <Header standardNav={false} logoOnlyNav />
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
        in={showSuccessAlert}
        timeout={1500}
        onEntered={() => setTimeout(() => setShowSuccessAlert(false), 1000)}
      >
        {(state) => (
          <SlidingAlert state={state}>
            The page was successfully deleted.
          </SlidingAlert>
        )}
      </Transition>
      <Transition
        in={showCopyAlert}
        timeout={1500}
        onEntered={() => setTimeout(() => setShowCopyAlert(false), 1000)}
      >
        {(state) => (
          <SlidingAlert state={state}>Link copied to clipboard</SlidingAlert>
        )}
      </Transition>
      <Header
        active="home"
        standardNav={true}
        pageTitle={pageTitle}
        loading={loading}
      />
      <PersonalDataWrapper>
        <ComponentWithLoadingState label={false} loading={loading}>
          <UserComparifyPagePreview>
            <div className="userComparifyFlexContainer">
              <div className="dataItemInner">
                <ComparifyPagePreviewDisplay>
                  <div className="profileImage">
                    <img
                      alt={userInfo?.names.join(" ") || ""}
                      src={userInfo?.profileImageUrl}
                      onError={(e) => (
                        (e.currentTarget.onerror = null),
                        (e.currentTarget.src = userMagenta)
                      )}
                    />
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
                    <AnimatedActionBtn href={`/${userComparifyPage.id}`}>
                      Preview
                    </AnimatedActionBtn>
                  </>
                ) : (
                  <AnimatedActionBtn href={`/compare`}>
                    Create
                  </AnimatedActionBtn>
                )}
              </div>
            </div>
            <div className="comparifyURLSupport">
              {userComparifyPage?.exists && userComparifyPage?.id
                ? `This is your personal and unique Comparify URL. Share it with
                another Spotify user to let them compare their music taste with
                you.`
                : `To create your own personalized Comparify page, click the 'Create' button.`}
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
          <ScrollIndicator showScrollIndicator={showScrollIndicator}>
            More below!
          </ScrollIndicator>
        </ComponentWithLoadingState>
      </PersonalDataWrapper>
    </>
  );
};

const ScrollIndicatorAnimation = keyframes`
  0% {
    bottom: 1em;
  }
  50% {
    bottom: 2em;
  }
  100% {
    bottom: 1em;
  }
`;

const ScrollIndicator = styled.div<{ showScrollIndicator: boolean }>`
  position: fixed;
  bottom: 0;
  left: 50%;
  transform: translateX(-50%);
  padding: 1em 2em;
  font-size: 1.25em;
  ${breakpoints.lessThan("48")`
    padding: 1em 1.5em;
    font-size: 0.875em;
  `}
  background: ${({ theme }) => theme.colors.mainAccent};
  border-radius: 0.5em;
  animation: ${ScrollIndicatorAnimation} 1.5s linear infinite;
  display: ${({ showScrollIndicator }) =>
    showScrollIndicator ? "block" : "none"};
  &:after {
    content: "";
    display: block;
    position: absolute;
    top: 100%;
    left: 50%;
    transform: translateX(-50%);
    border-left: 0.5em solid transparent;
    border-right: 0.5em solid transparent;
    border-top: 0.5em solid ${({ theme }) => theme.colors.mainAccent};
  }
`;

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
    ${breakpoints.lessThan("42")`
      flex: 0 0 3.5em;
      height: 3.5em;
  `}
  }
  .comparifyURLDisplay {
    overflow-wrap: anywhere;
    font-size: 2rem;
    line-height: 1em;
    letter-spacing: 1px;
    font-weight: 500;
    font-family: "open sans", "sans-serif";
    color: ${({ theme }) => theme.colors.textTertiary};
    span {
      font-weight: 700;
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

  .comparifyPageActions {
    display: flex;
    margin-left: 2em;
    a {
      flex: 1;
      display: flex;
      align-items: center;
      justify-content: center;
    }
    a:nth-child(2) {
      background: ${({ theme }) => theme.colors.darkBodyOverlayBorder};
      margin-left: 1em;
    }
  }
  .comparifyURLSupport {
    flex-basis: 100%;
    margin-top: 1em;
  }
  .userComparifyFlexContainer {
    display: flex;
    align-items: center;
    justify-content: center;
  }
  ${breakpoints.lessThan("66")`
    margin: 0 auto 2em;
    .userComparifyFlexContainer {
      flex-wrap: wrap;
    }
    .comparifyPageActions {
      margin-top: 1em;
      align-items: center;
      justify-content: center;
    }
    && .dataItemInner {
      padding: 1em;
    }
    .comparifyURLSupport {
      font-size: 0.875rem;
    }
    && ${AnimatedActionBtn} {
      font-size: 1.25em;
    }
  `}
  ${breakpoints.lessThan("48")`
    .comparifyPageActions {
      flex-basis: 100%;
      margin: 1em 0 0;
    }
  `}
  ${breakpoints.lessThan("38")`
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
    font-weight: 500;
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
