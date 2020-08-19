import React, { useState, useEffect } from "react";
import styled from "styled-components";
import { breakpoints } from "../../theme";
import { DataOptions, DataButton } from "../shared/DataOptions";
import { TopTracks } from "../PersonalData";
import axios from "axios";
import { DEV_URL } from "../../constants";
import Loader from "../Loader";

type TopTracksProps = {
  tracks: TopTracks;
};

type LoadedTrack = {
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

type DisplayData = {
  now: LoadedTrack[];
  recent: LoadedTrack[];
  allTime: LoadedTrack[];
};

const TopTracksWrapper = ({ tracks }: TopTracksProps) => {
  const [isLoading, setIsLoading] = useState(true);
  const [tracksData, setTracksData] = useState<null | DisplayData>(null);
  const [currentDisplayState, setCurrentDisplayState] = useState<
    keyof DisplayData
  >("now");

  useEffect(() => {
    const getTracksData = async () => {
      let trackIDs = "";
      for (let i = 0; i < 10; i++) {
        trackIDs += tracks!.shortTerm[i].id + ",";
      }
      for (let i = 0; i < 10; i++) {
        trackIDs += tracks!.mediumTerm[i].id + ",";
      }
      for (let i = 0; i < 10; i++) {
        trackIDs += tracks!.longTerm[i].id + ",";
      }
      try {
        const {
          data: { shortTerm, mediumTerm, longTerm },
        } = await axios.post(`${DEV_URL}/api/get/track-info`, {
          ids: trackIDs.substring(0, trackIDs.length - 1),
        });
        setTracksData({
          now: shortTerm,
          recent: mediumTerm,
          allTime: longTerm,
        });
        setIsLoading(false);
        setCurrentDisplayState("now");
      } catch (error) {
        console.error(error);
      }
    };
    getTracksData();
  }, [tracks]);

  const handleNowClick = () => {
    setCurrentDisplayState("now");
  };

  const handleRecentClick = () => {
    setCurrentDisplayState("recent");
  };

  const handleAllTimeClick = () => {
    setCurrentDisplayState("allTime");
  };

  return (
    <TracksDisplay>
      <div className="dataItemHeader">
        <h2>Top Tracks</h2>
        <DataOptions>
          <DataButton
            active={currentDisplayState === "now" ? true : false}
            onClick={() => handleNowClick()}
          >
            Now
          </DataButton>
          <DataButton
            active={currentDisplayState === "recent" ? true : false}
            onClick={() => handleRecentClick()}
          >
            Recent
          </DataButton>
          <DataButton
            active={currentDisplayState === "allTime" ? true : false}
            onClick={() => handleAllTimeClick()}
          >
            All-Time
          </DataButton>
        </DataOptions>
      </div>
      {isLoading ? (
        <Loader />
      ) : (
        <ItemList>
          {tracksData &&
            tracksData[currentDisplayState].map((item, idx) => (
              <MusicItem key={idx} {...item} />
            ))}
        </ItemList>
      )}
    </TracksDisplay>
  );
};

const MusicItem = ({
  name,
  image,
  href,
  album,
  artists,
  preview_url,
}: LoadedTrack) => {
  return (
    <MusicItemInner href={href}>
      <div className="image">
        <img src={image.url} alt={`${name} by ${artists.join(", ")}`} />
      </div>
      <div className="info">
        <div className="name">{name}</div>
        <div className="artists">{artists.join(", ")}</div>
        <div className="album">{album === name ? "Single" : album}</div>
      </div>
    </MusicItemInner>
  );
};

const MusicItemInner = styled.a`
  display: flex;
  align-items: center;
  overflow: hidden;
  box-shadow: 1px 2px 3px rgb(0, 0, 0, 0.3);
  background: ${({ theme }) => theme.colors.darkBodyOverlay};
  border-radius: 0.25em;
  border: 1px solid rgb(255, 255, 255, 0.07);
  &:hover {
    border: 1px solid rgb(255, 255, 255, 0.25);
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
  }
  .name {
    color: ${({ theme }) => theme.colors.textPrimary};
    font-weight: 700;
  }
  .artists {
    color: ${({ theme }) => theme.colors.textTertiary};
  }
  .album {
    color: ${({ theme }) => theme.colors.textTertiary};
    opacity: 0.5;
  }
`;

const ItemList = styled.div`
  display: grid;
  grid-gap: 1em;
  grid-template-columns: 1fr 1fr;
`;

const TracksDisplay = styled.div`
  grid-area: tracks;
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
