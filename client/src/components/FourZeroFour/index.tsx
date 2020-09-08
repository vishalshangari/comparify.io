import React from "react";
import Header from "../shared/Header";
import Footer from "../shared/Footer";
import StandardMainContentWrapper from "../shared/StandardMainContentWrapper";
import ErrorComp from "../shared/ErrorComp";

const FourZeroFour = () => {
  return (
    <>
      <Header standardNav={false} logoOnlyNav />
      <StandardMainContentWrapper>
        <ErrorComp art>
          We're sorry, we can't find the page you're looking for.
        </ErrorComp>
      </StandardMainContentWrapper>
      <Footer />
    </>
  );
};
export default FourZeroFour;
