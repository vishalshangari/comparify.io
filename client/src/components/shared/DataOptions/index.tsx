import styled from "styled-components";
import { breakpoints } from "../../../theme";

export const DataOptions = styled.div`
  border-radius: 0.5em;
  overflow: hidden;
  display: flex;
  border: 1px solid ${({ theme }) => theme.colors.darkBodyOverlayBorder};
  background: ${({ theme }) => theme.colors.darkBodyOverlay};
  box-shadow: 1px 2px 3px rgb(0, 0, 0, 0.3);
  div {
    padding: 1em;
    ${breakpoints.lessThan("74")`
      padding: 0.75em 1em;
    `}
    cursor: pointer;
    min-width: 80px;
    text-align: center;
  }
`;

export const DataButton = styled.div<{ active: boolean }>`
  background: ${({ active, theme }) =>
    active ? theme.colors.darkBodyOverlayBorder : `transparent`};
  color: ${({ active, theme }) =>
    active ? theme.colors.textPrimary : theme.colors.textTertiary};
  &:hover {
    color: ${({ theme }) => theme.colors.textPrimary};
  }
  transition: 0.2s ease all;
`;
