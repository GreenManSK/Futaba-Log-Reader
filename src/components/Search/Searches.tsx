import React from "react";
import { SearchFilter } from "../../data/SearchFilter";
import { Search } from "./SearchInput";
import "./Searches.css";
import { ISearchFilter } from "../../data/ISearchFilter";
import { SearchGroupRenderer } from "./SearchGroup";
import { SearchGroup } from "../../data/SearchGroup";

interface ISearchProps {
    searches: ISearchFilter[];
    setSearches: (searches: ISearchFilter[]) => void;
}

export const Searches = (props: ISearchProps) => {
    const { searches, setSearches } = props;

    // const addSearch = () => {
    //     setSearches([...searches, new SearchFilter()]);
    // };

    const updateSearch = React.useCallback((index: number, search: ISearchFilter) => {
        const newSearches = searches.slice();
        newSearches[index] = search;
        setSearches(newSearches);
    }, [searches, setSearches]);

    const removeSearch = React.useCallback((index: number) => () => {
        const newSearches = searches.slice();
        newSearches.splice(index, 1);
        setSearches(newSearches);
    }, [searches, setSearches]);

    return <div className="searches">
        {/* <button onClick={addSearch}>Add Search</button> */}
        {/* {searches.map((search, index) => (
            <Search key={search.id} index={index} search={search} updateSearch={updateSearch} removeSearch={removeSearch} />
        ))} */}
        {searches.map((search, index) => (
            search instanceof SearchFilter ?
                <Search key={search.id} index={index} search={search} updateSearch={updateSearch} removeSearch={removeSearch} /> :
                <SearchGroupRenderer key={search.id} index={index} searchGroup={search as SearchGroup} updateSearch={updateSearch} />
        ))}
    </div>
}