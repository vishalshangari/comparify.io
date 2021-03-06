import React, { useState } from "react";
import styled from "styled-components";
import ComparifyLogo from "../../ComparifyLogo";
import { theme, breakpoints } from "../../../theme";
import { RESPONSE_CODES, DEV_URL } from "../../../constants";
import { useAuthState } from "../../../App";
import { Transition } from "react-transition-group";
import axios from "axios";
import { useHistory } from "react-router-dom";

type HeaderProps = {
  pageTitle?: string;
  standardNav: boolean;
  logoOnlyNav?: boolean;
  loading?: boolean;
  active?: string;
};

const Header = ({
  pageTitle,
  standardNav,
  loading,
  logoOnlyNav,
  active,
}: HeaderProps) => {
  const { state: authState, setState: setAuthState } = useAuthState();
  const isAuthenticated = authState.status === RESPONSE_CODES.AUTHENTICATED;
  const [isMobileNavExpanded, setIsMobileNavExpanded] = useState(false);
  let history = useHistory();

  const handleLogOut = async () => {
    try {
      const response = await axios.post(`${DEV_URL}/api/logout`, "logout", {
        withCredentials: true,
      });
      setAuthState({
        status: response.data.status,
        errorType: response.data.errorType,
      });
      history.push("/");
    } catch (error) {
      // TODO: generic error handler -> redirect to error page with query string
    }
  };

  const navLinksToDisplay = (
    <>
      {isAuthenticated ? (
        <li>
          <a
            className={`nav${active === `home` ? ` nav-active` : ``}`}
            href="/home"
          >
            Home
          </a>
        </li>
      ) : null}
      <li>
        <a
          className={`nav${active === `compare` ? ` nav-active` : ``}`}
          href="/compare"
        >
          Compare
        </a>
      </li>
      <li>
        {isAuthenticated ? (
          <button className="nav" onClick={handleLogOut}>
            Logout
          </button>
        ) : (
          <a className="nav" href={`${DEV_URL}/api/auth/login`}>
            Login with Spotify
          </a>
        )}
      </li>
    </>
  );

  const responsiveNav = (
    <>
      <Navigation>
        <ul>{navLinksToDisplay}</ul>
        {logoOnlyNav ? null : (
          <ComparifyLogo color={theme.colors.textPrimary} size="1.75rem" />
        )}
        <MobileNavExpandBtn
          onClick={() => setIsMobileNavExpanded((prev) => !prev)}
        >
          {/* {isMobileNavExpanded ? <VscClose /> : <HiMenu />} */}
          <MobileNavigationHamburger isMobileNavExpanded={isMobileNavExpanded}>
            <span></span>
            <span></span>
            <span></span>
            <span></span>
          </MobileNavigationHamburger>
        </MobileNavExpandBtn>
      </Navigation>
      <Transition in={isMobileNavExpanded} timeout={500}>
        {(state) => (
          <MobileNavigation state={state}>
            <ul>{navLinksToDisplay}</ul>
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
            <ComparifyLogo color={theme.colors.textPrimary} size="1.75rem" />
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
  z-index: 4;
  flex-basis: 100%;
  overflow: hidden;
  background: rgba(0, 0, 0, 0.7);
  width: 100%;
  top: 100%;
  left: 0;
  transition: 0.3s ease-in-out all;
  ${({ state }) =>
    state === "entered" || state === `entering`
      ? `max-height: 14em; opacity: 1;`
      : `max-height: 0px; opacity: 0;`}
  justify-content: flex-end;
  ul {
    margin: 1em 0;
    flex-basis: 300px;
    border: 1px solid ${({ theme }) => theme.colors.darkBodyOverlay};
    border-radius: 0.25em;
    background: ${({ theme }) => theme.colors.mainContentBg};
    overflow: hidden;
  }
  li {
    border-bottom: 1px solid
      ${({ theme }) => theme.colors.darkBodyOverlayBorder};
    &:last-child {
      border-bottom: none;
    }
  }
  .nav {
    display: block;
    padding: 1em;
    font-weight: 600;
    text-align: center;
    width: 100%;
  }
  .nav-active {
    background: ${({ theme }) => theme.colors.mainAccent};
  }
  ${breakpoints.greaterThan("66")`
    display: none;
  `};
`;

const MobileNavExpandBtn = styled.button`
  position: relative;
  margin-left: 1em;
  display: none;
  align-items: center;
  justify-content: center;
  height: calc(2.75em + 2px);
  width: calc(3.25em + 2px);
  border: 1px solid ${({ theme }) => theme.colors.darkBodyOverlay};
  border-radius: 0.25em;
  background: ${({ theme }) => theme.colors.mainContentBg};
  ${breakpoints.lessThan("66")`
    display: inline-flex;
  `};
`;

const MobileNavigationHamburger = styled.div<{ isMobileNavExpanded: boolean }>`
  width: 1.75em;
  height: 1.25em;
  display: block;
  position: absolute;
  top: 0.75em;
  left: 0.75em;
  /* -webkit-transform: rotate(0deg);
  -moz-transform: rotate(0deg);
  -o-transform: rotate(0deg);
  transform: rotate(0deg); */
  -webkit-transition: 0.5s ease-in-out;
  -moz-transition: 0.5s ease-in-out;
  -o-transition: 0.5s ease-in-out;
  transition: 0.5s ease-in-out;
  cursor: pointer;
  span {
    display: block;
    position: absolute;
    height: 0.125em;
    width: 100%;
    background: ${({ theme }) => theme.colors.textPrimary};
    border-radius: 0.125em;
    opacity: 1;
    left: 0;
    -webkit-transform: rotate(0deg);
    -moz-transform: rotate(0deg);
    -o-transform: rotate(0deg);
    transform: rotate(0deg);
    -webkit-transition: 0.25s ease-in-out;
    -moz-transition: 0.25s ease-in-out;
    -o-transition: 0.25s ease-in-out;
    transition: 0.25s ease-in-out;
    &:nth-child(1) {
      top: 0em;
      ${({ isMobileNavExpanded }) =>
        isMobileNavExpanded ? `top: 0.5625em; width: 0%; left: 50%;` : ``}
    }
    &:nth-child(2) {
      top: 0.5625em;
      ${({ isMobileNavExpanded }) =>
        isMobileNavExpanded
          ? `-webkit-transform: rotate(45deg);
            -moz-transform: rotate(45deg);
            -o-transform: rotate(45deg);
            transform: rotate(45deg);`
          : ``}
    }
    &:nth-child(3) {
      top: 0.5625em;
      ${({ isMobileNavExpanded }) =>
        isMobileNavExpanded
          ? `-webkit-transform: rotate(-45deg);
            -moz-transform: rotate(-45deg);
            -o-transform: rotate(-45deg);
            transform: rotate(-45deg);`
          : ``}
    }
    &:nth-child(4) {
      top: 1.125em;
      ${({ isMobileNavExpanded }) =>
        isMobileNavExpanded ? `top: 0.5625em; width: 0%; left: 50%;` : ``}
    }
  }
`;

const Navigation = styled.div`
  overflow: hidden;
  flex: 0 0 auto;
  display: flex;

  align-items: center;
  ul {
    display: flex;
    padding: 0 1.5em;
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
  .nav {
    font-weight: 600;
    margin: 0;
    display: inline-block;
    padding: 1em 0 calc(1em - 2px);
    transition: 0.2s ease all;
    color: ${({ theme }) => theme.colors.textTertiary};
    border-bottom: 2px solid transparent;
    &:hover {
      color: ${({ theme }) => theme.colors.textPrimary};
      border-bottom: 2px solid ${({ theme }) => theme.colors.textPrimary};
    }
  }
  .nav-active {
    color: ${({ theme }) => theme.colors.textPrimary};
    border-bottom: 2px solid ${({ theme }) => theme.colors.mainAccent};
    &:hover {
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
  ${breakpoints.lessThan("66")`

  `};
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
    ul {
      margin-bottom: 0;
    }
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
