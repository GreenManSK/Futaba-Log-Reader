import React from "react";
import { SearchFilter } from "../../data/SearchFilter";

interface ISearchProps {
    index: number;
    search: SearchFilter;
    updateSearch: (index: number, search: SearchFilter) => void;
    removeSearch: (index: number) => void;
}

export const Search = (props: ISearchProps) => {
    const { index, search, updateSearch } = props;
    const [searchText, setSearchText] = React.useState(search.text);
    const [isRegex, setIsRegex] = React.useState(search.isRegex);
    const [isCaseSensitive, setIsCaseSensitive] = React.useState(search.isCaseSensitive);
    const [isEnabled, setIsEnabled] = React.useState(search.enabled);

    React.useEffect(() => {
        if (searchText === search.text && isRegex === search.isRegex && isCaseSensitive === search.isCaseSensitive && isEnabled === search.enabled) return;
        search.text = searchText;
        search.isRegex = isRegex;
        search.isCaseSensitive = isCaseSensitive;
        search.enabled = isEnabled;
        updateSearch(index, search);
    }, [index, search, searchText, updateSearch, isRegex, isCaseSensitive, isEnabled]);

    return <div>
        <input type="text" value={searchText} onChange={e => setSearchText(e.target.value)} placeholder="Filter by" />
        <button onClick={() => setIsRegex(!isRegex)}>
            {isRegex ? <strong>Regex</strong> : "Regex"}
        </button>
        <button onClick={() => setIsCaseSensitive(!isCaseSensitive)}>
            {isCaseSensitive ? <strong>Case Sensitive</strong> : "Case Sensitive"}
        </button>
        <button onClick={() => setIsEnabled(!isEnabled)}>
            {isEnabled ? <strong>Enabled</strong> : "Enabled"}
        </button>
        <button onClick={() => props.removeSearch(index)}>Remove</button>
    </div>
}