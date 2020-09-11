import React, { useState, useEffect } from "react";
import styled from "styled-components";
import Header from "../shared/Header";
import Footer from "../shared/Footer";
import db from "../../db";
import axios from "axios";
import { DEV_URL, DB_COMPARIFYPAGE_COLLECTION } from "../../constants";
import StandardMainContentWrapper from "../shared/StandardMainContentWrapper";
import { useForm, Controller } from "react-hook-form";
import AwesomeDebouncePromise from "awesome-debounce-promise";
import { breakpoints, theme } from "../../theme";
import * as QueryString from "query-string";
import { useLocation, useHistory } from "react-router-dom";
import ComponentWithLoadingState from "../shared/ComponentWithLoadingState";
import fetchUserSavedData from "../../utils/fetchUserSavedData";
import { ComparifyPage } from "../../hooks/useComparifyPage";
import { Transition } from "react-transition-group";
import SlidingAlert from "../shared/SlidingAlert";
import { BarLoader } from "react-spinners";
import ComparifyInfo from "../shared/ComparifyInfo";

type FormData = {
  comparify: string;
};

const alphaNumericPattern = RegExp("^[a-zA-Z0-9]+$");

const CreateComparePage = () => {
  const location = useLocation();
  let history = useHistory();
  const [
    userComparifyPage,
    setUserComparifyPage,
  ] = useState<null | ComparifyPage>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isCreateButtonDisabled, setIsCreateButtonDisabled] = useState(true);
  const [autoFill, setAutoFill] = useState<null | string | string[]>(null);
  const { register, handleSubmit, errors, trigger, control } = useForm<
    FormData
  >({
    mode: "onChange",
  });
  const [isCreating, setIsCreating] = useState(false);
  const [showErrorAlert, setShowErrorAlert] = useState(false);
  const [slidingErrorMessage, setSlidingErrorMessage] = useState<null | string>(
    null
  );
  const autoFillValue = QueryString.parse(location.search);

  useEffect(() => {
    const checkIfUserHasComparifyPage = async () => {
      const userData = await fetchUserSavedData();
      if (userData.comparifyPage.exists) {
        history.push(`/${userData.comparifyPage.id}`);
      } else {
        setUserComparifyPage({
          exists: false,
          id: undefined,
        });
        setIsLoading(false);
      }
    };
    checkIfUserHasComparifyPage();
    setAutoFill(autoFillValue.name || null);
    if (autoFillValue.name) {
      setTimeout(async () => {
        await trigger("comparify");
      }, 500);
    }
  }, [register, trigger, autoFillValue.name, history, userComparifyPage]);

  const onSubmit = handleSubmit(async ({ comparify }) => {
    setIsCreating(true);
    setIsCreateButtonDisabled(true);

    try {
      const res = await axios.post(
        `${DEV_URL}/api/create`,
        {
          comparifyPageName: comparify,
        },
        {
          withCredentials: true,
        }
      );
      if (res.data.status === "201") {
        history.push(`/${comparify}`);
      }
    } catch (error) {
      setShowErrorAlert(true);
      setSlidingErrorMessage(error.response.data.message);
    }
    setIsCreating(false);
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
      <Header standardNav={true} pageTitle={"Compare"} />
      <StandardMainContentWrapper>
        <ComponentWithLoadingState label={false} loading={isLoading}>
          <CreateWrap>
            <CreateForm>
              <form onSubmit={onSubmit} autoComplete={"off"}>
                <CreateFormInputDisplay>
                  <FormPrefix>comparify.io/</FormPrefix>
                  <InputWrap>
                    <Controller
                      control={control}
                      defaultValue={autoFill}
                      name={"comparify"}
                      rules={{
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
                      }}
                      render={({ onChange, value, onBlur, name }) => (
                        <input
                          name={name}
                          placeholder={`enter a name...`}
                          onBlur={onBlur}
                          value={value ? value : ``}
                          onChange={onChange}
                          autoFocus
                        />
                      )}
                    />
                  </InputWrap>
                </CreateFormInputDisplay>
                <CreateBtnWrap isCreating={isCreating}>
                  <div className="creatingLoader">
                    <BarLoader color={theme.colors.mainAccent} />
                  </div>
                  <CreateBtn disabled={isCreateButtonDisabled} type="submit">
                    Create
                  </CreateBtn>
                </CreateBtnWrap>
                <FormError>
                  {errors?.comparify?.message ? (
                    <span>{errors.comparify.message}</span>
                  ) : null}
                  {errors.comparify?.type === "required" ? (
                    <span>A page name is required</span>
                  ) : null}
                </FormError>
              </form>
              <CreateFormRequirements>
                Name must be two or more alphanumeric characters
                (lowercase/uppercase letters and/or numbers).
              </CreateFormRequirements>
            </CreateForm>
            <ComparifyInfo authenticated />
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

const CreateWrap = styled.div`
  width: 94%;
  position: relative;
  margin: 0 auto;
  display: flex;
  flex-grow: 1;
  flex-direction: column;
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

const CreateBtnWrap = styled.div<{ isCreating: boolean }>`
  position: relative;
  .creatingLoader {
    position: absolute;
    top: calc(100% + 1em);
    ${breakpoints.lessThan("42")`
      top: calc(100% + 0.5em)
    `}
    z-index: 3;
    left: 50%;
    transform: translateX(-50%);
    ${({ isCreating }) => (isCreating ? "display: block;" : "display: none;")}
  }
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
  &:active {
    opacity: 0.5;
  }
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
