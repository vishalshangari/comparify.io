import React, { useContext, useState, createContext } from "react";
import {
  Switch,
  Route,
  BrowserRouter,
  useHistory,
  useLocation,
} from "react-router-dom";
import Test from "./Test";
import Home from "./components/Home";
import { useAsync } from "react-use";
import Router from "./components/Router";

import bg from "./bg.jpg";
import Splash from "./components/Splash/";
import { theme } from "./theme";
import GlobalStyle from "./components/GlobalStyle";
import { ThemeProvider } from "styled-components";
import FullPageLoader from "./components/FullPageLoader";

import { ERROR_CODES, RESPONSE_CODES } from "./constants";
import Login from "./components/Login";

let DEV_URL = "";
if (process.env.NODE_ENV === `development`) {
  DEV_URL = "http://localhost:3001";
}

type AuthStateType = {
  status: "loading" | typeof RESPONSE_CODES;
  errorType: typeof ERROR_CODES | null;
};

type AuthContextType = {
  state: AuthStateType;
  setState: React.Dispatch<React.SetStateAction<AuthStateType>>;
};

export const AuthContext = React.createContext<AuthContextType | undefined>(
  undefined
);

export function useAuthState() {
  const context = React.useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuthState must be used within a AuthProvider");
  }
  return context;
}

type AuthProviderProps = {
  children: React.ReactNode;
};

const AuthProvider = ({ children }: AuthProviderProps) => {
  const [state, setState] = useState<AuthStateType>({
    status: "loading",
    errorType: null,
  });

  useAsync(async () => {
    try {
      const response = await fetch(`${DEV_URL}/api/login/verifyToken`, {
        credentials: "include",
      });
      const responseBody = await response.json();
      console.log(responseBody);
      setState({
        status: responseBody.status,
        errorType: responseBody.errorType,
      });
    } catch (error) {
      console.log(error);
      // TODO: generic error handler -> redirect to error page with query string
    }
  }, [DEV_URL]);

  return (
    <AuthContext.Provider value={{ state: state, setState: setState }}>
      {state.status === "loading" ? <FullPageLoader /> : children}
    </AuthContext.Provider>
  );
};

const App = () => {
  return (
    <>
      <ThemeProvider theme={theme}>
        <GlobalStyle />
        <AuthProvider>
          <Router />
        </AuthProvider>
      </ThemeProvider>
    </>
  );
};

const Create = () => {
  const handleCreateFormSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    e.persist();
    console.log("Form was submitted");
    console.log(e);
  };

  return (
    <div style={{ textAlign: "center" }}>
      <h1>Hello this is Create</h1>
      <form onSubmit={handleCreateFormSubmit}>
        <input name="comparisonName" type="text" />
        <br />
        <br />
        <button type="submit">Create!</button>
      </form>
    </div>
  );
};

export default App;
