import React from "react";
import { createGlobalStyle } from "styled-components";
import Header from "../Header";
import { Theme } from "../../theme";

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
    </>
  );
};

export default Home;
