import React, { useState, useEffect } from "react";
import styled from "styled-components";
import { breakpoints } from "../../theme";
import { DataOptions, DataButton } from "../shared/DataOptions";
import { TopArtistsType } from "../PersonalData";
import axios from "axios";
import { DEV_URL } from "../../constants";
import Loader from "../Loader";
import { GoLinkExternal } from "react-icons/go";
import fetchMultipleArtists from "../../utils/fetchMultipleArtists";
import { Link, Element, scroller } from "react-scroll";
import { BsChevronDown, BsChevronUp } from "react-icons/bs";
import { APIError } from "../../models";
import DisplayQuantityToggleBtn from "../shared/DisplayQuantityToggleBtn";
import { useMedia } from "react-use";
import ErrorComp from "../shared/ErrorComp";

type TopArtistsProps = {
  artists: TopArtistsType;
};

type SpotifyImage = {
  height?: number;
  url?: string;
  width?: string;
};

export type LoadedArtist = {
  name: string;
  images?: SpotifyImage[];
  href: string;
  popularity: number;
};

type ArtistsDisplayData = {
  now: APIError | LoadedArtist[];
  recent: APIError | LoadedArtist[];
  allTime: APIError | LoadedArtist[];
};

const TopArtistsWrapper = ({ artists }: TopArtistsProps) => {
  const ARTISTS_SHORTENED_QUANTITY = useMedia("(max-width: 38em)") ? 8 : 12;
  const [isLoading, setIsLoading] = useState(true);
  const [artistsData, setArtistsData] = useState<null | ArtistsDisplayData>(
    null
  );
  const [currentDisplayPeriod, setCurrentDisplayPeriod] = useState<
    keyof ArtistsDisplayData
  >("now");
  const [displayShortenedQuantity, setDisplayShortenedQuantity] = useState(
    true
  );

  useEffect(() => {
    const getArtistsData = async () => {
      let shortTermArtistIDs: string[] = [];
      for (let i = 0; i < artists!.shortTerm.length; i++) {
        shortTermArtistIDs.push(artists!.shortTerm[i].id);
      }

      const shortTermArtistInfo = fetchMultipleArtists(shortTermArtistIDs);

      let mediumTermArtistIDs: string[] = [];
      for (let i = 0; i < artists!.mediumTerm.length; i++) {
        mediumTermArtistIDs.push(artists!.mediumTerm[i].id);
      }

      const mediumTermArtistInfo = fetchMultipleArtists(mediumTermArtistIDs);

      let longTermArtistIDs: string[] = [];
      for (let i = 0; i < artists!.longTerm.length; i++) {
        longTermArtistIDs.push(artists!.longTerm[i].id);
      }

      const longTermArtistInfo = fetchMultipleArtists(longTermArtistIDs);

      const getPromiseResult = (
        result: PromiseSettledResult<LoadedArtist[]>
      ) => {
        console.log(result);
        if (result.status !== `fulfilled`) {
          return {
            isError: true,
            status: 500,
            message: `There was an error loading these artists.`,
          };
        }
        return result.value;
      };

      const result = await Promise.allSettled([
        shortTermArtistInfo,
        mediumTermArtistInfo,
        longTermArtistInfo,
      ]);

      setArtistsData({
        now: getPromiseResult(result[0]),
        recent: getPromiseResult(result[1]),
        allTime: getPromiseResult(result[2]),
      });

      setCurrentDisplayPeriod("now");
      setIsLoading(false);
    };
    getArtistsData();
  }, [artists]);

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
    scroller.scrollTo("artistsItemList", {
      duration: 300,
      delay: 0,
      smooth: true,
    });
  };

  const determineIfError = (
    data: APIError | LoadedArtist[]
  ): data is APIError => {
    if ((data as APIError).isError) {
      return true;
    }
    return false;
  };

  const artistListToDisplay = (data: APIError | LoadedArtist[]) => {
    if (determineIfError(data)) {
      return <ErrorComp>{data.message}</ErrorComp>;
    } else {
      return (
        <>
          <ItemList>
            {data
              .slice(
                0,
                displayShortenedQuantity
                  ? ARTISTS_SHORTENED_QUANTITY
                  : undefined
              )
              .map((item, idx) => (
                <ArtistItemWrapper key={idx} {...item} />
              ))}
          </ItemList>
          <DisplayQuantityToggleBtn
            show={data.length > ARTISTS_SHORTENED_QUANTITY}
            onClick={handleDisplayQuantityToggle}
          >
            {displayShortenedQuantity ? (
              <>
                <BsChevronDown />
                <span>
                  Show More{" "}
                  <span className={"totalCount"}>
                    {data.length - ARTISTS_SHORTENED_QUANTITY}
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
      );
    }
  };

  return (
    <ArtistsDisplay name="artistsItemList">
      <div className="dataItemHeader">
        <h2>Top Artists</h2>
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
      ) : artistsData ? (
        artistListToDisplay(artistsData[currentDisplayPeriod])
      ) : (
        <ErrorComp>
          `Oops, there was an unknown error loading your top artists 😟`
        </ErrorComp>
      )}
    </ArtistsDisplay>
  );
};

const ArtistItemWrapper = ({
  name,
  images,
  href,
  popularity,
}: LoadedArtist) => {
  return (
    <ArtistItem href={href} title={name}>
      <div className="image">
        <img src={images![0].url} alt={name} />
      </div>
      <div className="infoOverlay">{`Popularity: ${popularity}`}</div>
      <div className="linkOverlay">
        <GoLinkExternal />
      </div>
      <div className="info">
        <div className="name">{name}</div>
        {/* <div className="artists">{artists.join(", ")}</div>
        <div className="album">{album === name ? "Single" : album}</div> */}
      </div>
    </ArtistItem>
  );
};

export const ArtistItem = styled.a`
  display: flex;
  align-items: center;
  position: relative;
  overflow: hidden;
  box-shadow: 1px 2px 3px rgb(0, 0, 0, 0.3);
  background: ${({ theme }) => theme.colors.darkBodyOverlay};
  border-radius: 0.25em;
  border: 1px solid ${({ theme }) => theme.colors.darkBodyOverlayBorder};
  &:hover {
    border: 1px solid rgb(255, 255, 255, 0.25);
    .linkOverlay {
      opacity: 1;
    }
    .infoOverlay {
      opacity: 1;
    }
  }
  transition: 0.2s ease all;
  .image {
    width: 100%;
    height: 100%;
    img {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }
  }
  .info {
    position: absolute;
    line-height: 1;
    width: 100%;
    bottom: 0;
    padding: 1em;
    background: linear-gradient(
      0deg,
      rgba(0, 0, 0, 70) 0%,
      rgba(0, 0, 0, 0) 100%
    );
  }
  .name {
    color: ${({ theme }) => theme.colors.textPrimary};
    font-weight: 700;
  }
  .infoOverlay {
    position: absolute;
    width: 100%;
    height: 100%;
    color: ${({ theme }) => theme.colors.textPrimary};
    background: rgba(0, 0, 0, 0.5);
    padding: 1em;
    font-weight: 700;
    transition: 0.2s ease all;
    opacity: 0;
  }
  .linkOverlay {
    position: absolute;
    top: 0;
    opacity: 0;
    transition: 0.2s ease all;
    right: 0;
    padding-top: 0.75em;
    padding-right: 0.75em;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 1.25em;
    color: ${({ theme }) => theme.colors.textPrimary};
  }
`;

const ItemList = styled.div`
  display: grid;
  grid-gap: 1em;
  grid-template-columns: repeat(auto-fill, minmax(12em, 1fr));
  grid-auto-rows: 12em;
  ${breakpoints.lessThan("48")`
    grid-template-columns: repeat(auto-fill, minmax(8em, 1fr));
    grid-auto-rows: 8em;
  `};
  /* grid-template-rows: repeat(auto-fill, minmax(10em, 1fr)); */
`;

const ArtistsDisplay = styled(Element)`
  && {
    display: block;
  }
  grid-area: artists;
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

export default TopArtistsWrapper;
