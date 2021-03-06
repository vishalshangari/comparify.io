import React, { useState } from "react";
import { useParams } from "react-router-dom";
import Header from "../../shared/Header";
import Footer from "../../shared/Footer";
import ComponentWithLoadingState from "../../shared/ComponentWithLoadingState";
import StandardMainContentWrapper from "../../shared/StandardMainContentWrapper";
import StandardInnerContentWrapper from "../../shared/StandardInnerContentWrapper";
import ComparifyPreview from "../ComparifyPreview";
import useComparifyPage from "../../../hooks/useComparifyPage";
import { ComparePageBreadcrumb, AnimatedActionBtn } from "../ComparifyPreview";
import styled from "styled-components";
import { breakpoints } from "../../../theme";
import { Helmet } from "react-helmet";

type RouteParams = {
  comparifyPageID: string;
};

const UnauthenticatedComparePage = () => {
  const { comparifyPageID } = useParams<RouteParams>();
  const [, setShowPreview] = useState(true);
  const comparifyPage = useComparifyPage(comparifyPageID);

  document.title = `${comparifyPageID} | Comparify`;

  return (
    <>
      <Helmet>
        <title>{comparifyPageID} | Comparify</title>
        <meta property="og:type" content="website" />
        <meta property="og:title" content={`${comparifyPageID} | Comparify`} />
        <meta property="og:site_name" content="Comparify" />
        <meta
          name="twitter:description"
          property="og:description"
          content="Compare your music taste with me!"
        />
        <meta
          property="twitter:title"
          content={`${comparifyPageID} | Comparify`}
        />
        <meta name="twitter:domain" content="comparify.io" />
        <meta property="twitter:card" content="summary" />
        <meta
          property="og:url"
          content={`https://www.comparify.io/${comparifyPageID}`}
        />
      </Helmet>
      <Header active="compare" standardNav={false} logoOnlyNav />
      <StandardMainContentWrapper>
        <UnauthenticatedComparePageInner>
          <ComponentWithLoadingState
            label={false}
            loading={comparifyPage === null}
          >
            {comparifyPage && comparifyPage.exists ? (
              <ComparifyPreview
                comparifyPage={comparifyPage}
                setShowPreview={setShowPreview}
              />
            ) : (
              <NoComparifyPage>
                <ComparePageBreadcrumb>
                  comparify.io/<span>{comparifyPageID}</span>
                </ComparePageBreadcrumb>
                <h1>This Comparify page does not exist.</h1>
                <AnimatedActionBtn>
                  Log-in with Spotify &amp; claim
                </AnimatedActionBtn>
              </NoComparifyPage>
            )}
          </ComponentWithLoadingState>
        </UnauthenticatedComparePageInner>
      </StandardMainContentWrapper>
      <Footer />
    </>
  );
};

const UnauthenticatedComparePageInner = styled(StandardInnerContentWrapper)`
  flex-grow: 1;
  display: flex;
  flex-direction: column;
`;

export const NoComparifyPage = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  flex-grow: 1;
  h1 {
    margin-bottom: 1em;
    font-family: "open sans", "sans-serif";
    font-size: 4rem;
    letter-spacing: -2px;
    color: ${({ theme }) => theme.colors.textPrimary};
    font-weight: 700;
    text-align: center;
    ${breakpoints.lessThan("58")`
      font-size: 3rem;
    `};
    ${breakpoints.lessThan("48")`
      font-size: 2.5rem;
    `};
    ${breakpoints.lessThan("38")`
      font-size: 2rem;
    `};
    ${breakpoints.lessThan("30")`
      ont-size: 1.5rem;
    `};
  }
`;

export default UnauthenticatedComparePage;
