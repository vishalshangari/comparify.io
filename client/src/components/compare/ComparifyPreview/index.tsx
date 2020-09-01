import React, { useState, useEffect } from "react";
import axios from "axios";
import { DEV_URL } from "../../../constants";
import { ComparifyPage } from "../../../hooks/useComparifyPage";
import styled from "styled-components";
import ErrorComp from "../../shared/ErrorComp";
import ContentLoader from "react-content-loader";
import { APIError } from "../../../models";

type SpotifyProfileImage = {
  height: null | number;
  width: null | number;
  url: string;
};

type SpotifyUserProfile = {
  name: string;
  images: SpotifyProfileImage[];
  uri: string;
};

type ComparifyPreviewProps = {
  comparifyPage: ComparifyPage;
  setEnableCompareButton: (val: boolean) => void;
  setShowPreview: (val: boolean) => void;
};

const ComparifyProfilePlaceholder = () => (
  <ContentLoader
    speed={2}
    width={550}
    height={560}
    viewBox="0 0 280 560"
    backgroundColor="#1a1c1e"
    foregroundColor="#212325"
  >
    <rect x="0" y="0" rx="10" ry="10" width="280" height="40" />
    <rect x="0" y="50" rx="10" ry="10" width="280" height="280" />
    <rect x="0" y="360" rx="10" ry="10" width="280" height="80" />
    <rect x="40" y="480" rx="10" ry="10" width="200" height="80" />
  </ContentLoader>
);

const ComparifyPreview = ({
  comparifyPage,
  setEnableCompareButton,
  setShowPreview,
}: ComparifyPreviewProps) => {
  const [isLoading, setIsLoading] = useState(true);
  const [apiError, setApiError] = useState<null | APIError>(null);
  const [profileData, setProfileData] = useState<null | SpotifyUserProfile>(
    null
  );

  useEffect(() => {
    const getUserProfile = async () => {
      try {
        const { data } = await axios.get(
          `${DEV_URL}/api/get/public/user-info/${
            comparifyPage.data!.creator._id
          }`
        );
        setProfileData(data);
      } catch (error) {
        console.log(error);
        setApiError({
          isError: true,
          status: error.response.data.status,
          message: error.response.data.message,
        });
        setIsLoading(false);
      }
      setIsLoading(false);
      setEnableCompareButton(true);
    };
    getUserProfile();
  }, [comparifyPage, setEnableCompareButton]);

  console.log(apiError);
  if (apiError) {
    return (
      <ErrorComp art>
        <span>
          {apiError.status === 404
            ? `This Spotify user no longer exsists.`
            : `There was an error loading this Comparify page, please try again later.`}
        </span>
      </ErrorComp>
    );
  }

  return (
    <ProfileWrap>
      {isLoading ? (
        <ComparifyProfilePlaceholder />
      ) : profileData ? (
        <>
          <ComparePageBreadcrumb>
            comparify.io/<span>{comparifyPage.id}</span>
          </ComparePageBreadcrumb>
          {profileData.images && profileData.images.length > 0 ? (
            <ProfileImage>
              <img alt={profileData.name} src={profileData.images[0].url} />
            </ProfileImage>
          ) : null}

          <ProfileName>{profileData.name}</ProfileName>
          <CompareBtnWrap>
            <CompareBtn onClick={() => setShowPreview(false)}>
              Comparify
            </CompareBtn>
          </CompareBtnWrap>
        </>
      ) : (
        `Oops, there was an error loading this profile 🤕`
      )}
    </ProfileWrap>
  );
};

const CompareBtn = styled.button`
  padding: 0.5em 1em 0.625em;
  border: 0;
  font-family: "roboto slab", "open sans", "sans-serif";
  font-size: 1.75rem;
  color: rgba(255, 255, 255, 0.7);
  font-weight: 500;
  letter-spacing: 1px;
  outline: 0;
  display: inline-block;
  vertical-align: middle;
  -webkit-transform: perspective(1px) translateZ(0);
  transform: perspective(1px) translateZ(0);
  box-shadow: 0 0 1px rgba(0, 0, 0, 0);
  position: relative;
  background: ${({ theme }) => theme.colors.mainAccent};
  -webkit-transition-property: color;
  transition-property: color;
  -webkit-transition-duration: 0.3s;
  transition-duration: 0.3s;
  &:enabled:before {
    content: "";
    position: absolute;
    z-index: -1;
    top: 0;
    bottom: 0;
    left: 0;
    right: 0;
    background: ${({ theme }) => theme.colors.blueCityBlue};
    -webkit-transform: scaleX(0);
    transform: scaleX(0);
    -webkit-transform-origin: 50%;
    transform-origin: 50%;
    -webkit-transition-property: transform;
    transition-property: transform;
    -webkit-transition-duration: 0.3s;
    transition-duration: 0.3s;
    -webkit-transition-timing-function: ease-out;
    transition-timing-function: ease-out;
  }
  &:hover,
  &:focus,
  &:active {
    color: white;
  }
  &:hover:before,
  &:focus:before,
  &:active:before {
    -webkit-transform: scaleX(1);
    transform: scaleX(1);
  }
`;

const CompareBtnWrap = styled.div`
  border-radius: 0.5em;
  overflow: hidden;
`;

const ComparePageBreadcrumb = styled.div`
  font-size: 1.75rem;
  margin-bottom: 1em;
  letter-spacing: 1px;
  opacity: 0.5;
  font-weight: 300;
  font-family: "roboto slab", "open sans", "sans-serif";
  color: ${({ theme }) => theme.colors.textTertiary};
  span {
    color: ${({ theme }) => theme.colors.textPrimary};
  }
`;

const ProfileWrap = styled.div`
  min-height: 320px;
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const ProfileImage = styled.div`
  border-radius: 1em;
  overflow: hidden;
  width: 280px;
  max-width: 100%;
  height: 280px;
  img {
    object-fit: cover;
  }
`;

const ProfileName = styled.div`
  margin: 0.5em 0;
  font-family: "roboto slab", "open sans", "sans-serif";
  font-size: 5rem;
  color: ${({ theme }) => theme.colors.textPrimary};
  font-weight: 700;
  text-align: center;
`;

export default ComparifyPreview;
