import React, { useState, useEffect } from "react";
import styled from "styled-components";
import { breakpoints } from "../../theme";
import { DataOptions, DataButton } from "../shared/DataOptions";
import DisplayQuantityToggleBtn from "../shared/DisplayQuantityToggleBtn";
import { TopTracksType } from "../PersonalData";
import Loader from "../Loader";
import fetchMultipleTracks from "../../utils/fetchMultipleTracks";
import { BsChevronDown, BsChevronUp } from "react-icons/bs";
import { Link, Element, scroller } from "react-scroll";

type TopTracksProps = {
  tracks: TopTracksType;
};

export type LoadedTrack = {
  name: string;
  image: {
    height?: number;
    url?: string;
    width?: number;
  };
  artists: string[];
  preview_url: string;
  href: string;
  album: string;
};

export type TracksDisplayData = {
  now: LoadedTrack[];
  recent: LoadedTrack[];
  allTime: LoadedTrack[];
};

const TopTracksWrapper = ({ tracks }: TopTracksProps) => {
  const [isLoading, setIsLoading] = useState(true);
  const [tracksData, setTracksData] = useState<null | TracksDisplayData>(null);
  const [currentDisplayPeriod, setCurrentDisplayPeriod] = useState<
    keyof TracksDisplayData
  >("now");
  const [displayShortenedQuantity, setDisplayShortenedQuantity] = useState(
    true
  );

  useEffect(() => {
    const getTracksData = async () => {
      let shortTermTrackIDs: string[] = [];
      for (let i = 0; i < tracks!.shortTerm.length; i++) {
        shortTermTrackIDs.push(tracks!.shortTerm[i].id);
      }

      const shortTermTrackInfo = fetchMultipleTracks(shortTermTrackIDs);

      let mediumTermTrackIDs: string[] = [];
      for (let i = 0; i < tracks!.mediumTerm.length; i++) {
        mediumTermTrackIDs.push(tracks!.mediumTerm[i].id);
      }

      const mediumTermTrackInfo = fetchMultipleTracks(mediumTermTrackIDs);

      let longTermTrackIDs: string[] = [];
      for (let i = 0; i < tracks!.longTerm.length; i++) {
        longTermTrackIDs.push(tracks!.longTerm[i].id);
      }

      const longTermTrackInfo = fetchMultipleTracks(longTermTrackIDs);

      try {
        const result = await Promise.all([
          shortTermTrackInfo,
          mediumTermTrackInfo,
          longTermTrackInfo,
        ]);

        setTracksData({
          now: result[0],
          recent: result[1],
          allTime: result[2],
        });
        setCurrentDisplayPeriod("now");
        setIsLoading(false);
      } catch (error) {
        // TODO: handle errors in fetching top tracks by setting loading false and rendering error message
        console.error(error);
      }
    };
    getTracksData();
  }, [tracks]);

  const handleNowClick = () => {
    setCurrentDisplayPeriod("now");
  };

  const handleRecentClick = () => {
    setCurrentDisplayPeriod("recent");
  };

  const handleAllTimeClick = () => {
    setCurrentDisplayPeriod("allTime");
  };

  const handleDisplayQuantityToggle = () => {
    setDisplayShortenedQuantity((prevState) => !prevState);
    scroller.scrollTo("tracksItemList", {
      duration: 300,
      delay: 0,
      smooth: true,
    });
  };

  return (
    <TracksDisplay name="tracksItemList">
      <div className="dataItemHeader">
        <h2>Top Tracks</h2>
        <DataOptions>
          <DataButton
            active={currentDisplayPeriod === "now" ? true : false}
            onClick={() => handleNowClick()}
          >
            Now
          </DataButton>
          <DataButton
            active={currentDisplayPeriod === "recent" ? true : false}
            onClick={() => handleRecentClick()}
          >
            Recent
          </DataButton>
          <DataButton
            active={currentDisplayPeriod === "allTime" ? true : false}
            onClick={() => handleAllTimeClick()}
          >
            All-Time
          </DataButton>
        </DataOptions>
      </div>
      {isLoading ? (
        <Loader label={false} />
      ) : tracksData ? (
        <>
          <ItemList>
            {tracksData[currentDisplayPeriod]
              .slice(0, displayShortenedQuantity ? 15 : undefined)
              .map((item, idx) => (
                <TrackItemWrapper key={idx} {...item} />
              ))}
          </ItemList>
          <DisplayQuantityToggleBtn
            show={tracksData[currentDisplayPeriod].length > 15}
            onClick={handleDisplayQuantityToggle}
          >
            {displayShortenedQuantity ? (
              <>
                <BsChevronDown />
                <span>
                  Show More{" "}
                  <span className={"totalCount"}>
                    {tracksData[currentDisplayPeriod].length}
                  </span>
                </span>
              </>
            ) : (
              <>
                <BsChevronUp />
                <span>Show Fewer</span>
              </>
            )}
          </DisplayQuantityToggleBtn>
        </>
      ) : (
        `Oops, there was an error loading your top tracks 😔`
      )}
    </TracksDisplay>
  );
};

export const TrackItemWrapper = ({
  name,
  image,
  href,
  album,
  artists,
  preview_url,
}: LoadedTrack) => {
  return (
    <TrackItem
      href={href}
      title={`${name} by ${artists.join(", ")}, Album: ${album}`}
    >
      <div className="image">
        <img src={image.url} alt={`${name} by ${artists.join(", ")}`} />
      </div>
      <div className="info">
        <div className="name">{name}</div>
        <div className="artists">{artists.join(", ")}</div>
        <div className="album">{album === name ? "Single" : album}</div>
      </div>
    </TrackItem>
  );
};

export const TrackItem = styled.a`
  display: flex;
  align-items: center;
  position: relative;
  overflow: hidden;
  box-shadow: 1px 2px 3px rgb(0, 0, 0, 0.3);
  background: ${({ theme }) => theme.colors.darkBodyOverlay};
  background: ${({ theme }) =>
    `linear-gradient(180deg, rgba(29,31,33,1) 0%, ${theme.colors.darkBodyOverlay} 100%)`};
  border-radius: 0.25em;
  border: 1px solid ${({ theme }) => theme.colors.darkBodyOverlayBorder};
  &:hover {
    border: 1px solid rgb(255, 255, 255, 0.25);
    .name {
      text-decoration: underline;
    }
  }
  transition: 0.2s ease all;
  .image {
    flex: 0 0 5em;
    align-self: normal;
    margin-right: 1em;
    overflow: hidden;
    img {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }
  }
  .info {
    padding: 0.5em 0;
    &:after {
      content: "";
      height: 100%;
      width: 1em;
      position: absolute;
      right: 0;
      top: 0;
      background: linear-gradient(
        90deg,
        rgba(0, 0, 0, 0) 0%,
        ${({ theme }) => theme.colors.darkBodyOverlay} 100%
      );
    }
  }
  .name {
    color: ${({ theme }) => theme.colors.textPrimary};
    font-weight: 700;
    white-space: nowrap;
  }
  .artists {
    color: ${({ theme }) => theme.colors.textTertiary};
    white-space: nowrap;
  }
  .album {
    color: ${({ theme }) => theme.colors.textTertiary};
    opacity: 0.5;
    white-space: nowrap;
  }
`;

const ItemList = styled.div`
  display: grid;
  grid-gap: 1em;
  grid-template-columns: 1fr 1fr 1fr 1fr;
`;

const TracksDisplay = styled(Element)`
  && {
    display: block;
  }
  grid-area: tracks;
  margin-bottom: 2em;
  min-height: 300px;
  ${breakpoints.lessThan("85")`
    .dataItemHeader {
      flex-wrap: wrap;
      h2 {
        flex-basis: 100%;
        margin-bottom: 0.5em;
      }
      ${DataOptions} {
        flex-basis: 100%;
      }
      ${DataButton} {
        flex: 1;
      }
    }
  `}
`;

export default TopTracksWrapper;
