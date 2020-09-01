import React, { useState } from "react";
import { useParams } from "react-router-dom";
import Header from "../../shared/Header";
import Footer from "../../shared/Footer";
import ComponentWithLoadingState from "../../shared/ComponentWithLoadingState";
import StandardMainContentWrapper from "../../shared/StandardMainContentWrapper";
import StandardInnerContentWrapper from "../../shared/StandardInnerContentWrapper";
import useComparifyPage from "../../../hooks/useComparifyPage";
import Comparify from "../Comparify";
import styled from "styled-components";
import { Transition } from "react-transition-group";
import ComparifyPreview from "../ComparifyPreview";

const AuthenticatedComparePage = () => {
  const { comparifyPageID } = useParams();
  const [showComparison, setShowComparison] = useState(false);
  const [showPreview, setShowPreview] = useState(true);
  const [enableCompareButton, setEnableCompareButton] = useState(false);
  const comparifyPage = useComparifyPage(comparifyPageID);

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
                    <>
                      <ComparifyPreview
                        comparifyPage={comparifyPage}
                        setEnableCompareButton={setEnableCompareButton}
                        setShowPreview={setShowPreview}
                      />
                    </>
                  ) : (
                    <h2>
                      No such page exists yet! {comparifyPageID}; want to claim
                      it?
                    </h2>
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
  /* ${({ state }) =>
    state === "exiting" ? `transform: scale(0.7); opacity: 0;` : ``}; */
`;

const ComparifyDisplayLoadGroup = styled.div<{ state: string }>`
  transition: 0.5s ease all;
  width: 100%;
  ${({ state }) =>
    state === "entered"
      ? `opacity: 1; transform: scale(1);`
      : `transform: scale(0.7); opacity: 0;`};
  /* ${({ state }) => (state === "exiting" || state === `exited` ? `` : ``)}; */
`;

const ComparePageBreadcrumb = styled.div`
  font-size: 1.75rem;
  margin-bottom: 1em;
  letter-spacing: 1px;
  opacity: 0.5;
  font-weight: 300;
  font-family: "roboto slab", "open sans", "sans-serif";
  color: ${({ theme }) => theme.colors.textTertiary};
  span {
    color: ${({ theme }) => theme.colors.textPrimary};
  }
`;

const ComparePageWrapper = styled(StandardInnerContentWrapper)`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  flex-grow: 1;
`;

export default AuthenticatedComparePage;
