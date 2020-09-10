import React from "react";
import styled from "styled-components";
import Header from "../shared/Header";
import Footer from "../shared/Footer";
import StandardMainContentWrapper from "../shared/StandardMainContentWrapper";
import ComparifyInfo from "../shared/ComparifyInfo";
import { breakpoints } from "../../theme";
import { AnimatedActionBtn } from "../compare/ComparifyPreview";

const Feedback = () => {
  document.title = `Feedback  | Comparify`;

  const handleFeedbackSubmit = () => {};

  return (
    <>
      <Header standardNav={true} pageTitle={"Feedback"} />
      <StandardMainContentWrapper>
        <FeedbackWrap>
          <FeedbackInfo>
            Thank you for taking the time to submit feedback. We want to hear
            about your experience.
          </FeedbackInfo>
          <FeedbackForm>
            <label htmlFor="name">
              <span>Name</span>
              <input name="name" type="text" />
            </label>
            <label htmlFor="email">
              <span>E-mail (optional)</span>
              <input name="email" type="text" />
            </label>
            <label htmlFor="message">
              <span>Message</span>
              <textarea cols={32} rows={10} name="message" />
            </label>
          </FeedbackForm>
          <BtnWrap>
            <AnimatedActionBtn>Submit</AnimatedActionBtn>
          </BtnWrap>
        </FeedbackWrap>
      </StandardMainContentWrapper>
      <Footer />
    </>
  );
};

const BtnWrap = styled.div`
  margin-top: 2em;
  display: flex;
  align-items: center;
`;

const FeedbackForm = styled.form`
  label {
    display: block;
    margin-top: 2em;
  }
  span {
    display: block;
    text-transform: uppercase;
    font-size: 0.875em;
    letter-spacing: 1px;
    color: ${({ theme }) => theme.colors.textTertiary};
    margin-bottom: 0.5em;
  }
  input,
  textarea {
    font-size: 1rem;
    padding: 0.5em 1em;
    border: 0;
    outline: 0;
    border-radius: 0.25em;
    background: ${({ theme }) => theme.colors.darkBodyOverlay};
    color: ${({ theme }) => theme.colors.textPrimary};
    min-width: 40ch;
    font-family: "open sans", "sans-serif";
  }
  textarea {
    width: 600px;
    max-width: 100%;
  }
`;

const FeedbackInfo = styled.div``;

const FeedbackWrap = styled.div`
  width: 94%;
  position: relative;
  margin: 0 auto;
  display: flex;
  flex-grow: 1;
  flex-direction: column;
`;

export default Feedback;
