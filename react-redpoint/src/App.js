import React from "react";
import logo from "./placeholder_logo.svg";
import "./App.css";
import Notebook from "./Components/Notebook";
// import "bootstrap/dist/css/bootstrap.min.css";

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <h1>RedPoint</h1>
        <Notebook />
      </header>
    </div>
  );
}

export default App;
