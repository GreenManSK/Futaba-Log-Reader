import './App.css';
import 'react-virtualized/styles.css';

import { LogsDataProvider } from './contexts/LogsDataContext';
import { Content } from './components/Content';
import { DataStorageProvider } from './contexts/DataStorageContext';
import { DropZone } from './components/DropZone';
import { PresetsProvider } from './contexts/PresetsContext';
import { SettingsProvider } from './contexts/SettingsContext';
import { OptimizedTableProvider } from './contexts/OptimizedTableContext';

function App() {
    return (
        <div className="app">
            <LogsDataProvider>
                <DataStorageProvider>
                    <OptimizedTableProvider>
                        <PresetsProvider>
                            <SettingsProvider>
                                <DropZone>
                                    <Content />
                                </DropZone>
                            </SettingsProvider>
                        </PresetsProvider>
                    </OptimizedTableProvider>
                </DataStorageProvider>
            </LogsDataProvider>
        </div>
    );
}

export default App;
