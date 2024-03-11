import React from "react";

interface ISearchProps {
    search: string;
    setSearch: (search: string) => void;
}

const UPDATE_DELAY = 250;
export const Search = (props: ISearchProps) => {
    const { search, setSearch } = props;
    const [internalSearch, setInternalSearch] = React.useState(search);

    React.useEffect(() => {
        const timeout = setTimeout(() => setSearch(internalSearch.toLowerCase()), UPDATE_DELAY);
        return () => clearTimeout(timeout);
    }, [internalSearch, setSearch]);

    return <input type="text" value={internalSearch} onChange={e => setInternalSearch(e.target.value)} placeholder="Filter by" />
}