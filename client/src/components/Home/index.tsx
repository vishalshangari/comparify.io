import React from "react";
import styled from "styled-components";
import Header from "../shared/Header";
import PersonalData from "../PersonalData";
import Footer from "../shared/Footer";

const Home = () => {
  return (
    <>
      <PersonalData></PersonalData>
      <Footer />
    </>
  );
};

const MainContent = styled.div`
  background: ${({ theme }) => theme.colors.mainContentBg};
`;

export default Home;
