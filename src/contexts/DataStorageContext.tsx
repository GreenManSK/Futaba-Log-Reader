import React from "react";
import { LogLevel } from "../data/ILogEntry";
import { SearchFilter } from "../data/SearchFilter";
import { useLogsDataContext } from "./LogsDataContext";
import { ISearchFilter } from "../data/ISearchFilter";
import { SearchGroup } from "../data/SearchGroup";
import { ISearchSerialized } from "../data/ISearchSerialization";
import { parseSearchData } from "../helpers/searchParser";

interface IStoredFileData {
    hash: string,
    lastUpdate: number,
    levelFilter: LogLevel[];
    excludedClasses: string[];
    searches: ISearchSerialized[];
    favourites: {
        [key: string]: number[];
    };

}

interface IDataStorageDataContext {
    levelFilter: Set<LogLevel>;
    excludedClasses: Set<string>;
    searches: ISearchFilter[];
    favourites: Set<number>;
}

interface IDataStorageSetterContext {
    setLevelFilter: (filter: Set<LogLevel>) => void;
    setExcludedClasses: (classes: Set<string>) => void;
    setSearches: (searches: ISearchFilter[]) => void;
    setFavourites: (favourites: Set<number>) => void;
}

export const DataStorageDataContext = React.createContext<IDataStorageDataContext>({
    levelFilter: new Set(),
    excludedClasses: new Set(),
    searches: [],
    favourites: new Set()
});

export const DataStorageSetterContext = React.createContext<IDataStorageSetterContext>({
    setLevelFilter: () => { },
    setExcludedClasses: () => { },
    setSearches: () => { },
    setFavourites: () => { }
});

export const useDataStorageDataContext = () => React.useContext(DataStorageDataContext);
export const useDataStorageSetterContext = () => React.useContext(DataStorageSetterContext);

const STORAGE_KEY = "LOGS_DATA_STORAGE";
const LAST_SAVE_KEY = "LAST_SAVE";
const DATA_STORE_TIME = 1000 * 60 * 60 * 24 * 7; // 1 week
export const DEFAULT_LEVEL_FILTER = [LogLevel.WARNING, LogLevel.ERROR, LogLevel.UNKNOWN];

const clearOldData = (data: IStoredFileData) => {
    return data.lastUpdate + DATA_STORE_TIME > Date.now();
}

const getDefaultSearches = () => {
    const group = new SearchGroup();
    group.children = [new SearchFilter()];
    return [group];
};

export const DataStorageProvider: React.FC<React.PropsWithChildren> = ({ children }) => {
    const { currentSession, dataHash } = useLogsDataContext();
    const storedData = React.useRef<IStoredFileData[]>([]);
    const lastSave = React.useRef("0");
    const loadedDataHash = React.useRef<string | undefined>();
    const loadedSessionName = React.useRef<string | undefined>();

    const [favourites, setFavourites] = React.useState(new Set<number>());
    const [levelFilter, setLevelFilter] = React.useState(new Set(DEFAULT_LEVEL_FILTER));
    const [excludedClasses, setExcludedClasses] = React.useState(new Set<string>());
    const [searches, setSearches] = React.useState<ISearchFilter[]>(getDefaultSearches);

    const loadNewestData = React.useCallback(() => {
        if (lastSave.current === localStorage.getItem(LAST_SAVE_KEY)) {
            return;
        }
        const stored = localStorage.getItem(STORAGE_KEY);
        if (stored) {
            storedData.current = JSON.parse(stored).filter(clearOldData);
        }
    }, []);

    React.useEffect(() => {
        loadNewestData();
    }, [loadNewestData]);

    React.useEffect(() => {
        if (!dataHash) {
            setLevelFilter(new Set(DEFAULT_LEVEL_FILTER));
            setExcludedClasses(new Set<string>());
            setSearches(getDefaultSearches());
            setFavourites(new Set<number>());
            return;
        }
        const stored = storedData.current.find(data => data.hash === dataHash);
        if (stored) {
            setLevelFilter(new Set(stored.levelFilter));
            setExcludedClasses(new Set(stored.excludedClasses));
            setSearches(parseSearchData(stored.searches));
            setFavourites(new Set(stored.favourites[currentSession?.name || ""] ?? []));
            loadedDataHash.current = dataHash;
            loadedSessionName.current = currentSession?.name;
        }
    }, [dataHash, currentSession]);

    React.useEffect(() => {
        if (!dataHash || dataHash !== loadedDataHash.current || currentSession?.name !== loadedSessionName.current) {
            return;
        }
        // Load data from storage to not override data saved by other tabs
        loadNewestData();
        const storedIndex = storedData.current.findIndex(data => data.hash === dataHash);
        const oldFavourites = storedData.current[storedIndex]?.favourites ?? [];
        const latestData = {
            hash: dataHash,
            lastUpdate: Date.now(),
            levelFilter: Array.from(levelFilter),
            excludedClasses: Array.from(excludedClasses),
            searches: searches.map(search => search.getData()),
            favourites: {
                ...oldFavourites,
                [currentSession?.name || ""]: Array.from(favourites)
            }
        };

        if (storedIndex >= 0) {
            storedData.current[storedIndex] = {
                ...storedData.current[storedIndex],
                ...latestData
            };
        } else {
            storedData.current.push(latestData);
        }
        localStorage.setItem(STORAGE_KEY, JSON.stringify(storedData.current));
        lastSave.current = Date.now().toString();
        localStorage.setItem(LAST_SAVE_KEY, lastSave.current);
    }, [dataHash, currentSession, levelFilter, excludedClasses, searches, favourites]);

    const dataValue = React.useMemo(() => ({
        levelFilter,
        excludedClasses,
        searches,
        favourites
    }), [
        levelFilter,
        excludedClasses,
        searches,
        favourites
    ]);
    const setterValue = React.useMemo(() => ({
        setLevelFilter, setExcludedClasses, setSearches, setFavourites
    }), [
        setLevelFilter, setExcludedClasses, setSearches, setFavourites
    ]);

    return (
        <DataStorageDataContext.Provider value={dataValue}>
            <DataStorageSetterContext.Provider value={setterValue}>
                {children}
            </DataStorageSetterContext.Provider>
        </DataStorageDataContext.Provider>
    );
};