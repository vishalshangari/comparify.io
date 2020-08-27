import React from "react";
import styled from "styled-components";
import ComparifyLogo from "../../ComparifyLogo";
import { theme } from "../../../theme";
import { RESPONSE_CODES } from "../../../constants";
import { useAuthState } from "../../../App";

type HeaderProps = {
  pageTitle?: string;
  standardNav: boolean;
  logoOnlyNav?: boolean;
  loading?: boolean;
};

const Header = ({
  pageTitle,
  standardNav,
  loading,
  logoOnlyNav,
}: HeaderProps) => {
  const { state: authState } = useAuthState();
  const isAuthenticated = authState.status === RESPONSE_CODES.AUTHENTICATED;

  return (
    <HeaderWrap>
      <HeaderInner>
        {pageTitle ? (
          <StatefulPageTitle loading={loading}>
            <h1>{pageTitle}</h1>
          </StatefulPageTitle>
        ) : null}

        {standardNav ? (
          <Navigation>
            <ul>
              <li>
                <a className="nav" href="/">
                  Compare
                </a>
              </li>
              <li>
                {isAuthenticated ? (
                  <a className="nav" href="/">
                    My Account
                  </a>
                ) : (
                  <a className="nav" href="/">
                    Login
                  </a>
                )}
              </li>
            </ul>
            <ComparifyLogo color={theme.colors.textPrimary} size="1.5rem" />
          </Navigation>
        ) : null}

        {logoOnlyNav ? (
          <LogoOnlyNavWrap>
            <ComparifyLogo color={theme.colors.textPrimary} size="1.5rem" />
            <Navigation>
              <ul>
                <li>
                  <a className="nav" href="/">
                    Compare
                  </a>
                </li>
                <li>
                  {isAuthenticated ? (
                    <a className="nav" href="/">
                      My Account
                    </a>
                  ) : (
                    <a className="nav" href="/">
                      Login
                    </a>
                  )}
                </li>
              </ul>
            </Navigation>
          </LogoOnlyNavWrap>
        ) : null}
      </HeaderInner>
    </HeaderWrap>
  );
};

export const StatefulPageTitle = styled(({ loading, ...props }) => (
  <PageTitle {...props} />
))`
  h1 {
    color: ${(props) =>
      props.loading ? theme.colors.textTertiary : theme.colors.textPrimary};
  }
`;

export const PageTitle = styled.div<{ loading?: boolean }>`
  flex: 1 1 auto;
  h1 {
    /* color: ${({ loading, theme }) =>
      loading ? theme.colors.textTertiary : theme.colors.textPrimary}; */
    font-size: 6rem;
    font-weight: 500;
    z-index: 3;
    display: inline-block;
    line-height: 1.3;
    border-bottom: 8px solid ${({ theme }) => theme.colors.mainAccent};
  }
`;

const Navigation = styled.div`
  overflow: hidden;
  flex: 0 0 auto;
  display: flex;
  align-items: center;
  ul {
    display: flex;
    padding: 1em 1.5em;
    border: 1px solid ${({ theme }) => theme.colors.darkBodyOverlay};
    border-radius: 0.25em;
    background: ${({ theme }) => theme.colors.mainContentBg};
    margin-right: 2em;
  }
  li {
    margin-right: 2em;
    &:last-child {
      margin-right: 0;
    }
  }

  a.nav {
    font-weight: 600;
    transition: 0.2s ease all;
    color: ${({ theme }) => theme.colors.textTertiary};
    padding-bottom: 0.25em;
    border-bottom: 1px solid transparent;
    &:hover {
      opacity: 1;
      color: ${({ theme }) => theme.colors.textPrimary};
      border-bottom: 2px solid ${({ theme }) => theme.colors.mainAccent};
    }
  }
`;

const LogoOnlyNavWrap = styled.div`
  display: flex;
  width: 100%;
  justify-content: space-between;
  align-items: center;
  padding: 1em 0;
  ${Navigation} {
    ul {
      margin-right: 0;
    }
  }
`;

const HeaderInner = styled.div`
  width: 94%;
  margin: 0 auto;
  display: flex;
  align-items: center;
`;

const HeaderWrap = styled.header`
  position: relative;
  border-bottom: 1px solid ${({ theme }) => theme.colors.darkBodyOverlay};
  /* Header media queries */
`;

export default Header;
