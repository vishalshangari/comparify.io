import React from "react";
import { useParams } from "react-router-dom";
import Header from "../../shared/Header";
import Footer from "../../shared/Footer";
import ComponentWithLoadingState from "../../shared/ComponentWithLoadingState";
import StandardMainContentWrapper from "../../shared/StandardMainContentWrapper";
import StandardInnerContentWrapper from "../../shared/StandardInnerContentWrapper";
import useComparifyPage from "../../../hooks/useComparifyPage";

const UnauthenticatedComparePage = () => {
  const { comparifyPageID } = useParams();
  const comparifyPage = useComparifyPage(comparifyPageID);

  return (
    <>
      <Header standardNav={true} pageTitle={`Compare`} />
      <StandardMainContentWrapper>
        <StandardInnerContentWrapper>
          <ComponentWithLoadingState
            label={false}
            loading={comparifyPage === null}
          >
            {comparifyPage && comparifyPage.exists ? (
              <h2>
                compare page: {comparifyPageID} exists! create account / login
                and compare
              </h2>
            ) : (
              <h2>
                Oops, no such page /{comparifyPageID} exists! want to claim it?
              </h2>
            )}
          </ComponentWithLoadingState>
        </StandardInnerContentWrapper>
      </StandardMainContentWrapper>
      <Footer />
    </>
  );
};

export default UnauthenticatedComparePage;
