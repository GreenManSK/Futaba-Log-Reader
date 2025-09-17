import React, { createContext, useContext, useState, ReactNode } from 'react';

interface ISearchHighlighterContext {
    searchText?: string;
    activeId?: number;
    setSearchText: (text: string) => void;
    setActiveId: (id: number) => void;
}

const SearchHighlighterContext = createContext<ISearchHighlighterContext>(
    {} as any
);

export const SearchHighlighterProvider = ({
    children,
}: {
    children: ReactNode;
}) => {
    const [searchText, setSearchText] = useState<string | undefined>();
    const [activeId, setActiveId] = useState<number | undefined>();

    return (
        <SearchHighlighterContext.Provider
            value={{ searchText, activeId, setSearchText, setActiveId }}
        >
            {children}
        </SearchHighlighterContext.Provider>
    );
};

export const useSearchHighlighterContext = () =>
    useContext(SearchHighlighterContext);
