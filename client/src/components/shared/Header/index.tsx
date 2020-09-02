import React, { useState } from "react";
import styled from "styled-components";
import ComparifyLogo from "../../ComparifyLogo";
import { theme, breakpoints } from "../../../theme";
import { RESPONSE_CODES } from "../../../constants";
import { useAuthState } from "../../../App";
import { HiMenu } from "react-icons/hi";
import { VscClose } from "react-icons/vsc";
import { Transition } from "react-transition-group";

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
  const [isMobileNavExpanded, setIsMobileNavExpanded] = useState(false);

  const responsiveNav = (
    <>
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
        {logoOnlyNav ? null : (
          <ComparifyLogo color={theme.colors.textPrimary} size="1.5rem" />
        )}
        <MobileNavExpand
          onClick={() => setIsMobileNavExpanded((prev) => !prev)}
        >
          {isMobileNavExpanded ? <VscClose /> : <HiMenu />}
        </MobileNavExpand>
      </Navigation>
      <Transition in={isMobileNavExpanded} timeout={500}>
        {(state) => (
          <MobileNavigation state={state}>
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
          </MobileNavigation>
        )}
      </Transition>
    </>
  );

  return (
    <HeaderWrap>
      <HeaderInner>
        <StatefulPageTitle loading={loading}>
          {pageTitle ? <h1>{pageTitle}</h1> : ` `}
        </StatefulPageTitle>

        {standardNav ? responsiveNav : null}

        {logoOnlyNav ? (
          <LogoOnlyNavWrap>
            <ComparifyLogo color={theme.colors.textPrimary} size="1.5rem" />
            {responsiveNav}
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
  ${breakpoints.lessThan("74")`
    h1 {
      font-size: 4rem
    }
  `}
  ${breakpoints.lessThan("42")`
    h1 {
      font-size: 3rem;
    }
  `}
`;

const MobileNavigation = styled.div<{ state: string }>`
  display: none;
  flex-basis: 100%;
  overflow: hidden;
  transition: 0.5s ease all;
  ${({ state }) =>
    state === "entered" || state === `entering`
      ? `max-height: 10em;`
      : `max-height: 0;`}
  ${breakpoints.lessThan("66")`
    display: block;
  `};
  justify-content: flex-end;
  ul {
    margin: 1em 0;
    flex-basis: 300px;
    border: 1px solid ${({ theme }) => theme.colors.darkBodyOverlay};
    border-radius: 0.25em;
    background: ${({ theme }) => theme.colors.mainContentBg};
  }
  li {
    border-bottom: 1px solid
      ${({ theme }) => theme.colors.darkBodyOverlayBorder};
    &:last-child {
      border-bottom: none;
    }
  }
  a.nav {
    display: block;
    padding: 1em;
    font-weight: 600;
    text-align: center;
  }
`;

const MobileNavExpand = styled.button`
  margin-left: 1em;
  display: none;
  align-items: center;
  justify-content: center;
  padding: 0.5em;
  font-size: 1.5rem;
  border: 1px solid ${({ theme }) => theme.colors.darkBodyOverlay};
  border-radius: 0.25em;
  background: ${({ theme }) => theme.colors.mainContentBg};
  ${breakpoints.lessThan("66")`
    display: inline-flex;
  `};
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
    ${breakpoints.lessThan("66")`
    display: none;
  `};
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
  ${breakpoints.lessThan("48")`
    .logoWrap {
      display: none;
    }
  `}
`;

const LogoOnlyNavWrap = styled.div`
  display: flex;
  width: 100%;
  flex-wrap: wrap;
  justify-content: space-between;
  align-items: center;
  padding: 1em 0;
  ${Navigation} {
    ul {
      margin-right: 0;
    }
  }
  .logoWrap {
    flex: 1;
  }
  ${MobileNavigation} {
    flex-basis: 100%;
  }
`;

const HeaderInner = styled.div`
  width: 94%;
  margin: 0 auto;
  display: flex;
  flex-wrap: wrap;
  align-items: center;
`;

const HeaderWrap = styled.header`
  position: relative;
  border-bottom: 1px solid ${({ theme }) => theme.colors.darkBodyOverlay};
  /* Header media queries */
`;

export default Header;
