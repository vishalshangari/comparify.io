import React from "react";
import styled from "styled-components";
import ComparifyLogo from "../ComparifyLogo";
import { theme } from "../../theme";

const Header = () => {
  return (
    <HeaderWrap>
      <Navigation>
        <HeaderInner>
          <HeaderDisplay>
            <ul>
              <li>
                <a className="nav" href="#">
                  Compare
                </a>
              </li>
              <li>
                <a className="nav" href="#">
                  My Account
                </a>
              </li>
            </ul>
            <ComparifyLogo color={theme.colors.textPrimary} size="1.5rem" />
          </HeaderDisplay>
        </HeaderInner>
      </Navigation>
      <HeaderInner>
        <MainTitle>
          <h1>Hi, Vishal</h1>
        </MainTitle>
      </HeaderInner>
    </HeaderWrap>
  );
};

const HeaderDisplay = styled.div`
  float: right;
  display: flex;
  align-items: center;
`;

const Navigation = styled.div`
  background: ${({ theme }) => theme.colors.navigationBg};
  overflow: hidden;
  padding: 2rem 0;
  border-bottom: 1px solid rgb(255, 255, 255, 0.07);
  ul {
    display: flex;
  }
  li {
    margin-right: 2em;
  }

  a.nav {
    font-weight: 600;
    transition: 0.2s ease all;
    color: ${({ theme }) => theme.colors.textPrimary};
    padding-bottom: 0.25em;
    opacity: 0.7;
    border-bottom: 1px solid transparent;
    &:hover {
      opacity: 1;
      border-bottom: 1px solid ${({ theme }) => theme.colors.mainAccent};
    }
  }
`;

const MainTitle = styled.div`
  margin-top: -4rem;
  h1 {
    color: ${({ theme }) => theme.colors.textPrimary};
    font-size: 5rem;
    z-index: 3;
    position: relative;
    display: inline-block;
    line-height: 1.3;
    border-bottom: 6px solid ${({ theme }) => theme.colors.mainAccent};
  }
`;

const HeaderInner = styled.div`
  width: 94%;
  max-width: ${({ theme }) => theme.maxWidth};
  margin: 0 auto;
`;

const HeaderWrap = styled.header`
  position: relative;
  /* Header media queries */
`;

export default Header;
