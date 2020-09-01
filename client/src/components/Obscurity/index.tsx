import React from "react";
import styled from "styled-components";
import { IoMdInformationCircle } from "react-icons/io";
import { breakpoints } from "../../theme";
import ErrorComp from "../shared/ErrorComp";
import { obscurityLables } from "./constants";
import { ObscurityScoreProps, ObscurityLabelType } from "./models";

const Obscurity = ({ score, scoreOnly }: ObscurityScoreProps) => {
  const getObscurityLabel = (score: number) => {
    if (score <= 10) {
      return obscurityLables.low;
    } else if (score <= 15) {
      return obscurityLables.belowAvg;
    } else if (score <= 30) {
      return obscurityLables.avg;
    } else if (score <= 40) {
      return obscurityLables.aboveAvg;
    } else if (score <= 50) {
      return obscurityLables.strong;
    } else {
      return obscurityLables.veryStrong;
    }
  };

  if (scoreOnly) {
    return (
      <ObscurityScoreDisplay>
        <div className="dataItemInner">
          {score ? (
            <div className="flexGrow">
              <ScoreDisplay>
                <span className="score">{score!}</span>/100
              </ScoreDisplay>
              <ObscurityLabelDisplay obscurityLabel={getObscurityLabel(score)}>
                <span>{getObscurityLabel(score).text}</span>
                <div className="emoji">{getObscurityLabel(score).emoji}</div>
              </ObscurityLabelDisplay>
            </div>
          ) : (
            <ErrorComp>
              <span>There was an error loading your obscurity score.</span>
            </ErrorComp>
          )}
        </div>
      </ObscurityScoreDisplay>
    );
  }

  return (
    <ObscurityScoreDisplay>
      <div className="dataItemHeader">
        <h2>Obscurity</h2>
      </div>
      <div className="dataItemInner">
        {score ? (
          <>
            <div className="flexGrow">
              <ScoreDisplay>
                <span className="score">{score!}</span>/100
              </ScoreDisplay>
              <ObscurityLabelDisplay obscurityLabel={getObscurityLabel(score)}>
                <span>{getObscurityLabel(score).text}</span>
                <div className="emoji">{getObscurityLabel(score).emoji}</div>
              </ObscurityLabelDisplay>
            </div>
            <Description>
              <div className="icon">
                <IoMdInformationCircle />
              </div>
              <p>
                Calculated using time-weighted average popularity scores of your
                top artists and tracks.
              </p>
            </Description>
          </>
        ) : (
          <ErrorComp>
            <span>There was an error loading your obscurity score.</span>
          </ErrorComp>
        )}
      </div>
    </ObscurityScoreDisplay>
  );
};

const ObscurityLabelDisplay = styled.div<{
  obscurityLabel: ObscurityLabelType;
}>`
  text-align: center;
  color: ${({ theme }) => theme.colors.textPrimary};
  font-weight: 700;
  margin: 2em 0 1em;
  ${breakpoints.lessThan("74")`
    margin: 1em 0;
  `}
  font-size: 1.25rem;
  span {
    display: inline-block;
    margin-bottom: 1em;
    background: ${({ obscurityLabel: label }) => label.color};
    padding: 0.75em 1.5em;
    border-radius: 1em;
    text-transform: uppercase;
    ${breakpoints.lessThan("74")`
      font-size: 1rem;
    `}
  }
  .emoji {
    font-size: 2rem;
    ${breakpoints.lessThan("74")`
        font-size: 1.5rem;
    `}
  }
`;
const Description = styled.div`
  background: ${({ theme }) => theme.colors.darkBodyOverlayBorder};
  color: ${({ theme }) => theme.colors.textPrimary};
  padding: 1em;
  border-radius: 0.5em;
  display: flex;
  align-items: center;
  ${breakpoints.lessThan("66")`
    justify-content: center;
  `}
  .icon {
    font-size: 1.5em;
    display: flex;
    align-items: center;
    color: ${({ theme }) => theme.colors.textPrimary};
    margin-right: 0.5em;
  }
  ${breakpoints.lessThan("74")`
      font-size: 0.875rem;
  `}
`;
const ObscurityScoreDisplay = styled.div`
  grid-area: obscurity;
`;
const ScoreDisplay = styled.div`
  text-align: center;
  font-family: ${({ theme }) => theme.fonts.main};
  line-height: 1;
  .score {
    font-size: 8rem;
    font-weight: 700;
    color: ${({ theme }) => theme.colors.textPrimary};
    ${breakpoints.lessThan("74")`
        font-size: 6rem;
    `}
  }
  font-weight: 500;
  letter-spacing: -2px;
  font-size: 4rem;
  color: rgb(255, 255, 255, 0.2);
  ${breakpoints.lessThan("90")`
    font-size: 3rem;
  `}
`;

export default Obscurity;
