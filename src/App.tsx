import React from 'react';
import './App.css';
import { LogsDataProvider } from './contexts/LogsDataContext';
import { Content } from './components/Content';
import { DataStorageProvider } from './contexts/DataStorageContext';
import { DropZone } from './components/DropZone';
import { PresetsProvider } from './contexts/PresetsContext';

function App() {
    return (
        <div className="app">
            <LogsDataProvider>
                <DataStorageProvider>
                    <PresetsProvider>
                        <DropZone>
                            <Content />
                        </DropZone>
                    </PresetsProvider>
                </DataStorageProvider>
            </LogsDataProvider>
        </div>
    );
}

export default App;
