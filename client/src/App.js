import React from "react";
import logo from "./logo.svg";
import "./App.css";

function App() {
  const [data, setData] = React.useState(null);
  const [isFetching, setIsFetching] = React.useState(false);
  const fetchData = () => {
    fetch("/api")
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
  };

  React.useEffect(() => {
    setIsFetching(true);
    fetchData();
  }, []);

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
      </header>
    </div>
  );
}

export default App;
