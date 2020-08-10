import React from "react";
import "./App.css";
import { useCookies } from "react-cookie";
import axios from "axios";
import { Switch, Route, BrowserRouter } from "react-router-dom";
import Home from "./Home";

let DEV_URL = "";
if (process.env.NODE_ENV === `development`) {
  DEV_URL = "http://localhost:3001";
}

const App = () => {
  return (
    <BrowserRouter>
      <Switch>
        <Route path="/create" exact component={Create} />
        <Route path="*" component={Home} />
      </Switch>
    </BrowserRouter>
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
