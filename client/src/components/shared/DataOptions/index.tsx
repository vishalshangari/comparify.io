import styled from "styled-components";
import { breakpoints } from "../../../theme";

export const DataOptions = styled.div`
  border-radius: 0.5em;
  overflow: hidden;
  display: flex;
  border: 1px solid ${({ theme }) => theme.colors.darkBodyOverlayBorder};
  box-shadow: 1px 2px 3px rgb(0, 0, 0, 0.3);
  div {
    padding: 1em;
    ${breakpoints.lessThan("74")`
      padding: 0.5em 0.75em;
    `}
    color: ${({ theme }) => theme.colors.textPrimary};
    cursor: pointer;
    min-width: 80px;
    text-align: center;
  }
`;

export const DataButton = styled.div<{ active: boolean }>`
  background: ${({ active, theme }) =>
    active ? `rgb(255, 255, 255, 0.2)` : theme.colors.darkBodyOverlay};
`;
