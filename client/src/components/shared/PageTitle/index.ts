import styled from "styled-components";

export const PageTitle = styled.div`
  width: 100%;
  position: absolute;
  margin: -5em auto 0;
  h1 {
    color: ${({ theme }) => theme.colors.textPrimary};
    font-size: 6rem;
    z-index: 3;
    display: inline-block;
    line-height: 1.3;
    border-bottom: 8px solid ${({ theme }) => theme.colors.mainAccent};
  }
`;

export const PageTitleInner = styled.div`
  width: 94%;
  margin: 0 auto;
  /* max-width: 1500px; */
`;
