import React from "react";
import styled from "styled-components";

const Footer = () => {
  const date = new Date();
  return (
    <FooterWrap>
      <FooterInner>
        <Copyright>&copy; Comparify {date.getFullYear()}</Copyright>
        <FooterLinks>
          <a href="/">Terms and Conditions</a>
          <a href="/">Submit Feedback ♥</a>
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
`;

const FooterWrap = styled.div`
  position: relative;
  padding: 2em 0;
  border-top: 1px solid ${({ theme }) => theme.colors.darkBodyOverlay};
`;

export default Footer;
