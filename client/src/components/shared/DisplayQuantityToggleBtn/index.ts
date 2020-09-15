import styled from "styled-components";
import { breakpoints } from "../../../theme";

export default styled.button<{ show: boolean }>`
  margin-top: 1em;
  display: ${({ show }) => (show ? `flex` : `none`)};
  align-items: center;
  border-radius: 0.5em;
  font-weight: 600;
  border: 1px solid ${({ theme }) => theme.colors.darkBodyOverlayBorder};
  box-shadow: 1px 2px 3px rgb(0, 0, 0, 0.3);
  padding: 1em;
  ${breakpoints.lessThan("66")`
    width: 100%;
    justify-content: center;
  `};
  ${breakpoints.lessThan("38")`
    font-size: 0.875rem;
  `}
  color: ${({ theme }) => theme.colors.textTertiary};
  &:hover {
    color: ${({ theme }) => theme.colors.textPrimary};
  }
  transition: 0.2s ease all;
  cursor: pointer;
  background: ${({ theme }) => theme.colors.darkBodyOverlay};
  span {
    margin-left: 0.5em;
    .totalCount {
      color: ${({ theme }) => theme.colors.textTertiary};
    }
  }
`;
