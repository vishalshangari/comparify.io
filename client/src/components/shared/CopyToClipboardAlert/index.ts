import styled from "styled-components";

export default styled.div<{ state: string }>`
  position: absolute;
  display: inline-block;
  top: 1em;
  left: 50%;
  font-weight: 700;
  font-size: 1.25rem;
  border-radius: 0.25em;
  transition: 0.5s ease all;
  transform: translateX(-50%);
  background: ${({ theme }) => theme.colors.mainAccent50p};
  color: ${({ theme }) => theme.colors.textPrimary};
  padding: 1em;
  ${({ state }) =>
    state === `entering` || state === `entered`
      ? `top: 1em; opacity: 1`
      : `top: 0; transform: translate(-50%, -100%); opacity: 0`};
`;
