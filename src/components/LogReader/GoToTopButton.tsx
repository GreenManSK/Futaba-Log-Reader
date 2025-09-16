import React from 'react';
import { ArrowBigUp } from 'lucide-react';
import './GoToTopButton.css';

export const GoToTopButton = () => {
    return (
        <button className="go-to-top" onClick={() => window.scrollTo(0, 0)}>
            <ArrowBigUp size={42} />
        </button>
    );
};
