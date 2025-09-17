import React from 'react';
import Highlighter from 'react-highlight-words';
import { useSearchHighlighterContext } from '../../contexts/SearchHighlighterContext';

export interface ISearchHighlighterProps {
    text: string;
    id: number;
}

export const SearchHighlighter: React.FC<ISearchHighlighterProps> = React.memo(
    ({ text, id }) => {
        const { searchText, activeId } = useSearchHighlighterContext();
        const isActive = activeId === id;
        if (!searchText) {
            return text;
        }
        return (
            <Highlighter
                textToHighlight={text}
                highlightClassName={isActive ? 'highlight-active' : 'highlight'}
                autoEscape={true}
                searchWords={[searchText]}
            />
        );
    }
);
SearchHighlighter.displayName = 'SearchHighlighter';
