import React, { useState, useEffect } from "react";
import { useParams, useLocation } from "react-router-dom";
import Header from "../../shared/Header";
import Footer from "../../shared/Footer";
import ComponentWithLoadingState from "../../shared/ComponentWithLoadingState";
import StandardMainContentWrapper from "../../shared/StandardMainContentWrapper";
import StandardInnerContentWrapper from "../../shared/StandardInnerContentWrapper";
import useComparifyPage from "../../../hooks/useComparifyPage";
import Comparify from "../Comparify";
import styled from "styled-components";
import { Transition } from "react-transition-group";
import * as QueryString from "query-string";
import { ComparePageBreadcrumb } from "../ComparifyPreview";
import ComparifyPreview, { AnimatedActionBtn } from "../ComparifyPreview";
import { NoComparifyPage } from "../UnauthenticatedComparePage";

const AuthenticatedComparePage = () => {
  const { comparifyPageID } = useParams();
  const location = useLocation();
  const [showComparison, setShowComparison] = useState(false);
  const [showPreview, setShowPreview] = useState(true);
  const comparifyPage = useComparifyPage(comparifyPageID);

  const performComparison = QueryString.parse(location.search);

  useEffect(() => {
    if (performComparison["compare"] === "true") {
      setShowPreview(false);
    }
  }, [performComparison]);

  document.title = `${comparifyPageID} | Comparify`;

  return (
    <>
      <Header standardNav={false} logoOnlyNav />
      <StandardMainContentWrapper>
        <ComparePageWrapper>
          <Transition
            in={showPreview}
            timeout={500}
            onExited={() => setShowComparison(true)}
            unmountOnExit
          >
            {(state) => (
              <ComparifyPreviewLoadGroup state={state}>
                <ComponentWithLoadingState
                  label={false}
                  loading={comparifyPage === null}
                >
                  {comparifyPage && comparifyPage.exists ? (
                    <ComparifyPreview
                      isAuthenticated
                      comparifyPage={comparifyPage}
                      setShowPreview={setShowPreview}
                    />
                  ) : (
                    <NoComparifyPage>
                      <ComparePageBreadcrumb>
                        comparify.io/<span>{comparifyPageID}</span>
                      </ComparePageBreadcrumb>
                      <h1>This Comparify page does not exist.</h1>
                      <AnimatedActionBtn
                        href={`/compare?name=${comparifyPageID}`}
                      >
                        Claim this page
                      </AnimatedActionBtn>
                    </NoComparifyPage>
                  )}
                </ComponentWithLoadingState>
              </ComparifyPreviewLoadGroup>
            )}
          </Transition>
          <Transition
            mountOnEnter
            in={showComparison}
            timeout={100}
            onEntered={() => setShowComparison(true)}
          >
            {(state) => (
              <ComparifyDisplayLoadGroup state={state}>
                <Comparify pageID={comparifyPageID} />
              </ComparifyDisplayLoadGroup>
            )}
          </Transition>
        </ComparePageWrapper>
      </StandardMainContentWrapper>
      <Footer />
    </>
  );
};

const ComparifyPreviewLoadGroup = styled.div<{ state: string }>`
  display: flex;
  flex-direction: column;
  align-items: center;
  transition: 0.5s ease-in all;
  ${({ state }) =>
    state === "entered" || state === `entering`
      ? `opacity: 1;`
      : `transform: scale(0.8); opacity: 0;`};
`;

const ComparifyDisplayLoadGroup = styled.div<{ state: string }>`
  transition: 0.5s ease all;
  width: 100%;
  ${({ state }) =>
    state === "entered"
      ? `opacity: 1; transform: scale(1);`
      : `transform: scale(0.7); opacity: 0;`};
`;

const ComparePageWrapper = styled(StandardInnerContentWrapper)`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  flex-grow: 1;
`;

export default AuthenticatedComparePage;
