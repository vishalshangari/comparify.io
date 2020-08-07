import React from "react";
import "./App.css";
import { useCookies } from "react-cookie";
import axios from "axios";

let DEV_URL = "";
if (process.env.NODE_ENV === `development`) {
  DEV_URL = "http://localhost:3001";
}

function App() {
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

  const [cookies, setCookie, removeCookie] = useCookies();
  const [isLoggedIn, setIsLoggedIn] = React.useState(
    cookies.accessToken ? true : false
  );

  const handleLogOut = () => {
    removeCookie("accessToken");
    setIsLoggedIn((prevIsLoggedIn) => !prevIsLoggedIn);
  };

  return (
    <div className="App">
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
        <p>Logged in: {isLoggedIn ? `true` : `false`}</p>
        <br />
        {isLoggedIn ? <Profile /> : null}
      </header>
    </div>
  );
}

const Profile = () => {
  const [cookies, setCookie, removeCookie] = useCookies();
  const [profile, setProfile] = React.useState({});
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
        console.log(jsonresponse);
        setProfile(jsonresponse);
        setLoading(false);
      } catch (error) {
        console.error(error);
      }
    };
    fetchProfile();
  }, []);
  return (
    <div>
      <p>my profile</p>
      {loading ? (
        <p>loading...</p>
      ) : (
        <div>
          <p>Hello, {profile.display_name}</p>
        </div>
      )}
    </div>
  );
};

export default App;
