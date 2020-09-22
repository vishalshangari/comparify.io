import React from "react";
import { MdCompare, MdPersonAdd } from "react-icons/md";
import { ImMusic } from "react-icons/im";
import styled from "styled-components";
import { breakpoints } from "../../../theme";
import { AnimatedActionBtn } from "../../compare/ComparifyPreview";
import { DEV_URL } from "../../../constants";

type ComparifyInfoProps = {
  authenticated?: boolean;
  stepsOnly?: boolean;
};

const ComparifyInfo = ({ authenticated, stepsOnly }: ComparifyInfoProps) => {
  return (
    <ComparifyInfoWrap>
      {!stepsOnly ? (
        <DescriptionBoxGrid>
          <DescriptionBoxInner>
            <div className="descriptionIcon">
              <MdCompare />{" "}
            </div>
            <div className="descriptionText">
              Compare your taste in music with your friends and people around
              the world
            </div>
          </DescriptionBoxInner>
          <DescriptionBoxInner>
            <div className="descriptionIcon">
              <MdPersonAdd />
            </div>
            <div className="descriptionText">
              Create your own, unique, comparify.io page that can be shared with
              anyone easily
            </div>
          </DescriptionBoxInner>
          <DescriptionBoxInner>
            <div className="descriptionIcon">
              <ImMusic />
            </div>
            <div className="descriptionText">
              Discover new music from personalized recommendations
            </div>
          </DescriptionBoxInner>
        </DescriptionBoxGrid>
      ) : null}

      <h2>How it works</h2>
      <DescriptionSteps>
        <div className="descriptionContainer">
          <h3>Create your own</h3>
          <div className="step">
            <div className="number">1</div>
            <div className="description">
              Create your own personalized comparify.io URL.
            </div>
          </div>
          <div className="step">
            <div className="number">2</div>
            <div className="description">Share your page link with anyone.</div>
          </div>
        </div>
        <div className="descriptionContainer">
          <h3>Use a friend's page</h3>
          <div className="step">
            <div className="number">1</div>
            <div className="description">
              Enter a Comparify URL in your browser.
            </div>
          </div>
          <div className="step">
            <div className="number">2</div>
            <div className="description">
              Press <span className="brand">Comparify</span>!
            </div>
          </div>
        </div>
      </DescriptionSteps>
      {authenticated ? null : (
        <DescriptionAction>
          <h3>Get started:</h3>
          <AnimatedActionBtn href={`${DEV_URL}/api/auth/login`}>
            Login with Spotify
          </AnimatedActionBtn>
        </DescriptionAction>
      )}
    </ComparifyInfoWrap>
  );
};

const DescriptionAction = styled.div`
  margin-top: 2em;
  text-align: center;
  p {
    margin-bottom: 1em;
  }
`;

const DescriptionSteps = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  grid-gap: 2em;
  margin-top: 2em;
  .brand {
    color: ${({ theme }) => theme.colors.mainAccent};
    font-weight: 700;
  }
  .step {
    display: flex;
    font-size: 1.25rem;
    margin-bottom: 1em;
    &:last-child {
      margin-bottom: 0;
    }
    align-items: center;
  }
  .number {
    height: 2.5em;
    margin-right: 1em;
    flex: 0 0 2.5em;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    font-weight: 700;
    background: ${({ theme }) => theme.colors.mainAccent};
  }
  .descriptionContainer {
    padding: 2em;
    box-shadow: 1px 2px 3px rgb(0, 0, 0, 0.3);
    background: ${({ theme }) => theme.colors.darkBodyOverlay};
    border-radius: 0.5em;
    border: 1px solid ${({ theme }) => theme.colors.darkBodyOverlayBorder};
    &:hover {
      border: 1px solid rgb(255, 255, 255, 0.25);
    }
    transition: 0.2s ease all;
  }
  ${breakpoints.lessThan("48")`
    grid-template-columns: 1fr;
    grid-gap: 1em;
    .descriptionContainer {
      padding: 1em;
    }
  `}
`;

const ComparifyInfoWrap = styled.div`
  color: ${({ theme }) => theme.colors.textPrimary};
  h2 {
    font-family: "open sans", "sans-serif";
    font-size: 3rem;
    font-weight: 700;
    margin-bottom: 0.5em;
    text-align: center;
  }
  h3 {
    font-family: "open sans", "sans-serif";
    font-size: 2rem;
    font-weight: 700;
    margin-bottom: 1em;
    text-align: center;
  }
  ${breakpoints.lessThan("66")`
    h2 {
      font-size: 2.5rem;
    }
    h3 {
      font-size: 1.5rem;
    }
    && .step {
      font-size: 1rem;
    }
  `}${breakpoints.lessThan("38")`
    h2 {
      font-size: 1.5rem;
    }
    h3 {
      font-size: 1.25rem;
    }
    && .step {
      font-size: 0.875rem;
    }
  `}
`;

const DescriptionBoxGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  grid-gap: 2em;
  margin-bottom: 4em;
  ${breakpoints.lessThan("66")`
    grid-template-columns: 1fr;
    grid-gap: 1em;
    margin-bottom: 2em;
  `}
`;

const DescriptionBoxInner = styled.div`
  /* background: linear-gradient(
    -45deg,
    rgba(190, 57, 0, 0.75),
    rgba(106, 17, 104, 0.75)
  ); */
  background: ${({ theme }) => theme.colors.mainAccent25p};
  &:first-child {
    background: rgba(108, 30, 186, 0.25);
  }
  &:last-child {
    background: rgba(186, 30, 103, 0.25);
  }
  box-shadow: 2px 2px 3px rgb(0, 0, 0, 0.3);
  background-size: 300% 300%;
  background-position: 50%;
  border-radius: 0.25em;
  padding: 1.5em;
  ${breakpoints.lessThan("66")`
    padding: 1em;
  `}
  display: flex;
  height: 100%;
  width: 100%;
  flex-direction: column;
  .descriptionIcon {
    font-size: 3rem;
    display: flex;
    align-items: center;
    justify-content: center;
    margin-bottom: 0.5em;
    color: ${({ theme }) => theme.colors.textPrimary};
  }
  .descriptionText {
    text-align: center;
    color: ${({ theme }) => theme.colors.textPrimary};
    font-weight: 600;
  }
`;

export default ComparifyInfo;
