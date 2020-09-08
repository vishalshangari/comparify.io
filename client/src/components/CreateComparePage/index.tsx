import React, { useState, useEffect } from "react";
import styled, { keyframes, css } from "styled-components";
import Header from "../shared/Header";
import Footer from "../shared/Footer";
import { PageTitle, PageTitleInner } from "../shared/PageTitle";
import db from "../../db";
import axios from "axios";
import { DEV_URL, DB_COMPARIFYPAGE_COLLECTION } from "../../constants";
import StandardMainContentWrapper from "../shared/StandardMainContentWrapper";
import { MdCompare, MdPersonAdd } from "react-icons/md";
import { ImMusic } from "react-icons/im";
import debounce from "lodash/debounce";
import { useForm } from "react-hook-form";
import AwesomeDebouncePromise from "awesome-debounce-promise";
import { breakpoints } from "../../theme";
import * as QueryString from "query-string";
import { useLocation, Redirect } from "react-router-dom";
import ComponentWithLoadingState from "../shared/ComponentWithLoadingState";
import fetchUserSavedData from "../../utils/fetchUserSavedData";
import { ComparifyPage } from "../../hooks/useComparifyPage";

type FormData = {
  comparify: string;
};

const alphaNumericPattern = RegExp("^[a-zA-Z0-9]+$");

// TODO: Only show create options if authenticated user & does not have existing page
// Create API endpoint to check if user has comparifyPage
const CreateComparePage = () => {
  const location = useLocation();
  const [apiError, setApiError] = useState<null | string>(null);
  const [
    userComparifyPage,
    setUserComparifyPage,
  ] = useState<null | ComparifyPage>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isCreateButtonDisabled, setIsCreateButtonDisabled] = useState(true);
  const { register, handleSubmit, errors, trigger, setValue } = useForm<
    FormData
  >({
    mode: "onChange",
  });
  const autoFillValue = QueryString.parse(location.search);
  console.log(typeof autoFillValue.name);

  useEffect(() => {
    const checkIfUserHasComparifyPage = async () => {
      const userData = await fetchUserSavedData();
      if (userData.comparifyPage.exists) {
        setUserComparifyPage({
          exists: true,
          id: userData.comparifyPage.id,
        });
        setIsLoading(false);
      } else {
        setUserComparifyPage({
          exists: false,
          id: undefined,
        });
        setIsLoading(false);
      }
    };
    checkIfUserHasComparifyPage();
    const triggerValidationOnForm = async () => {
      await trigger("comparify");
    };
    if (autoFillValue.name) {
      setValue(
        "comparify",
        typeof autoFillValue.name === "string"
          ? autoFillValue.name
          : autoFillValue.name?.join("")
      );
      triggerValidationOnForm();
    }
  }, []);

  const onSubmit = handleSubmit(async ({ comparify }) => {
    console.log("submitted name: ", comparify);

    const comparifyPageRef = db
      .collection(DB_COMPARIFYPAGE_COLLECTION)
      .doc(comparify);

    const comparifyPageDoc = await comparifyPageRef.get();

    if (comparifyPageDoc.exists) {
      setApiError("Sorry, this name is already taken.");
    } else {
      const res = await axios.post(
        `${DEV_URL}/api/create`,
        {
          comparifyPageName: comparify,
        },
        {
          withCredentials: true,
        }
      );
      console.log("yes, this is available!", res.data);
    }
  });

  const validateName = async (name: string) => {
    const comparifyPageRef = db
      .collection(DB_COMPARIFYPAGE_COLLECTION)
      .doc(name);

    const comparifyPageDoc = await comparifyPageRef.get();

    if (comparifyPageDoc.exists) {
      setIsCreateButtonDisabled(true);
      return false;
    } else {
      setIsCreateButtonDisabled(false);
      return true;
    }
  };

  const checkAlphaNumeric = (name: string) => {
    if (alphaNumericPattern.test(name)) {
      return true;
    }
    return false;
  };

  return userComparifyPage?.exists ? (
    <Redirect to={`/${userComparifyPage.id}`} />
  ) : (
    <>
      <Header standardNav={true} pageTitle={"Create"} />
      <StandardMainContentWrapper>
        <ComponentWithLoadingState label={false} loading={isLoading}>
          <CreateWrap>
            {/* <CreateSplash>
            <p>What do you want to name your page?</p>
          </CreateSplash> */}

            <CreateForm>
              <form onSubmit={onSubmit} autoComplete={"off"}>
                <CreateFormInputDisplay>
                  <FormPrefix>comparify.io/</FormPrefix>
                  <InputWrap>
                    <input
                      name="comparify"
                      placeholder="enter a name..."
                      autoCapitalize={"none"}
                      autoFocus
                      autoCorrect={"off"}
                      onChange={() => setIsCreateButtonDisabled(true)}
                      ref={register({
                        required: true,
                        validate: {
                          minLength: (value) =>
                            value.length > 1 ||
                            "Name must be at least two characters long",
                          chars: (value) => {
                            return (
                              checkAlphaNumeric(value) ||
                              "Page name must only contain alphanumeric characters"
                            );
                          },
                          existence: AwesomeDebouncePromise(async (value) => {
                            return (
                              (await validateName(value)) ||
                              "This name is already taken, please try a different one"
                            );
                          }, 750),
                        },
                      })}
                    />
                  </InputWrap>
                </CreateFormInputDisplay>
                <CreateBtnWrap>
                  <CreateBtn disabled={isCreateButtonDisabled} type="submit">
                    Create
                  </CreateBtn>
                </CreateBtnWrap>
                <FormError>
                  {errors?.comparify?.message ? (
                    <span>{errors.comparify.message}</span>
                  ) : null}
                </FormError>
              </form>
              <CreateFormRequirements>
                Name must be two or more alphanumeric characters
                (lowercase/uppercase letters and/or numbers).
              </CreateFormRequirements>
            </CreateForm>
            <CreateInfo>
              <DescriptionBoxGrid>
                <DescriptionBoxInner>
                  <div className="descriptionIcon">
                    <MdCompare />{" "}
                  </div>
                  <div className="descriptionText">
                    Compare your taste in music with your friends and people
                    around the world
                  </div>
                </DescriptionBoxInner>
                <DescriptionBoxInner>
                  <div className="descriptionIcon">
                    <MdPersonAdd />
                  </div>
                  <div className="descriptionText">
                    Create your own, unique, comparify.io page that can be
                    shared with anyone easily
                  </div>
                </DescriptionBoxInner>
                <DescriptionBoxInner>
                  <div className="descriptionIcon">
                    <ImMusic />
                  </div>
                  <div className="descriptionText">
                    Discover new music from personalized recommendations
                  </div>
                </DescriptionBoxInner>
              </DescriptionBoxGrid>
            </CreateInfo>
          </CreateWrap>
        </ComponentWithLoadingState>
      </StandardMainContentWrapper>
      <Footer />
    </>
  );
};

const CreateFormRequirements = styled.div`
  text-align: center;
  color: ${({ theme }) => theme.colors.textTertiary};
  ${breakpoints.lessThan("48")`
    font-size: 0.875rem;
  `}
`;

const FormError = styled.div`
  margin: 2em 0;
  ${breakpoints.lessThan("48")`
    font-size: 0.875rem;
    margin: 1.5em 0;
  `}
  display: flex;
  align-items: center;
  justify-content: center;
  span {
    background: ${({ theme }) => theme.colors.errorRed};
    padding: 0.5em 2em;
    border-radius: 0.25em;
    display: inline-block;
  }
`;

const CreateFormInputDisplay = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  flex-wrap: wrap;
`;

const FormPrefix = styled.div`
  font-size: 3rem;
  ${breakpoints.lessThan("48")`
    flex-basis: 100%;
    text-align: center;
  `}
  ${breakpoints.lessThan("66")`
    font-size: 2.25rem;
  `}
  margin-right: 0.125em;
  color: ${({ theme }) => theme.colors.textTertiary};
`;

const InputWrap = styled.div`
  input {
    width: 100%;
    max-width: 600px;
    border: 0;
    background: rgba(255, 255, 255, 0.06);
    padding: 0.5em 0.25em;
    font-size: 3rem;
    border-radius: 0.25em;
    color: ${({ theme }) => theme.colors.textPrimary};
    &:focus {
      outline: none;
      box-shadow: 0px 0px 0px 2px ${({ theme }) => theme.colors.mainAccent50p};
    }
    &::placeholder {
      opacity: 0.5;
    }
    ${breakpoints.lessThan("66")`
      font-size: 2.25rem;
    `}
    ${breakpoints.lessThan("48")`
      padding: 0.375em 0.25em;
      margin-top: 0.125em;
    `}
  }
`;

const CreateSplash = styled.div`
  text-align: center;
  font-size: 1.25rem;
  font-weight: 600;
  margin-bottom: 1.5em;
`;

const DescriptionBoxGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  grid-gap: 2em;
  ${breakpoints.lessThan("66")`
    grid-template-columns: 1fr;
    grid-gap: 1em;
  `}
`;

const DescriptionBoxInner = styled.div`
  /* background: linear-gradient(
    -45deg,
    rgba(190, 57, 0, 0.75),
    rgba(106, 17, 104, 0.75)
  ); */
  background: ${({ theme }) => theme.colors.mainAccent25p};
  &:first-child {
    background: rgba(108, 30, 186, 0.25);
  }
  &:last-child {
    background: rgba(186, 30, 103, 0.25);
  }
  box-shadow: 2px 2px 3px rgb(0, 0, 0, 0.3);
  background-size: 300% 300%;
  background-position: 50%;
  border-radius: 0.25em;
  padding: 1.5em;
  ${breakpoints.lessThan("66")`
    padding: 1em;
  `}
  display: flex;
  height: 100%;
  width: 100%;
  flex-direction: column;
  .descriptionIcon {
    font-size: 3rem;
    display: flex;
    align-items: center;
    justify-content: center;
    margin-bottom: 0.5em;
    color: ${({ theme }) => theme.colors.textPrimary};
  }
  .descriptionText {
    text-align: center;
    color: ${({ theme }) => theme.colors.textPrimary};
    font-weight: 600;
  }
`;

const CreateWrap = styled.div`
  width: 94%;
  position: relative;
  margin: 0 auto;
  display: flex;
  flex-grow: 1;
  flex-direction: column;
`;

const CreateInfo = styled.div`
  color: ${({ theme }) => theme.colors.textPrimary};
`;

const CreateForm = styled.div`
  padding-bottom: 2em;
  text-align: center;
  flex-grow: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
`;

const CreateBtnWrap = styled.div`
  margin-top: 3em;
  ${breakpoints.lessThan("48")`
    margin-top: 1.5em;
  `}
`;

const CreateBtn = styled.button`
  padding: 0.5em 1em 0.625em;
  border: 0;
  border-radius: 0.25em;
  font-family: "roboto slab", "open sans", "sans-serif";
  font-size: 1.75rem;
  ${breakpoints.lessThan("66")`
    font-size: 1.5rem;
  `}
  color: rgba(255, 255, 255, 0.7);
  font-weight: 500;
  letter-spacing: 1px;
  outline: 0;
  display: inline-block;
  vertical-align: middle;
  -webkit-transform: perspective(1px) translateZ(0);
  transform: perspective(1px) translateZ(0);
  box-shadow: 0 0 1px rgba(0, 0, 0, 0);
  position: relative;
  background: ${({ theme }) => theme.colors.mainAccent};
  -webkit-transition-property: color;
  transition-property: color;
  -webkit-transition-duration: 0.3s;
  transition-duration: 0.3s;
  &:enabled:before {
    content: "";
    position: absolute;
    z-index: -1;
    top: 0;
    bottom: 0;
    left: 0;
    right: 0;
    border-radius: 0.25em;
    background: ${({ theme }) => theme.colors.blueCityBlue};
    -webkit-transform: scaleX(0);
    transform: scaleX(0);
    -webkit-transform-origin: 50%;
    transform-origin: 50%;
    -webkit-transition-property: transform;
    transition-property: transform;
    -webkit-transition-duration: 0.3s;
    transition-duration: 0.3s;
    -webkit-transition-timing-function: ease-out;
    transition-timing-function: ease-out;
  }
  &:enabled:hover,
  &:enabled:focus,
  &:enabled:active {
    color: white;
  }
  &:enabled:hover:before,
  &:enabled:focus:before,
  &:enabled:active:before {
    -webkit-transform: scaleX(1);
    transform: scaleX(1);
  }
  &:disabled {
    background: #666;
  }
`;

export default CreateComparePage;
