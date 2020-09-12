import React from "react";
import styled from "styled-components";
import Header from "../shared/Header";
import Footer from "../shared/Footer";
import StandardMainContentWrapper from "../shared/StandardMainContentWrapper";
import ComparifyInfo from "../shared/ComparifyInfo";

const UnauthenticatedCreateComparePage = () => {
  document.title = `Compare | Comparify`;

  return (
    <>
      <Header standardNav={false} logoOnlyNav />

      <StandardMainContentWrapper>
        <CreateWrap>
          <ComparifyInfo />
        </CreateWrap>
      </StandardMainContentWrapper>
      <Footer />
    </>
  );
};

const CreateWrap = styled.div`
  width: 94%;
  position: relative;
  margin: 0 auto;
  display: flex;
  flex-grow: 1;
  flex-direction: column;
`;

export default UnauthenticatedCreateComparePage;
