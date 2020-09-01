import React, { useState } from "react";
import styled from "styled-components";
import { ObscurityComparisonProps } from "./models";

import { colors, breakpoints } from "../../../theme";
import { IoMdInformationCircle } from "react-icons/io";
import ProfileSnippet from "../../shared/ProfileSnippet";
import ErrorComp from "../../shared/ErrorComp";
import Obscurity from "../../Obscurity";

const ObscurityComparison = ({
  obscurityComparisonData,
  creatorUserInfo,
  visitorUserInfo,
}: ObscurityComparisonProps) => {
  return (
    <ObscurityGroup>
      {obscurityComparisonData ? (
        <ObscurityGrid>
          <UserObscurityWrap>
            <UserObscurityInner>
              <div className="sectionHeader">
                <span>Your music obscurity</span>
              </div>
              <ObscuritySnippet>
                <Obscurity scoreOnly score={obscurityComparisonData.visitor} />
                {obscurityComparisonData.visitor === 0 ? (
                  <>
                    <div className="obscurityError">
                      This is likely zero because there isn't enough listening
                      history in your Spotify account yet. Try again soon.
                    </div>
                  </>
                ) : null}
              </ObscuritySnippet>
            </UserObscurityInner>
          </UserObscurityWrap>
          <UserObscurityWrap>
            <UserObscurityInner>
              <div className="sectionHeader">
                <span>
                  {creatorUserInfo.displayName.split(" ")[0]}'s music obscurity
                </span>
              </div>
              <ObscuritySnippet>
                <Obscurity scoreOnly score={obscurityComparisonData.creator} />
                {obscurityComparisonData.creator === 0 ? (
                  <>
                    <div className="obscurityError">
                      This is likely zero because there isn't enough listening
                      history in {creatorUserInfo.displayName.split(" ")[0]}'s
                      account yet. Try again soon.
                    </div>
                  </>
                ) : null}
              </ObscuritySnippet>
            </UserObscurityInner>
          </UserObscurityWrap>
        </ObscurityGrid>
      ) : (
        <ErrorComp>
          Oops, there was an error loading analysis of obscurity scores.
        </ErrorComp>
      )}
    </ObscurityGroup>
  );
};

export default ObscurityComparison;

// Obscurity

const ObscuritySnippet = styled(ProfileSnippet)`
  flex-direction: column;
  .obscurityError {
    padding: 1em;
    border-radius: 0.25em;
    background: rgba(255, 255, 255, 0.2);
  }
`;

const UserObscurityWrap = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  &:first-child {
    ${ObscuritySnippet} {
      box-shadow: 4px 4px 0 0 ${({ theme }) => theme.colors.iris};
      background: ${({ theme }) => theme.colors.iris10p};
    }
  }
`;

const UserObscurityInner = styled.div`
  width: 80%;
  display: flex;
  flex-direction: column;
`;

const ObscurityGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  grid-gap: 2em;
`;

const ObscurityGroup = styled.div`
  margin-top: 4em;
  display: flex;
  flex-direction: column;
  justify-content: center;
  .clippedHeading {
    display: inline-block;
    margin: 0 auto;
    h2 {
      margin-bottom: 0;
      display: inline-block;
    }
  }
`;
