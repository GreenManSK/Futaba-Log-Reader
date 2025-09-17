import React, { createContext, useContext, useRef } from 'react';
import { Table } from 'react-virtualized';

type OptimizedTableContextType = React.RefObject<Table>;

const OptimizedTableContext = createContext<OptimizedTableContextType>({
    current: null,
});

export const useOptimizedTableContext = () => useContext(OptimizedTableContext);

export const OptimizedTableProvider: React.FC<{
    children: React.ReactNode;
}> = ({ children }) => {
    const tableRef = useRef<Table>(null);

    return (
        <OptimizedTableContext.Provider value={tableRef}>
            {children}
        </OptimizedTableContext.Provider>
    );
};

export default OptimizedTableContext;
