import React from "react";
import './App.css';
import { LogsDataProvider } from "./contexts/LogsDataContext";
import { Content } from "./components/Content";
import { DataStorageProvider } from "./contexts/DataStorageContext";

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <LogsDataProvider>
          <DataStorageProvider>
            <Content />
          </DataStorageProvider>
        </LogsDataProvider>
      </header>
    </div>
  );
}

export default App;
