import React from 'react';
import { ILogEntry } from '../../data/ILogEntry';
import { useSearchHighlighterContext } from '../../contexts/SearchHighlighterContext';
import './SearchHighlighterInput.css';
import { SearchFilter } from '../../data/SearchFilter';
import { ChevronUp, ChevronDown } from 'lucide-react';

interface ISearchHighlighterInputProps {
    data: ILogEntry[];
}

export const SearchHighlighterInput = React.memo(
    ({ data }: ISearchHighlighterInputProps) => {
        const { searchText, setSearchText, setActiveId, activeId } =
            useSearchHighlighterContext();
        const [matches, setMatches] = React.useState<ILogEntry[]>([]);
        const [currentMatch, setCurrentMatch] = React.useState(0);
        const activeIdRef = React.useRef(activeId);
        const inputRef = React.useRef<HTMLInputElement>(null);

        React.useEffect(() => {
            if (!searchText) {
                setMatches([]);
                setCurrentMatch(0);
                setActiveId(-1);
                return;
            }
            const search = new SearchFilter();
            search.text = searchText;
            search.isCaseSensitive = false;
            const matches = data.filter((row) => row.matchesHighlight(search));

            if (
                activeIdRef.current !== undefined &&
                activeIdRef.current !== -1
            ) {
                const activeMatchIndex = matches.findIndex(
                    (match) => match.id === activeIdRef.current
                );
                if (activeMatchIndex !== -1) {
                    setCurrentMatch(activeMatchIndex);
                } else {
                    // Set current match to the closest match with higher id or back to 1
                    const nextMatchIndex = matches.findIndex(
                        (match) => match.id > activeIdRef.current!
                    );
                    setCurrentMatch(nextMatchIndex !== -1 ? nextMatchIndex : 0);
                }
            }

            setMatches(matches);
        }, [data, searchText, setActiveId]);

        const scrollInputToTop = React.useCallback(() => {
            if (inputRef.current) {
                const rect = inputRef.current.getBoundingClientRect();
                window.scrollBy({
                    top: rect.top - 10, // 10px padding above input
                    left: 0,
                    behavior: 'smooth',
                });
            }
        }, []);

        const nextMatch = React.useCallback(() => {
            setCurrentMatch((prev) => (prev + 1) % matches.length);
            scrollInputToTop();
        }, [matches, scrollInputToTop]);

        const prevMatch = React.useCallback(() => {
            setCurrentMatch((prev) =>
                prev === 1 ? matches.length - 1 : (prev - 1) % matches.length
            );
            scrollInputToTop();
        }, [matches, scrollInputToTop]);

        React.useEffect(() => {
            if (matches.length === 0 || !matches[currentMatch]) {
                return;
            }
            setActiveId(matches[currentMatch].id);
        }, [setActiveId, currentMatch, matches]);

        // Focus input on Ctrl+F
        React.useEffect(() => {
            const handleKeyDown = (e: KeyboardEvent) => {
                if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'f') {
                    if (inputRef.current) {
                        inputRef.current.focus();
                        e.preventDefault();
                    }
                }
            };
            window.addEventListener('keydown', handleKeyDown);
            return () => {
                window.removeEventListener('keydown', handleKeyDown);
            };
        }, []);

        return (
            <div className="search-highlighter">
                <strong>Highlighter: </strong>
                <input
                    ref={inputRef}
                    type="text"
                    title="Highlight text"
                    placeholder="Highlight text"
                    value={searchText}
                    onChange={(e) => setSearchText(e.target.value)}
                    onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                            if (e.shiftKey) {
                                prevMatch();
                            } else {
                                nextMatch();
                            }
                            e.preventDefault();
                        }
                    }}
                />
                {matches.length > 0 && (
                    <button title="Previous highlight" onClick={prevMatch}>
                        <ChevronUp size={14} />
                    </button>
                )}
                {matches.length > 0 && (
                    <button title="Next highlight" onClick={nextMatch}>
                        <ChevronDown size={14} />
                    </button>
                )}
                &nbsp;
                {matches.length > 0
                    ? `${currentMatch + 1} of ${matches.length} matches`
                    : ''}
            </div>
        );
    }
);
SearchHighlighterInput.displayName = 'SearchHighlighterInput';
