import React from "react";
import styled from "styled-components";
import { breakpoints } from "../../../theme";

type SlidingAlertProps = {
  state: string;
  children: React.ReactNode;
  error?: boolean;
};

const SlidingAlert = ({ state, children, error }: SlidingAlertProps) => (
  <StyledAlert error={error} state={state}>
    {children}
  </StyledAlert>
);

const StyledAlert = styled.div<{ state: string; error?: boolean }>`
  position: fixed;
  z-index: 12;
  display: inline-block;
  top: 1em;
  left: 50%;
  font-weight: 600;
  font-size: 1rem;
  ${breakpoints.lessThan("38")`
    font-size: 0.875rem;
  `}
  border-radius: 0.25em;
  transition: 0.5s ease all;
  transform: translateX(-50%);
  background: rgba(119, 19, 117);
  ${({ error, theme }) =>
    error ? `background: ${theme.colors.errorRed};` : ``};
  border: 1px solid rgba(255, 255, 255, 0.5);
  box-shadow: 2px 2px 3px rgba(0, 0, 0, 0.3);
  color: ${({ theme }) => theme.colors.textPrimary};
  padding: 1em;
  ${({ state }) =>
    state === `entering` || state === `entered`
      ? `top: 1em; opacity: 1`
      : `top: 0; transform: translate(-50%, -100%); opacity: 0`};
`;

export default SlidingAlert;
