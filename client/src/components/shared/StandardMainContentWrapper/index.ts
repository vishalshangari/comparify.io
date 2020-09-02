import styled from "styled-components";
import { breakpoints } from "../../../theme";

export default styled.div`
  flex-grow: 1;
  display: flex;
  flex-direction: column;
  padding: 4em 0;
  ${breakpoints.lessThan("66")`
    padding: 2em 0;
  `}
  background: ${({ theme }) => theme.colors.mainContentBg};
`;
