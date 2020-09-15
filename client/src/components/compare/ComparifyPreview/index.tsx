import React, { useState, useEffect } from "react";
import axios from "axios";
import { DEV_URL } from "../../../constants";
import { ComparifyPage } from "../../../hooks/useComparifyPage";
import styled from "styled-components";
import ErrorComp from "../../shared/ErrorComp";
import ContentLoader from "react-content-loader";
import { APIError } from "../../../models";
import { breakpoints, theme } from "../../../theme";
import * as QueryString from "query-string";
import { useMedia } from "react-use";
import { MdShare, MdDelete, MdClose } from "react-icons/md";
import { Transition } from "react-transition-group";
import copyToClipboard from "../../../utils/copyToClipboard";
import SlidingAlert from "../../shared/SlidingAlert";
import Modal from "react-modal";
import Loader from "../../Loader";
import { useHistory } from "react-router-dom";
import ComparifyInfo from "../../shared/ComparifyInfo";

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
  setShowPreview: (val: boolean) => void;
  isAuthenticated?: boolean;
};

const ComparifyProfilePlaceholder = () => {
  const isSmall = useMedia("(max-width: 42em)");
  return isSmall ? (
    <ContentLoader
      speed={2}
      width={550}
      height={460}
      viewBox="0 0 240 460"
      backgroundColor="#1a1c1e"
      foregroundColor="#212325"
    >
      <rect x="0" y="0" rx="10" ry="10" width="240" height="30" />
      <rect x="0" y="40" rx="10" ry="10" width="240" height="240" />
      <rect x="0" y="300" rx="10" ry="10" width="240" height="60" />
      <rect x="0" y="400" rx="10" ry="10" width="240" height="60" />
    </ContentLoader>
  ) : (
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
};

Modal.setAppElement("#root");

const ComparifyPreview = ({
  comparifyPage,
  setShowPreview,
  isAuthenticated,
}: ComparifyPreviewProps) => {
  const [isLoading, setIsLoading] = useState(true);
  const [apiError, setApiError] = useState<null | APIError>(null);
  const [profileData, setProfileData] = useState<null | SpotifyUserProfile>(
    null
  );
  const [showCopyAlert, setShowCopyAlert] = useState(false);
  const [showErrorAlert, setShowErrorAlert] = useState(false);
  const [currentUserID, setCurrentUserID] = useState<null | string>(null);
  const [deleteModalIsOpen, setDeleteModalIsOpen] = useState(false);
  const [infoModalIsOpen, setInfoModalIsOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [slidingErrorMessage, setSlidingErrorMessage] = useState<null | string>(
    null
  );
  let history = useHistory();

  const openDeleteModal = () => {
    setDeleteModalIsOpen(true);
  };

  const closeDeleteModal = () => {
    setDeleteModalIsOpen(false);
  };

  const openInfoModal = () => {
    setInfoModalIsOpen(true);
  };

  const closeInfoModal = () => {
    setInfoModalIsOpen(false);
  };

  const handleCopyClick = () => {
    copyToClipboard(`https://www.comparify.io/${comparifyPage.id}`);
    setShowCopyAlert(true);
  };

  const modalStyles = {
    overlay: {
      backgroundColor: "rgba(0,0,0,0.75)",
    },
    content: {
      top: "50%",
      left: "50%",
      right: "auto",
      bottom: "auto",
      marginRight: "-50%",
      transform: "translate(-50%, -50%)",
      maxWidth: "90%",
      backgroundColor: theme.colors.bodyBg,
      border: `1px solid ${theme.colors.darkBodyOverlayBorder}`,
    },
  };

  useEffect(() => {
    const getUserProfile = async () => {
      try {
        const { data } = await axios.get(
          `${DEV_URL}/api/get/public/user-info/${
            comparifyPage.data!.creator._id
          }`
        );
        const { data: userData } = await axios.get(
          `${DEV_URL}/api/get/current-user-id`,
          {
            withCredentials: true,
          }
        );
        setCurrentUserID(userData.id);
        setProfileData(data);
      } catch (error) {
        setApiError({
          isError: true,
          status: error.response.data.status,
          message: error.response.data.message,
        });
        setIsLoading(false);
      }
      setIsLoading(false);
    };
    getUserProfile();
  }, [comparifyPage]);

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

  const handleDeleteClick = async () => {
    setIsDeleting(true);
    try {
      const res = await axios.delete(`${DEV_URL}/api/delete`, {
        withCredentials: true,
        data: {
          comparifyPageName: comparifyPage.id,
        },
      });
      if (res.data.status === "200") {
        history.push("/home?deleted=true");
      }
    } catch (error) {
      setDeleteModalIsOpen(false);
      setShowErrorAlert(true);
      setSlidingErrorMessage(error.response.data.message);
    }

    setIsDeleting(false);
  };

  return (
    <>
      <Transition
        in={showErrorAlert}
        timeout={1500}
        onEntered={() => setTimeout(() => setShowErrorAlert(false), 1000)}
      >
        {(state) => (
          <SlidingAlert error state={state}>
            {slidingErrorMessage}
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
      <ProfileWrap>
        {isLoading ? (
          <ComparifyProfilePlaceholder />
        ) : profileData ? (
          <>
            <ComparePageBreadcrumb>
              comparify.io/<span>{comparifyPage.id}</span>
            </ComparePageBreadcrumb>
            {profileData.images && profileData.images.length > 0 ? (
              <>
                <ProfileImage>
                  <img alt={profileData.name} src={profileData.images[0].url} />
                </ProfileImage>
              </>
            ) : null}

            <ProfileName>
              <h1>{profileData.name}</h1>
            </ProfileName>

            {comparifyPage.data!.creator._id === currentUserID ? (
              <CurrentUserPageDisplay>
                <h3>This is your Comparify page.</h3>
                <UserProfileButtons>
                  <AnimatedActionBtn onClick={handleCopyClick}>
                    <span className="icon">
                      <MdShare />
                    </span>
                    Share
                  </AnimatedActionBtn>
                  <DeletePageBtn onClick={openDeleteModal}>
                    <span className="icon">
                      <MdDelete />
                    </span>
                    Delete
                  </DeletePageBtn>
                </UserProfileButtons>
                <InfoBtn onClick={openInfoModal}>How does this work?</InfoBtn>
                <Modal
                  isOpen={deleteModalIsOpen}
                  onRequestClose={closeDeleteModal}
                  shouldCloseOnOverlayClick
                  style={modalStyles}
                >
                  <DeletingSpinner isDeleting={isDeleting}>
                    <Loader label={false} />
                  </DeletingSpinner>
                  <p
                    style={{
                      fontWeight: 700,
                      fontSize: "1.25em",
                      marginBottom: "0.8em",
                      textAlign: "center",
                    }}
                  >
                    Are you sure you want to delete your Comparify page?
                  </p>
                  <p
                    style={{
                      color: theme.colors.textTertiary,
                      textAlign: "center",
                    }}
                  >
                    This action cannot be undone. You can, however, create a new
                    page afterwards.
                  </p>
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    <DeletePageBtn onClick={handleDeleteClick}>
                      <span className="icon">
                        <MdDelete />
                      </span>
                      Delete
                    </DeletePageBtn>
                    <CancelBtn onClick={closeDeleteModal}>Cancel</CancelBtn>
                  </div>
                </Modal>
                <Modal
                  isOpen={infoModalIsOpen}
                  onRequestClose={closeInfoModal}
                  shouldCloseOnOverlayClick
                  style={modalStyles}
                >
                  <ModalCloseButton onClick={closeInfoModal}>
                    <MdClose />
                  </ModalCloseButton>
                  <ComparifyInfo stepsOnly authenticated />
                </Modal>
              </CurrentUserPageDisplay>
            ) : (
              <CompareBtnWrap>
                {isAuthenticated ? (
                  <AnimatedActionBtn onClick={() => setShowPreview(false)}>
                    Comparify
                  </AnimatedActionBtn>
                ) : (
                  <>
                    <p>To compare music:</p>
                    <AnimatedActionBtn
                      href={`${DEV_URL}/api/auth/login?${QueryString.stringify({
                        redir: comparifyPage.id,
                      })}`}
                    >
                      Log in with Spotify
                    </AnimatedActionBtn>
                  </>
                )}
              </CompareBtnWrap>
            )}
          </>
        ) : (
          `Oops, there was an error loading this profile 🤕`
        )}
      </ProfileWrap>
    </>
  );
};

const ModalCloseButton = styled.button`
  position: absolute;
  top: 0.5em;
  right: 0.5em;
  font-size: 2rem;
`;

const DeletingSpinner = styled.div<{ isDeleting: boolean }>`
  position: absolute;
  z-index: 3;
  opacity: 0;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(255, 255, 255, 0.4);
  transition: 0.5s ease all;
  ${({ isDeleting }) =>
    isDeleting ? `display: block; opacity: 1;` : `display: none;`}
`;

const CancelBtn = styled.a`
  margin-left: 1em;
  font-family: "open sans", "sans-serif";
  font-size: 1.25rem;
  &:hover {
    text-decoration: underline;
  }
  margin-top: 1em;
  display: inline-flex;
`;

const DeletePageBtn = styled.a`
  margin-top: 1em;
  .icon {
    font-size: 1em;
    margin-right: 0.5em;
    display: flex;
    align-items: center;
  }
  padding: 0.5em 1em 0.625em;
  border-radius: 0.25em;
  border: 0;
  font-family: "open sans", "sans-serif";
  font-size: 1.25rem;
  ${breakpoints.lessThan("48")`
    font-size: 1rem;
  `}

  font-weight: 700;
  outline: 0;
  display: inline-flex;
  background: ${({ theme }) => theme.colors.darkBodyOverlayBorder};
  &:hover {
    background: ${({ theme }) => theme.colors.errorRed};
  }
  ${breakpoints.lessThan("66")`
    background: ${({ theme }) => theme.colors.errorRed};
    opacity: 0.8;
  `}
`;
export const AnimatedActionBtn = styled.a`
  text-align: center;
  .icon {
    font-size: 1em;
    margin-right: 0.5em;
    display: flex;
    align-items: center;
  }
  padding: 0.5em 1em 0.625em;
  border-radius: 0.25em;
  border: 0;
  font-family: "open sans", "sans-serif";
  font-size: 1.75rem;
  font-weight: 700;
  outline: 0;
  display: inline-flex;
  align-items: center;
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
  ${breakpoints.greaterThan("58")`
    &:before {
      content: "";
      position: absolute;
      z-index: -1;
      border-radius: 0.25em;
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
  `};
`;

const InfoBtn = styled.button`
  font-weight: 600;
  margin-top: 2em;
  &:hover {
    text-decoration: underline;
  }
`;

const UserProfileButtons = styled.div`
  display: flex;
  align-items: center;
  ${DeletePageBtn} {
    margin-left: 1em;
  }
  margin-top: 2em;
`;

const CurrentUserPageDisplay = styled.div`
  display: flex;
  ${AnimatedActionBtn} {
    margin-top: 0.5em;
    ${breakpoints.lessThan("48")`
      font-size: 1.5rem;
    `}
    ${breakpoints.lessThan("38")`
      font-size: 1.25rem;
    `}
  }
  align-items: center;
  justify-content: center;
  flex-direction: column;
  h3 {
    font-family: "open sans", "sans-serif";
    color: ${({ theme }) => theme.colors.textSecondary};
    font-weight: 600;
    font-size: 1.75rem;
    ${breakpoints.lessThan("58")`
      font-size: 1.75rem;
    `};
    ${breakpoints.lessThan("48")`
      font-size: 1.5rem;
    `};
    ${breakpoints.lessThan("38")`
      font-size: 1.25rem;
      margin-bottom: 1em;
    `};
    ${breakpoints.lessThan("30")`
      font-size: 1rem;
    `};
  }
`;

const CompareBtnWrap = styled.div`
  border-radius: 0.5em;
  text-align: center;
  overflow: hidden;
  ${AnimatedActionBtn} {
    margin-top: 0.5em;
    ${breakpoints.lessThan("48")`
      font-size: 1.5rem;
    `}
    ${breakpoints.lessThan("38")`
      font-size: 1.25rem;
    `}
  }
`;

export const ComparePageBreadcrumb = styled.div`
  font-size: 1.75rem;
  margin-bottom: 1em;
  letter-spacing: 1px;
  ${breakpoints.lessThan("48")`
    font-size: 1.5rem;
  `}
  ${breakpoints.lessThan("38")`
    font-size: 1.25rem;
  `}
  font-weight: 500;
  font-family: "open sans", "sans-serif";
  color: ${({ theme }) => theme.colors.textTertiary};
  span {
    font-weight: 700;
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
  height: 16em;
  max-width: 80%;
  width: 16em;
  margin-bottom: 2em;
  img {
    height: 100%;
    width: 100%;
    object-fit: cover;
  }
  ${breakpoints.lessThan("38")`
    height: 14em;
    margin-bottom: 1em;
    width: 14em;
  `};
  ${breakpoints.lessThan("30")`
    height: 10em;
    width: 10em;
  `};
`;

const ProfileName = styled.div`
  margin: 0.5em 0 2em;
  ${breakpoints.lessThan("38")`
    margin-bottom: 1em;
  `}
  h1 {
    font-family: "open sans", "sans-serif";
    font-size: 5rem;
    letter-spacing: -2px;
    color: ${({ theme }) => theme.colors.textPrimary};
    font-weight: 700;
    text-align: center;
    ${breakpoints.lessThan("58")`
      font-size: 4rem;
    `};
    ${breakpoints.lessThan("48")`
      font-size: 3.5rem;
    `};
    ${breakpoints.lessThan("38")`
      font-size: 3rem;
    `};
    ${breakpoints.lessThan("30")`
      font-size: 2.5rem;
    `};
  }
`;

export default ComparifyPreview;
