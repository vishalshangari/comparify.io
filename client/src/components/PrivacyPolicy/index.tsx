import React, { useState } from "react";
import styled from "styled-components";
import Header from "../shared/Header";
import Footer from "../shared/Footer";
import StandardMainContentWrapper from "../shared/StandardMainContentWrapper";
import { breakpoints, theme } from "../../theme";

const PrivacyPolicy = () => {
  document.title = `Privacy Policy  | Comparify`;

  return (
    <>
      <Header standardNav={true} pageTitle={"Privacy"} />
      <StandardMainContentWrapper>
        <PrivacyWrap>
          <PrivacyWrapInner>
            <p>
              Comparify is offered as a service at no cost to those interested
              in using it. This page is intended to inform users regarding our
              policies relating to the collection, use, and storage of
              informaton. By continuing to use the service, you agree to the
              terms outlined herein. All information collected is stored
              securely and will not be used by or otherwise communicated to any
              outside party. The only purpose of information collection as it
              realtes to Comparify is for the provision and improvement of our
              services.
            </p>

            <p>
              At any point, you may{" "}
              <a href={`https://www.spotify.com/us/account/apps/`}>
                revoke Comparify's access to your Spotify account.
              </a>
            </p>
            <h2>Information Collection and Use</h2>
            <p>
              To offer the best experience, we may store some personally
              identifiable information such as a user's Spotify ID, name,
              country, and top artists and tracks. Most of this information is
              publically available through the Spotify API. The only purpose of
              information collection as it realtes to Comparify is for the
              provision and improvement of our services.
            </p>

            <p>
              Comparify leverages Spotify's authentication service for enhanced
              security and transparency. Your Spotify password is only
              maintained by Spotify and is not provided to Comparify when you
              grant access to our application upon logging in. No authentication
              information is stored on our servers.
            </p>
            <h2>Cookies</h2>
            <p>
              Comparify uses cookies to track a user's session in order to
              provide a streamlined browsing experience. In using Spotify's
              authentication service, there may or may not be other cookies
              invovled in the authentication process as reuqired by Spotify. You
              reserve the right to refuse these cookies. If you refuse cookies,
              you may not be able to use some portions of this service.
            </p>
            <h2>Contact</h2>
            <p>
              If you have any further questions and/or concerns, please contact{" "}
              <a href={`mailto:comparifymusic@gmail.com`}>
                comparifymusic@gmail.com
              </a>
              .
            </p>
          </PrivacyWrapInner>
        </PrivacyWrap>
      </StandardMainContentWrapper>
      <Footer />
    </>
  );
};

const PrivacyWrapInner = styled.div`
  max-width: 52em;
`;

const PrivacyWrap = styled.div`
  width: 94%;
  position: relative;
  margin: 0 auto;
  display: flex;
  flex-grow: 1;
  flex-direction: column;
  a {
    background: ${({ theme }) => theme.colors.mainAccent25p};
    border-bottom: 1px solid ${({ theme }) => theme.colors.mainAccent};
    &:hover {
      background: ${({ theme }) => theme.colors.mainAccent};
    }
  }
  p {
    margin-bottom: 2em;
    &:last-child {
      margin: 0;
    }
  }
  h2 {
    font-family: "open sans", "sans-serif";
    font-size: 2rem;
    font-weight: 700;
    margin-bottom: 1em;
  }
`;

export default PrivacyPolicy;
