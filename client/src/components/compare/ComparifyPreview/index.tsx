import React, { useState, useEffect } from "react";
import axios from "axios";
import { DEV_URL } from "../../../constants";
import { ComparifyPage } from "../../../hooks/useComparifyPage";
import ComponentWithLoadingState from "../../shared/ComponentWithLoadingState";
import styled from "styled-components";
import ContentLoader from "react-content-loader";

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
};

const MyLoader = () => (
  <ContentLoader
    speed={2}
    width={550}
    height={480}
    viewBox="0 0 280 480"
    backgroundColor="#1a1c1e"
    foregroundColor="#212325"
  >
    <rect x="0" y="0" rx="10" ry="10" width="280" height="40" />
    <rect x="0" y="50" rx="10" ry="10" width="280" height="280" />
    <rect x="0" y="360" rx="10" ry="10" width="280" height="80" />
  </ContentLoader>
);

const ComparifyPreview = ({
  comparifyPage,
  setEnableCompareButton,
}: ComparifyPreviewProps) => {
  const [isLoading, setIsLoading] = useState(true);
  const [profileData, setProfileData] = useState<null | SpotifyUserProfile>(
    null
  );

  useEffect(() => {
    const getUserProfile = async () => {
      const { data } = await axios.get(
        `${DEV_URL}/api/get/public/user-info/${comparifyPage.data!.creator._id}`
      );
      setProfileData(data);
      setIsLoading(false);
      setEnableCompareButton(true);
    };
    getUserProfile();
  }, []);
  return (
    <ProfileWrap>
      {isLoading ? (
        <MyLoader />
      ) : profileData ? (
        <>
          <ComparePageBreadcrumb>
            comparify.io/<span>{comparifyPage.id}</span>
          </ComparePageBreadcrumb>
          <ProfileImage>
            <img src={profileData.images[0].url} />
          </ProfileImage>
          <ProfileName>{profileData.name}</ProfileName>
        </>
      ) : (
        `Oops, there was an error loading this profile 🤕`
      )}
      {/* <ComponentWithLoadingState label={false} loading={isLoading}> */}

      {/* </ComponentWithLoadingState> */}
    </ProfileWrap>
  );
};

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
