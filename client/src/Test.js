import React, { useContext } from "react";
import axios from "axios";
import { Switch, Route, BrowserRouter, useHistory } from "react-router-dom";
import { AuthContext } from "./App";
import { DEV_URL } from "./constants";

const Home = () => {
  // const [data, setData] = React.useState(null);
  // const [isFetching, setIsFetching] = React.useState(false);

  // const fetchData = React.useCallback(() => {
  //   fetch(`${DEV_URL}/api`)
  //     .then((response) => {
  //       if (!response.ok) {
  //         throw new Error(`status ${response.status}`);
  //       }
  //       return response.json();
  //     })
  //     .then((json) => {
  //       setData(json.message);
  //       setIsFetching(false);
  //     })
  //     .catch((e) => {
  //       setIsFetching(false);
  //       setData(`API call failed: ${e}`);
  //     });
  // }, []);

  // React.useEffect(() => {
  //   setIsFetching(true);
  //   fetchData();
  // }, [fetchData]);

  const { state: authState, setState: setAuthState } = useContext(AuthContext);

  console.log(authState);

  let history = useHistory();

  const handleLogOut = async () => {
    try {
      const response = await axios.post(`${DEV_URL}/api/logout`, "logout", {
        withCredentials: true,
      });
      console.log(response);
      setAuthState({
        status: response.data.status,
        errorType: response.data.errorType,
      });
      // TODO: better handler for logout redirect
      history.replace("/");
    } catch (error) {
      console.log(error);
      // TODO: generic error handler -> redirect to error page with query string
    }
  };

  return (
    <div className="App" style={{ background: "#999" }}>
      <BrowserRouter>
        <Switch>
          <Route path="/compare/:compareId" component={CompareComponent} />
        </Switch>
      </BrowserRouter>
      <header
        className="App-header"
        style={{ textAlign: "center", padding: "100px" }}
      >
        {/* <p>{isFetching ? "Fetching..." : data}</p> */}

        <a
          style={{
            padding: "20px",
            background: "#d4d4d4",
            color: "#333",
            borderRadius: "5px",
            textDecoration: "none",
            margin: "20px",
          }}
          href={`${DEV_URL}/api/auth/login`}
        >
          Login
        </a>
        <br />
        <button onClick={() => handleLogOut()} style={{ margin: "100px" }}>
          Logout
        </button>
        <p>
          Logged in: {authState.status === "authenticated" ? `true` : `false`}
        </p>
        <br />
        {/* {isLoggedIn ? <Profile /> : null} */}
      </header>
    </div>
  );
};

const CompareComponent = ({ match, location }) => {
  const {
    params: { compareId },
  } = match;
  return (
    <div>
      <p>
        <strong>Compare name: {compareId} </strong>
        {}
      </p>
    </div>
  );
};

export default Home;
