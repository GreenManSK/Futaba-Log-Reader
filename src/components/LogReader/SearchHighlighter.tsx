import React, { useEffect, useRef } from 'react';
import Highlighter from 'react-highlight-words';
import { useSearchHighlighterContext } from '../../contexts/SearchHighlighterContext';

export interface ISearchHighlighterProps {
    text: string;
    id: number;
}

export const SearchHighlighter: React.FC<ISearchHighlighterProps> = React.memo(
    ({ text, id }) => {
        const { searchText, activeId } = useSearchHighlighterContext();
        const highlighterRef = useRef<HTMLDivElement>(null);
        const isActive = activeId === id;

        useEffect(() => {
            if (isActive && highlighterRef.current) {
                const element = highlighterRef.current;
                const rect = element.getBoundingClientRect();
                const isVisible =
                    rect.top >= 0 &&
                    rect.left >= 0 &&
                    rect.bottom <=
                        (window.innerHeight ||
                            document.documentElement.clientHeight) &&
                    rect.right <=
                        (window.innerWidth ||
                            document.documentElement.clientWidth);

                if (!isVisible) {
                    element.scrollIntoView({
                        behavior: 'smooth',
                        block: 'center',
                        inline: 'nearest',
                    });
                }
            }
        }, [isActive]);

        if (!searchText) {
            return text;
        }
        return (
            <div ref={highlighterRef}>
                <Highlighter
                    textToHighlight={text}
                    highlightClassName={
                        isActive ? 'highlight-active' : 'highlight'
                    }
                    autoEscape={true}
                    searchWords={[searchText]}
                />
            </div>
        );
    }
);
SearchHighlighter.displayName = 'SearchHighlighter';
