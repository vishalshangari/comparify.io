import React, { useState } from "react";
import styled from "styled-components";
import Header from "../shared/Header";
import Footer from "../shared/Footer";
import StandardMainContentWrapper from "../shared/StandardMainContentWrapper";
import { theme } from "../../theme";

import { useForm } from "react-hook-form";
import { ClipLoader } from "react-spinners";
import { DEV_URL } from "../../constants";
import axios from "axios";
import { Transition } from "react-transition-group";
import SlidingAlert from "../shared/SlidingAlert";

type FeedbackFormData = {
  name: string;
  email: string;
  message: string;
};

const Feedback = () => {
  document.title = `Feedback  | Comparify`;
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showErrorAlert, setShowErrorAlert] = useState(false);
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);
  const [slidingErrorMessage, setSlidingErrorMessage] = useState<null | string>(
    null
  );
  const { register, handleSubmit, errors } = useForm<FeedbackFormData>();

  function validateEmail(email: string) {
    if (email === ``) {
      return true;
    }
    const re = /^(([^<>()\]\\.,;:\s@"]+(\.[^<>()\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(String(email).toLowerCase());
  }

  const onSubmit = handleSubmit(async ({ name, email, message }) => {
    setIsSubmitting(true);
    console.log(name, email, message);
    try {
      const res = await axios.post(`${DEV_URL}/api/feedback`, {
        name: name,
        email: email || null,
        message: message,
      });
      if (res.data.status === "200") {
        setShowSuccessMessage(true);
        setIsSubmitting(false);
      }
    } catch (error) {
      setShowErrorAlert(true);
      setSlidingErrorMessage(error.response.data.message);
    }
  });

  return (
    <>
      <Transition
        in={showErrorAlert}
        timeout={1500}
        onEntered={() => setTimeout(() => setShowErrorAlert(false), 1000)}
      >
        {(state) => (
          <SlidingAlert error state={state}>
            {slidingErrorMessage}
          </SlidingAlert>
        )}
      </Transition>
      <Transition
        in={showSuccessMessage}
        timeout={1500}
        onEntered={() => setTimeout(() => setShowSuccessMessage(false), 1000)}
      >
        {(state) => (
          <SlidingAlert state={state}>
            Feedback submitted! Thank you.
          </SlidingAlert>
        )}
      </Transition>
      <Header standardNav={true} pageTitle={"Feedback"} />
      <StandardMainContentWrapper>
        <FeedbackWrap>
          <FeedbackInfo>
            Thank you for taking the time to submit feedback. We want to hear
            about your experience.
          </FeedbackInfo>
          <FeedbackForm onSubmit={onSubmit} id="feedback-form">
            <label htmlFor="name">
              <span className="formLabel">Name</span>
              <input
                name="name"
                type="text"
                ref={register({ required: true })}
              />
              <span className="formError">
                {errors.name && `Name is required`}
              </span>
            </label>
            <label htmlFor="email">
              <span className="formLabel">E-mail (optional)</span>
              <input
                name="email"
                type="text"
                ref={register({
                  validate: (value) =>
                    validateEmail(value) || "Invalid e-mail address",
                })}
              />

              <span className="formError">{errors.email?.message}</span>
            </label>
            <label htmlFor="message">
              <span className="formLabel">Message</span>
              <textarea
                cols={32}
                rows={10}
                name="message"
                ref={register({ required: true })}
              />
              <span className="formError">
                {errors.message && `Message is required`}
              </span>
            </label>
            <FormSubmissionWrap>
              <input type="submit" value="Submit" />
              <FormSubmissionLoader isSubmitting={isSubmitting}>
                <ClipLoader color={theme.colors.textTertiary} />
              </FormSubmissionLoader>
            </FormSubmissionWrap>
          </FeedbackForm>
        </FeedbackWrap>
      </StandardMainContentWrapper>
      <Footer />
    </>
  );
};

const FormSubmissionWrap = styled.div`
  display: flex;
  margin-top: 2em;
  align-items: center;
`;

const FormSubmissionLoader = styled.div<{ isSubmitting: boolean }>`
  margin-left: 1em;
  ${({ isSubmitting }) => (isSubmitting ? `display: block` : "display: none")}
`;

const FeedbackForm = styled.form`
  label {
    display: block;
    margin-top: 2em;
  }
  span {
    display: block;
    font-size: 0.875em;
  }
  span.formLabel {
    text-transform: uppercase;
    letter-spacing: 1px;
    color: ${({ theme }) => theme.colors.textTertiary};
    margin-bottom: 0.5em;
  }
  span.formError {
    color: ${({ theme }) => theme.colors.orangeRed};
    margin-top: 0.5em;
  }
  input[type="submit"] {
    cursor: pointer;
    -webkit-appearance: none;
    -moz-appearance: none;
    padding: 0.5em 1em;
    font-size: 1.5em;
    border: 0;
    outline: 0;
    font-weight: 700;
    border-radius: 0.125em;
    font-family: "open sans", "sans-serif";
    color: ${({ theme }) => theme.colors.textPrimary};
    background: ${({ theme }) => theme.colors.mainAccent};
    &:hover {
      background: ${({ theme }) => theme.colors.blueCityBlue};
    }
  }
  input[type="text"],
  textarea {
    font-size: 1rem;
    padding: 0.5em;
    border: 0;
    outline: 0;
    border-radius: 0.25em;
    background: ${({ theme }) => theme.colors.darkBodyOverlay};
    color: ${({ theme }) => theme.colors.textPrimary};
    width: 100%;
    max-width: 400px;
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
