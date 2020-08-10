import React, { useReducer, useContext } from "react";
import "./App.css";
import { useCookies } from "react-cookie";
import axios from "axios";
import { Switch, Route, BrowserRouter } from "react-router-dom";
import Home from "./Home";

let DEV_URL = "";
if (process.env.NODE_ENV === `development`) {
  DEV_URL = "http://localhost:3001";
}

// const checkLoggedInStatus = async () => {
//   console.log(`call`);
//   const result = await fetch(`${DEV_URL}/api/login/verifyToken`);
//   console.log(result);
//   if (result.data === "done") {
//     return false;
//   } else {
//     return true;
//   }
// };

const initialStatusLog = (async () => {
  console.log(`call`);
  const result = await fetch(`${DEV_URL}/api/login/verifyToken`);
  console.log(result);
  if (result.data === "done") {
    return false;
  } else {
    return true;
  }
})();

// const [isLoggedIn, setIsLoggedIn] = React.useState(initialStatusLog);

const AuthContext = React.createContext();

const AuthProvider = ({ reducer, initialState, children }) => {
  return (
    <AuthContext.Provider value={useReducer(reducer, initialState)}>
      {children}
    </AuthContext.Provider>
  );
};

export const useStateValue = () => useContext(AuthContext);

const reducer = async (state, action) => {
  switch (action.type) {
    case "LOGOUT":
      const result = await axios.post(`${DEV_URL}/api/logout`);
      return false;
    default:
      return state;
  }
};

const App = () => {
  return (
    <AuthProvider initialState={initialStatusLog} reducer={reducer}>
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
