import React from "react";
import { useLogsDataContext } from "../../contexts/LogsDataContext";
import { LogLevelFilter } from "./LogLevelFilter";
import { LogClassFilter } from "./LogClassFilter";
import { LogLevel } from "../../data/ILogEntry";
import { SearchFilter } from "../../data/SearchFilter";
import { FilteredLogTable } from "./FilteredLogTable";
import { SessionSelector } from "./SessionSelector";
import { Stats } from "../Stats/Stats";
import { Favourite } from "../Favourite/Favourite";

const DEFAULT_LINES_LIMIT = 5000;
const DEFAULT_LEVEL_FILTER = [LogLevel.WARNING, LogLevel.ERROR, LogLevel.UNKNOWN];

enum Tabs {
    FilteredLogs,
    Stats,
    Favorites
}

export const LogReader = () => {
    const { currentSession, clearData } = useLogsDataContext();

    const [currentTab, setCurrentTab] = React.useState(Tabs.FilteredLogs);
    const [favourites, setFavourites] = React.useState(new Set<number>());

    const [lineLimit, setLineLimit] = React.useState(DEFAULT_LINES_LIMIT);
    const [levelFilter, setLevelFilter] = React.useState(new Set(DEFAULT_LEVEL_FILTER));
    const [excludedClasses, setExcludedClasses] = React.useState(new Set<string>());
    const [searches, setSearches] = React.useState([new SearchFilter()]);
    const [timeRange, setTimeRange] = React.useState({ start: new Date(), end: new Date() });

    const data = currentSession?.data;

    React.useEffect(() => {
        if (!data) {
            return;
        }
        const dates = data.map(entry => entry.date.getTime());
        const start = new Date(Math.min(...dates));
        const end = new Date(Math.max(...dates));
        setTimeRange({ start, end });
        setFavourites(new Set());
    }, [data]);

    return <div>
        <div className="panel">
            <LogLevelFilter levelFilter={levelFilter} setLevelFilter={setLevelFilter} />
            <LogClassFilter excludedClasses={excludedClasses} setExcludedClasses={setExcludedClasses} />
        </div>
        <div className="main-content">
            <SessionSelector />
            <div>
                <button onClick={() => setCurrentTab(Tabs.FilteredLogs)}>Logs</button>
                <button onClick={() => setCurrentTab(Tabs.Stats)}>Stats</button>
                <button onClick={() => setCurrentTab(Tabs.Favorites)}>Favorites</button>
                <button onClick={clearData}>Clear data</button>
            </div>
            {currentTab === Tabs.FilteredLogs && <FilteredLogTable
                data={data}
                lineLimit={lineLimit}
                setLineLimit={setLineLimit}
                levelFilter={levelFilter}
                excludedClasses={excludedClasses}
                searches={searches}
                setSearches={setSearches}
                timeRange={timeRange}
                setTimeRange={setTimeRange}
                favourites={favourites}
                setFavourites={setFavourites} />}
            {currentTab === Tabs.Stats && <Stats data={data} excludedClasses={excludedClasses} setExcludedClasses={setExcludedClasses} />}
            {currentTab === Tabs.Favorites && <Favourite data={data} favourites={favourites} setFavourites={setFavourites} />}
        </div>
    </div>;
};