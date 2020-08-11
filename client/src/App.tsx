import React, { useContext, useState, createContext } from "react";
import axios from "axios";
import { Switch, Route, BrowserRouter, useHistory } from "react-router-dom";
import Home from "./Home";
import { useAsync } from "react-use";

import bg from "./bg.jpg";
import Splash from "./components/Splash";
import { theme } from "./theme";
import styled, { ThemeProvider } from "styled-components";

let DEV_URL = "";
if (process.env.NODE_ENV === `development`) {
  DEV_URL = "http://localhost:3001";
}

type AuthStateType = {
  status: "loading" | "error" | "authenticated" | "no-user";
  error: string | null;
};

type AuthContexType = {
  state: AuthStateType;
  setState: React.Dispatch<React.SetStateAction<AuthStateType>>;
};

export const AuthContext = React.createContext<AuthContexType | undefined>(
  undefined
);

type AuthProviderProps = {
  children: React.ReactNode;
};

const AuthProvider = ({ children }: AuthProviderProps) => {
  const [state, setState] = useState<AuthStateType>({
    status: "loading",
    error: null,
  });

  useAsync(async () => {
    const response = await fetch(`${DEV_URL}/api/login/verifyToken`, {
      credentials: "include",
    });
    const responseBody = await response.json();
    if (response.status === 200) {
      if (responseBody.status) {
        setState({ status: responseBody.status, error: null });
      }
    } else {
      setState({ status: "error", error: responseBody.text });
    }
  }, [DEV_URL]);

  return (
    <AuthContext.Provider value={{ state: state, setState: setState }}>
      {state.status === "loading" ? <h1>Loading...</h1> : children}
    </AuthContext.Provider>
  );
};

const App = () => {
  return (
    <AuthProvider>
      <ThemeProvider theme={theme}>
        <BrowserRouter>
          <Switch>
            <Route path="/create" exact component={Create} />
            <Route path="/splash" exact component={Splash} />
            <Route path="*" component={Home} />
          </Switch>
        </BrowserRouter>
      </ThemeProvider>
    </AuthProvider>
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
