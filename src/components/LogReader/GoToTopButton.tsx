import React from 'react';
import { ArrowBigUp } from 'lucide-react';
import './GoToTopButton.css';
import { useOptimizedTableContext } from '../../contexts/OptimizedTableContext';

export const GoToTopButton = () => {
    const tableRef = useOptimizedTableContext();

    return (
        <button
            className="go-to-top"
            onClick={() => {
                window.scrollTo(0, 0);
                tableRef.current?.scrollToRow(0);
            }}
        >
            <ArrowBigUp size={42} />
        </button>
    );
};
