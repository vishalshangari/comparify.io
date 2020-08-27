import React, { useState } from "react";
import styled from "styled-components";
import Header from "../shared/Header";
import Footer from "../shared/Footer";
import { PageTitle, PageTitleInner } from "../shared/PageTitle";
import db from "../../db";
import axios from "axios";
import { DEV_URL, DB_COMPARIFYPAGE_COLLECTION } from "../../constants";
import StandardMainContentWrapper from "../shared/StandardMainContentWrapper";

// TODO: Only show create options if authenticated user & does not have existing page
// Create API endpoint to check if user has comparifyPage
const CreateComparePage = () => {
  const [createInputText, setCreateInputText] = useState("");
  const [error, setError] = useState<null | string>(null);
  const [display, setdisplay] = useState<null | string>(null);
  const handleCreateInputTextChange = (
    e: React.FormEvent<HTMLInputElement>
  ) => {
    setCreateInputText(e.currentTarget.value);
    setError(null);
  };
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    console.log("submitted!", createInputText);

    const comparifyPageRef = db
      .collection(DB_COMPARIFYPAGE_COLLECTION)
      .doc(createInputText);

    const comparifyPageDoc = await comparifyPageRef.get();

    if (comparifyPageDoc.exists) {
      setError("Sorry, this name is already taken.");
    } else {
      const res = await axios.post(
        `${DEV_URL}/api/create`,
        {
          comparifyPageName: createInputText,
        },
        {
          withCredentials: true,
        }
      );
      setdisplay(res.data);
      console.log("yes, this is available!");
    }
  };

  return (
    <>
      <Header standardNav={true} pageTitle={"Create"} />
      <StandardMainContentWrapper>
        <CreateWrap>
          <CreateInfo>
            Make a unique webpage to share with your friends to compare your
            tastes in music.
          </CreateInfo>
          <CreateForm>
            <form onSubmit={handleSubmit} autoComplete={"off"}>
              <input
                type="text"
                name="create"
                id="create"
                onChange={handleCreateInputTextChange}
              />
              <button type="submit">Create!</button>
            </form>
            {error ? <FormError>{error}</FormError> : null}
          </CreateForm>
          {display}
        </CreateWrap>
      </StandardMainContentWrapper>
      <Footer />
    </>
  );
};

const FormError = styled.div`
  padding: 0.5em 0.75em;
  background: #9d0208;
  margin-top: 1em;
  color: ${({ theme }) => theme.colors.textPrimary};
  display: inline-block;
  border-radius: 0.25em;
`;

const CreateWrap = styled.div`
  width: 94%;

  margin: 0 auto;
`;

const CreateInfo = styled.div`
  font-size: 1.25em;
  margin-bottom: 2em;
  color: ${({ theme }) => theme.colors.textPrimary};
`;

const CreateForm = styled.div`
  padding-bottom: 2em;
  input {
    border: 0;
    background: white;
    padding: 0.5em 0.75em;
    font-size: 1.25rem;
    border-radius: 0.25em;
    color: #333;
    &:focus {
      color: #000;
      outline: none;
    }
  }
  button {
    display: block;
    font-size: 1.25em;
    margin-top: 1em;
    padding: 0.5em 0.75em;
    color: ${({ theme }) => theme.colors.textPrimary};
    border-radius: 0.25em;
    background: ${({ theme }) => theme.colors.mainAccent};
    border: 2px solid transparent;
    transition: 0.2s ease all;
    &:hover {
      border: 2px solid rgba(255, 255, 255, 0.7);
    }
  }
`;

export default CreateComparePage;
