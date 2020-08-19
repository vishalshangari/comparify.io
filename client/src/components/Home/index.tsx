import React from "react";
import styled, { createGlobalStyle } from "styled-components";
import Header from "../Header";
import { Theme } from "../../theme";
import PersonalData from "../PersonalData";

const GlobalStyle = createGlobalStyle<{ theme: Theme }>`
  body {
    background: ${({ theme }) => theme.colors.darkBodyBg};
  }
`;

const Home = () => {
  return (
    <>
      <GlobalStyle />
      <Header />
      <MainContent>
        <PersonalData></PersonalData>
      </MainContent>
    </>
  );
};

const MainContent = styled.div`
  width: 94%;
  max-width: 1500px;
  margin: 0 auto;
`;

export default Home;
