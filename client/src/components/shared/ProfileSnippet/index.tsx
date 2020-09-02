import styled from "styled-components";
import { breakpoints } from "../../../theme";

export default styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0.75em;
  font-size: 2rem;
  border-radius: 0.5em;
  .profileImage {
    flex: 0 0 2.25em;
    margin-right: 1em;
    height: 2.25em;
    border-radius: 50%;
    overflow: hidden;
    img {
      height: 100%;
      width: 100%;
      object-fit: cover;
    }
  }
  .userName {
    color: ${({ theme }) => theme.colors.textPrimary};
    font-weight: 700;
    &:hover {
      text-decoration: underline;
    }
  }
  &:last-child {
    background: ${({ theme }) => theme.colors.neonGreen10p};
    box-shadow: 4px 4px 0 0 ${({ theme }) => theme.colors.neonGreen};
  }
  &:first-child {
    box-shadow: 4px 4px 0 0 ${({ theme }) => theme.colors.iris};
    background: ${({ theme }) => theme.colors.iris10p};
    /* .userName {
      order: 1;
      text-align: right;
    }
    .profileImage {
      order: 2;
      margin-left: 1em;
      margin-right: 0;
    } */
  }
  ${breakpoints.lessThan("66")`
    font-size: 1.5rem;
    .userName {
    }
    .profileImage {

    }
  `}
`;
