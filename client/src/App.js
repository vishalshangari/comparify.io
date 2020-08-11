import React, { useContext, useState, createContext } from "react";
import "./App.css";
import axios from "axios";
import { Switch, Route, BrowserRouter, useHistory } from "react-router-dom";
import Home from "./Home";
import { useAsync } from "react-use";

let DEV_URL = "";
if (process.env.NODE_ENV === `development`) {
  DEV_URL = "http://localhost:3001";
}

export const AuthContext = React.createContext();

const AuthProvider = ({ children }) => {
  const [state, setState] = useState({
    status: "loading",
    error: null,
  });

  useAsync(async () => {
    const response = await fetch(`${DEV_URL}/api/login/verifyToken`, {
      credentials: "include",
    });
    if (response.status === 200) {
      const responseBody = await response.json();
      if (responseBody.status) {
        setState({ status: responseBody.status });
      }
    } else {
      setState({ status: "error", error: response.text });
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
      <BrowserRouter>
        <Switch>
          <Route path="/create" exact component={Create} />
          <Route path="*" component={Home} />
        </Switch>
      </BrowserRouter>
    </AuthProvider>
  );
};

const Create = () => {
  const handleCreateFormSubmit = (e) => {
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
