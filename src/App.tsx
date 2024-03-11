import React from "react";
import './App.css';
import { LogsDataProvider } from "./contexts/LogsDataContext";
import { Content } from "./components/Content";

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <LogsDataProvider>
          <Content />
        </LogsDataProvider>
      </header>
    </div>
  );
}

export default App;
