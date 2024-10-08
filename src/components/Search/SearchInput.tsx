import React from "react";
import { SearchFilter } from "../../data/SearchFilter";
import { Regex, CaseSensitive, Trash2, Pause } from 'lucide-react';
import "./SearchInput.css";

interface ISearchProps {
    index: number;
    search: SearchFilter;
    updateSearch: (index: number, search: SearchFilter) => void;
    removeSearch: (index: number) => void;
}

const isRegexValid = (text: string) => {
    try {
        new RegExp(text);
        return true;
    } catch {
        return false;
    }
}

export const Search = (props: ISearchProps) => {
    const { index, search, updateSearch } = props;
    const [searchText, setSearchText] = React.useState(search.text);
    const [isRegex, setIsRegex] = React.useState(search.isRegex);
    const [isCaseSensitive, setIsCaseSensitive] = React.useState(search.isCaseSensitive);
    const [isEnabled, setIsEnabled] = React.useState(search.enabled);
    const [isValid, setIsValid] = React.useState(true);

    React.useEffect(() => {
        if (searchText === search.text && isRegex === search.isRegex && isCaseSensitive === search.isCaseSensitive && isEnabled === search.enabled) return;
        search.text = searchText;
        search.isRegex = isRegex;
        search.isCaseSensitive = isCaseSensitive;
        search.enabled = isEnabled;
        updateSearch(index, search);
    }, [index, search, searchText, updateSearch, isRegex, isCaseSensitive, isEnabled]);

    React.useEffect(() => {
        if (!isRegex) {
            setIsValid(true);
            return;
        }
        setIsValid(isRegexValid(searchText));
    }, [isRegex, searchText])

    return <div className={`search ${isValid ? "" : "invalid"}`}>
        <input title={!isValid ? "Invalid regular expression" : ""} type="text" value={searchText} onChange={e => setSearchText(e.target.value)} placeholder="Filter by" />
        <button className={isCaseSensitive ? "enabled" : "disabled"} onClick={() => setIsCaseSensitive(!isCaseSensitive)} title="Match Case">
            <CaseSensitive size={14} />
        </button>
        <button className={isRegex ? "enabled" : "disabled"} onClick={() => setIsRegex(!isRegex)} title="Use Regular Expression">
            <Regex size={14} />
        </button>
        <button className={!isEnabled ? "enabled" : "disabled"} onClick={() => setIsEnabled(!isEnabled)} title="Pause matching">
            <Pause size={14} />
        </button>
        <button className="remove-button" onClick={() => props.removeSearch(index)} title="Remove search">Remove <Trash2 size={14} /></button>
    </div>
}