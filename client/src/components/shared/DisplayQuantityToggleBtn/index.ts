import styled from "styled-components";
import { breakpoints } from "../../../theme";

export default styled.button<{ show: boolean }>`
  margin-top: 1em;
  display: ${({ show }) => (show ? `flex` : `none`)};
  border-radius: 0.5em;
  border: 1px solid ${({ theme }) => theme.colors.darkBodyOverlayBorder};
  box-shadow: 1px 2px 3px rgb(0, 0, 0, 0.3);
  padding: 1em;
  ${breakpoints.lessThan("74")`
    padding: 0.5em 0.75em;
  `}
  color: ${({ theme }) => theme.colors.textPrimary};
  cursor: pointer;
  background: ${({ theme }) => theme.colors.darkBodyOverlay};
  span {
    margin-left: 0.5em;
    .totalCount {
      color: ${({ theme }) => theme.colors.textTertiary};
    }
  }
`;
