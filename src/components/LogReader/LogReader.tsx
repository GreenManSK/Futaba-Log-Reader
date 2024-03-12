import React from "react";
import { useLogsDataContext } from "../../contexts/LogsDataContext";
import { LogTable } from "./LogTable";
import { LineLimit } from "./LineLimit";
import { LogLevelFilter } from "./LogLevelFilter";
import { LogClassFilter } from "./LogClassFilter";
import _ from "lodash";
import { ILogEntry, LogLevel } from "../../data/ILogEntry";
import { SearchFilter } from "../../data/SearchFilter";
import { Searches } from "../Search/Searches";
import { SessionSelector } from "./SessionSelector";
import { TimeRange, ITimeRange } from "./TimeRange";

const DEFAULT_LINES_LIMIT = 5000;
const DEFAULT_LEVEL_FILTER = [LogLevel.WARNING, LogLevel.ERROR, LogLevel.UNKNOWN];
const FILTER_DEBOUNCE = 250;

export const LogReader = () => {
    const { currentSession } = useLogsDataContext();
    const [filteredData, setFilteredData] = React.useState([] as ILogEntry[]);

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
    }, [data]);

    const updateFilteredData = React.useMemo(() => {
        const update = (data: ILogEntry[] | undefined, lineLimit: number, levelFilter: Set<LogLevel>, excludedClasses: Set<string>, searches: SearchFilter[], timeRange: ITimeRange) => {
            if (!data) {
                return [];
            }
            const prefiltered = data
                .filter(entry => levelFilter.has(entry.level) && !excludedClasses.has(entry.loggingClass) && entry.isInRange(timeRange.start, timeRange.end));
            if (!searches.length) {
                setFilteredData(prefiltered.slice(0, lineLimit));
                return;
            }
            setFilteredData(prefiltered.filter(entry => {
                return searches.every(search => entry.matchesFilter(search));
            }).slice(0, lineLimit));
        }
        return _.debounce(update, FILTER_DEBOUNCE);
    }, [setFilteredData]);

    React.useEffect(() => {
        updateFilteredData(data, lineLimit, levelFilter, excludedClasses, searches, timeRange);
    }, [data, lineLimit, levelFilter, excludedClasses, searches, updateFilteredData, timeRange]);

    return <div>
        <div className="panel">
            <LogLevelFilter levelFilter={levelFilter} setLevelFilter={setLevelFilter} />
            <LogClassFilter excludedClasses={excludedClasses} setExcludedClasses={setExcludedClasses} />
        </div>
        <div className="main-content">
            <SessionSelector />
            <TimeRange timeRange={timeRange} setTimeRange={setTimeRange} />
            <Searches searches={searches} setSearches={setSearches} />
            {<LogTable data={filteredData} />}
            <LineLimit lineLimit={lineLimit} setLineLimit={setLineLimit} />
        </div>
    </div>;
};