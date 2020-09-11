import React from "react";
import Header from "../shared/Header";
import Footer from "../shared/Footer";
import StandardMainContentWrapper from "../shared/StandardMainContentWrapper";
import ErrorComp from "../shared/ErrorComp";
import { Helmet } from "react-helmet";

const FourZeroFour = () => {
  return (
    <>
      <Helmet>
        <title>404 - Not Found | Comparify</title>
      </Helmet>
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
