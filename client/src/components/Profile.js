import React from "react";
import { useCookies } from "react-cookie";
import axios from "axios";
import { DEV_URL } from "../Test";
const Profile = () => {
  const [cookies, setCookie, removeCookie] = useCookies();
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
    <div style={{ background: "#999" }}>
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
