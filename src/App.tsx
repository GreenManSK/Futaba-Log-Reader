import React from "react";
import './App.css';
import { LogsDataProvider } from "./contexts/LogsDataContext";
import { Content } from "./components/Content";
import { DataStorageProvider } from "./contexts/DataStorageContext";
import { DropZone } from "./components/DropZone";

function App() {
  return (
    <div className="app">
      <LogsDataProvider>
        <DataStorageProvider>
          <DropZone>
            <Content />
          </DropZone>
        </DataStorageProvider>
      </LogsDataProvider>
    </div>
  );
}

export default App;
