import React from "react";
import styled from "styled-components";
import { breakpoints } from "../../../theme";

const Footer = () => {
  const date = new Date();
  return (
    <FooterWrap>
      <FooterInner>
        <Copyright>&copy; Comparify {date.getFullYear()}</Copyright>
        <FooterLinks>
          <a href="/">Terms and Conditions</a>
          <a href="/feedback">
            Submit Feedback{" "}
            <span role="img" aria-label="emoji">
              ♥️
            </span>
          </a>
        </FooterLinks>
      </FooterInner>
    </FooterWrap>
  );
};

const FooterLinks = styled.div`
  a {
    padding-bottom: 0.25em;
    border-bottom: 1px solid transparent;
    &:hover {
      color: ${({ theme }) => theme.colors.textPrimary};
      border-bottom: 1px solid ${({ theme }) => theme.colors.textPrimary};
    }
    transition: 0.2s ease all;
    margin-right: 2em;
    &:last-child {
      margin-right: 0;
    }
    span {
      font-size: 0.75em;
      opacity: 0.75;
    }
  }
`;

const Copyright = styled.div``;

const FooterInner = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 94%;
  margin: 0 auto;
  color: ${({ theme }) => theme.colors.textTertiary};
  ${breakpoints.lessThan("48")`
    font-size: 0.875rem;
    justify-content: center;
    flex-wrap: wrap;
    > div {
      flex-basis: 100%;
      text-align: center;
    }
    ${FooterLinks} {
      margin-top: 1em;
      a {
        display: block;
        margin: 0;
        &:first-child {
          margin-bottom: 1em;
        }
        border: none;
        &:hover {
          border: none;
          text-decoration: underline;
        }
      }
    }
  `};
`;

const FooterWrap = styled.div`
  position: relative;
  padding: 2em 0;
  ${breakpoints.lessThan("48")`
    padding: 1em 0;
  `};
  border-top: 1px solid ${({ theme }) => theme.colors.darkBodyOverlay};
`;

export default Footer;
