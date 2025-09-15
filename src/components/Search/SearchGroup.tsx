import React from "react";
import "./SearchGroup.css";
import { SearchGroup } from "../../data/SearchGroup";
import { SearchFilter } from "../../data/SearchFilter";
import { ISearchFilter } from "../../data/ISearchFilter";
import { Search } from "./SearchInput";
import { Trash2, Pause } from 'lucide-react';

interface ISearchGroupProps {
    index: number;
    searchGroup: SearchGroup;
    updateSearch: (index: number, data: SearchGroup | SearchFilter) => void;
    removeSearch?: (index: number) => void;
}

export const SearchGroupRenderer = React.memo((props: ISearchGroupProps) => {
    const { index, searchGroup, updateSearch, removeSearch } = props;
    const [children, setChildren] = React.useState(searchGroup.children);
    const [isEnabled, setIsEnabled] = React.useState(searchGroup.enabled);
    const [isOr, setIsOr] = React.useState(searchGroup.isOr);

    const updateChild = React.useCallback((childIndex: number, search: ISearchFilter) => {
        const newChildren = searchGroup.children.slice();
        newChildren[childIndex] = search;
        setChildren(newChildren);
    }, [setChildren, searchGroup]);

    const removeChild = React.useCallback((childIndex: number) => {
        const newChildren = searchGroup.children.slice();
        newChildren.splice(childIndex, 1);
        setChildren(newChildren);
    }, [setChildren, searchGroup]);

    const addSearch = () => {
        setChildren([...children, new SearchFilter()]);
    };

    const addGroup = () => {
        setChildren([...children, new SearchGroup()]);
    };

    React.useEffect(() => {
        if (searchGroup.children === children) {
            return;
        }
        searchGroup.children = children;
        updateSearch(index, searchGroup);
    }, [index, children, searchGroup, updateSearch]);

    React.useEffect(() => {
        if (searchGroup.enabled === isEnabled && searchGroup.isOr === isOr) {
            return;
        }
        searchGroup.enabled = isEnabled;
        searchGroup.isOr = isOr;
        updateSearch(index, searchGroup);
    }, [isEnabled, isOr, index, searchGroup, updateSearch])

    return <div className="search-group">
        <div className="controls">
            <button className={!isOr ? "enabled" : "disabled"} onClick={() => setIsOr(false)} title="Set as AND group">
                AND
            </button>
            <button className={isOr ? "enabled" : "disabled"} onClick={() => setIsOr(true)} title="Set as OR group">
                OR
            </button>
            <button className={!isEnabled ? "enabled" : "disabled"} onClick={() => setIsEnabled(!isEnabled)} title="Pause matching">
                <Pause size={14} />
            </button>
            {removeSearch && <button className="remove-button" onClick={() => removeSearch(index)} title="Remove group"><Trash2 size={14} /></button>}
        </div>
        {children.map((search, childIndex) => (<div key={search.id} className="wrapper">
            {childIndex !== 0 && <div className="divider">{isOr ? "or" : "and"}</div>}
            {search instanceof SearchFilter ?
                <Search index={childIndex} search={search} updateSearch={updateChild} removeSearch={removeChild} /> :
                <SearchGroupRenderer index={childIndex} searchGroup={search as SearchGroup} updateSearch={updateChild} removeSearch={removeChild} />}
        </div>
        ))}
        <div>
            <button onClick={addSearch}>Add Search</button>&nbsp;
            <button onClick={addGroup}>Add Group</button>
        </div>
    </div>;
});
SearchGroupRenderer.displayName = "SearchGroupRenderer";