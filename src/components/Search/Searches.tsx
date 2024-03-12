import React from "react";
import { SearchFilter } from "../../data/SearchFilter";
import { Search } from "./SearchInput";

interface ISearchProps {
    searches: SearchFilter[];
    setSearches: (searches: SearchFilter[]) => void;
}

export const Searches = (props: ISearchProps) => {
    const { searches, setSearches } = props;

    const addSearch = () => {
        setSearches([...searches, new SearchFilter()]);
    };

    const updateSearch = React.useCallback((index: number, search: SearchFilter) => {
        const newSearches = searches.slice();
        newSearches[index] = search;
        setSearches(newSearches);
    }, [searches, setSearches]);
    const removeSearch = React.useCallback((index: number) => () => {
        const newSearches = searches.slice();
        newSearches.splice(index, 1);
        setSearches(newSearches);
    }, [searches, setSearches]);

    return <div>
        {searches.map((search, index) => (
            <Search key={search.id} index={index} search={search} updateSearch={updateSearch} removeSearch={removeSearch(index)} />
        ))}
        <button onClick={addSearch}>Add Search</button>
    </div>
}