import React from "react";
import logo from "./logo.svg";
import "./App.css";

function App() {
  const [data, setData] = React.useState(null);
  const [isFetching, setIsFetching] = React.useState(false);
  let DEV_URL = "";
  if (process.env.NODE_ENV === `development`) {
    DEV_URL = "http://localhost:3001";
  }

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
  }, [DEV_URL]);

  React.useEffect(() => {
    setIsFetching(true);
    fetchData();
  }, [fetchData]);

  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>
          Edit <code>src/App.js</code> and save to reload.
        </p>
        <a
          className="App-link"
          href="https://reactjs.org"
          target="_blank"
          rel="noopener noreferrer"
        >
          Learn React
        </a>
        <p>{isFetching ? "Fetching..." : data}</p>
        {<a href={`${DEV_URL}/api/login`}>Login</a>}
        <p>{DEV_URL}</p>
      </header>
    </div>
  );
}

export default App;
