import React from "react";
import logo from "./placeholder_logo.svg";
import "./App.css";
import CodeCell from "./Components/Cell/CodeCell";
import Notebook from "./Components/Notebook/Notebook";

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <h1>RedPoint</h1>
        <p>{`This is some ${50 + 50}% good code`}</p>
        {/* <CodeCell /> */}
        <Notebook />
      </header>
    </div>
  );
}

export default App;
