import React from "react";

interface ISearchProps {
    search: string;
    setSearch: (search: string) => void;
}

export const Search = (props: ISearchProps) => {
    const { search, setSearch } = props;

    return <input type="text" value={search} onChange={e => setSearch(e.target.value)} placeholder="Filter by" />
}