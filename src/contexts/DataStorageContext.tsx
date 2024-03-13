import React from "react";
import { LogLevel } from "../data/ILogEntry";
import { ISearchData, SearchFilter } from "../data/SearchFilter";
import { ITimeRange } from "../components/LogReader/TimeRange";
import { useLogsDataContext } from "./LogsDataContext";

interface IStoredFileData {
    hash: string,
    lastUpdate: number,
    levelFilter: LogLevel[];
    excludedClasses: string[];
    searches: ISearchData[];
    favourites: {
        [key: string]: number[];
    };

}

interface IDataStorageContext {
    levelFilter: Set<LogLevel>;
    setLevelFilter: (filter: Set<LogLevel>) => void;
    excludedClasses: Set<string>;
    setExcludedClasses: (classes: Set<string>) => void;
    searches: SearchFilter[];
    setSearches: (searches: SearchFilter[]) => void;
    favourites: Set<number>;
    setFavourites: (favourites: Set<number>) => void;
}

export const DataStorageContext = React.createContext<IDataStorageContext>({
    levelFilter: new Set(),
    setLevelFilter: () => { },
    excludedClasses: new Set(),
    setExcludedClasses: () => { },
    searches: [],
    setSearches: () => { },
    favourites: new Set(),
    setFavourites: () => { }
});

export const useDataStorageContext = () => React.useContext(DataStorageContext);

const STORAGE_KEY = "LOGS_DATA_STORAGE";
const DATA_STORE_TIME = 1000 * 60 * 60 * 24 * 7; // 1 week
const DEFAULT_LEVEL_FILTER = [LogLevel.WARNING, LogLevel.ERROR, LogLevel.UNKNOWN];

const clearOldData = (data: IStoredFileData) => {
    return data.lastUpdate + DATA_STORE_TIME > Date.now();
}

export const DataStorageProvider: React.FC<React.PropsWithChildren> = ({ children }) => {
    const { currentSession, dataHash } = useLogsDataContext();
    const storedData = React.useRef<IStoredFileData[]>([]);
    const loadedDataHash = React.useRef<string | undefined>();
    const loadedSessionName = React.useRef<string | undefined>();

    const [favourites, setFavourites] = React.useState(new Set<number>());
    const [levelFilter, setLevelFilter] = React.useState(new Set(DEFAULT_LEVEL_FILTER));
    const [excludedClasses, setExcludedClasses] = React.useState(new Set<string>());
    const [searches, setSearches] = React.useState([new SearchFilter()]);

    React.useEffect(() => {
        const stored = localStorage.getItem(STORAGE_KEY);
        if (stored) {
            storedData.current = JSON.parse(stored).filter(clearOldData);
        }
    }, []);

    React.useEffect(() => {
        if (!dataHash) {
            return;
        }
        const stored = storedData.current.find(data => data.hash === dataHash);
        if (stored) {
            setLevelFilter(new Set(stored.levelFilter));
            setExcludedClasses(new Set(stored.excludedClasses));
            setSearches(stored.searches.map(data => new SearchFilter(data)));
            setFavourites(new Set(stored.favourites[currentSession?.name || ""] ?? []));
            loadedDataHash.current = dataHash;
            loadedSessionName.current = currentSession?.name;
        }
    }, [dataHash, currentSession]);

    React.useEffect(() => {
        if (!dataHash || dataHash !== loadedDataHash.current || currentSession?.name !== loadedSessionName.current) {
            return;
        }
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
    }, [dataHash, currentSession, levelFilter, excludedClasses, searches, favourites]);


    const value = {
        levelFilter,
        setLevelFilter,
        excludedClasses,
        setExcludedClasses,
        searches,
        setSearches,
        favourites,
        setFavourites
    };

    return (
        <DataStorageContext.Provider value={value}>
            {children}
        </DataStorageContext.Provider>
    );
};