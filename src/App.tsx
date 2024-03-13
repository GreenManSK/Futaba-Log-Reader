import React from "react";
import './App.css';
import { LogsDataProvider } from "./contexts/LogsDataContext";
import { Content } from "./components/Content";
import { DataStorageProvider } from "./contexts/DataStorageContext";

function App() {
  return (
    <div className="app">
        <LogsDataProvider>
          <DataStorageProvider>
            <Content />
          </DataStorageProvider>
        </LogsDataProvider>
    </div>
  );
}

export default App;
