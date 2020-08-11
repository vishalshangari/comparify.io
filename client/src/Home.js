import React, { useContext } from "react";
import "./App.css";
import { useCookies } from "react-cookie";
import axios from "axios";
import {
  Switch,
  Route,
  BrowserRouter,
  Redirect,
  useHistory,
} from "react-router-dom";
import { AuthContext } from "./App";

let DEV_URL = "";
if (process.env.NODE_ENV === `development`) {
  DEV_URL = "http://localhost:3001";
}

const Home = () => {
  const [data, setData] = React.useState(null);
  const [isFetching, setIsFetching] = React.useState(false);

  const fetchData = React.useCallback(() => {
    fetch(`${DEV_URL}/api`)
      .then((response) => {
        if (!response.ok) {
          throw new Error(`status ${response.status}`);
        }
        return response.json();
      })
      .then((json) => {
        setData(json.message);
        setIsFetching(false);
      })
      .catch((e) => {
        setIsFetching(false);
        setData(`API call failed: ${e}`);
      });
  }, []);

  React.useEffect(() => {
    setIsFetching(true);
    fetchData();
  }, [fetchData]);

  const { state: authState, setState: setAuthState } = useContext(AuthContext);

  console.log(authState);

  let history = useHistory();

  const handleLogOut = async () => {
    const response = await axios.post(`${DEV_URL}/api/logout`, "logout", {
      withCredentials: true,
    });
    console.log(response);
    if (response.status === 200) {
      console.log("YES");
      setAuthState({ status: "no-user" });
      history.replace("/n");
    } else {
      console.log(response);
    }

    // setIsLoggedIn(false);
  };

  return (
    <div className="App">
      <BrowserRouter>
        <Switch>
          <Route path="/compare/:compareId" component={CompareComponent} />
        </Switch>
      </BrowserRouter>
      <header className="App-header">
        <p>{isFetching ? "Fetching..." : data}</p>

        <a
          style={{
            padding: "20px",
            background: "#d4d4d4",
            color: "#333",
            borderRadius: "5px",
            textDecoration: "none",
          }}
          href={`${DEV_URL}/api/login`}
        >
          Login
        </a>
        <br />
        <button onClick={() => handleLogOut()}>Logout</button>
        <p>Logged in: {authState.status === "success" ? `true` : `false`}</p>
        <br />
        {/* {isLoggedIn ? <Profile /> : null} */}
      </header>
    </div>
  );
};

const Profile = () => {
  const [cookies, setCookie, removeCookie] = useCookies();
  const [response, setResponse] = React.useState("");
  const [result, setResult] = React.useState(null);
  const [profile, setProfile] = React.useState({});
  const [name, setName] = React.useState("");
  const [profileImageUrl, setProfileImageUrl] = React.useState("");
  const [loading, setLoading] = React.useState(false);
  React.useEffect(() => {
    const fetchProfile = async () => {
      try {
        setLoading(true);
        const response = await fetch(`${DEV_URL}/api/profile`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${cookies.accessToken}`,
          },
        });
        const jsonresponse = await response.json();
        setName(jsonresponse.display_name);
        setProfileImageUrl(jsonresponse.images[0].url);
        setProfile(response);
        setLoading(false);
      } catch (error) {
        console.error(error);
      }
    };
    fetchProfile();
  }, [cookies.accessToken]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const data = { name: "vishal" };
    const headers = {
      "Content-Type": "application/json",
      Authorization: "Bearer " + cookies.accessToken,
    };
    const result = await axios.post(`${DEV_URL}/api/generate`, data, {
      headers,
    });
    setResult(result);
  };

  return (
    <div>
      <p>my profile</p>
      {loading ? (
        <p>loading...</p>
      ) : (
        <>
          <div>
            <p>Hello, {name}</p>
            <img src={profileImageUrl} />
          </div>
          <form onSubmit={handleSubmit}>
            <input type="submit" value="Generate my data!" />
          </form>
          <div>{result ? JSON.stringify(result) : null}</div>
        </>
      )}
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
