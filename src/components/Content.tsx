import React from "react";
import { useLogsDataContext } from "../contexts/LogsDataContext";
import { FileUploader } from "./FileUploader";
import { LogTable } from "./LogTable";
import { LineLimit } from "./LineLimit";
import { ILogEntry, LogLevel } from "../data/LogParser";
import { LogLevelFilter } from "./LogLevelFilter";
import { LogClassFilter } from "./LogClassFilter";
import { Search } from "./Search";
import _ from "lodash";

const DEFAULT_LINES_LIMIT = 5000;
const DEFAULT_LEVEL_FILTER = [LogLevel.WARNING, LogLevel.ERROR, LogLevel.UNKNOWN];
const FILTER_DEBOUNCE = 250;

export const Content = () => {
    const { data } = useLogsDataContext();
    const [filteredData, setFilteredData] = React.useState([] as ILogEntry[]);

    const [lineLimit, setLineLimit] = React.useState(DEFAULT_LINES_LIMIT);
    const [levelFilter, setLevelFilter] = React.useState(new Set(DEFAULT_LEVEL_FILTER));
    const [excludedClasses, setExcludedClasses] = React.useState(new Set<string>());
    const [search, setSearch] = React.useState("");

    const updateFilteredData = React.useMemo(() => {
        const update = (data: ILogEntry[] | undefined, lineLimit: number, levelFilter: Set<LogLevel>, excludedClasses: Set<string>, search: string) => {
            if (!data) {
                return [];
            }
            const prefiltered = data
                .filter(entry => levelFilter.has(entry.level) && !excludedClasses.has(entry.loggingClass));
            if (!search) {
                setFilteredData(prefiltered.slice(0, lineLimit));
            }
            const lowerCaseSearch = search.toLowerCase();
            setFilteredData(prefiltered.filter(entry => entry.matchesFilter(lowerCaseSearch)).slice(0, lineLimit));
        }
        return _.debounce(update, FILTER_DEBOUNCE);
    }, [setFilteredData]);

    React.useEffect(() => {
        updateFilteredData(data, lineLimit, levelFilter, excludedClasses, search);
    }, [data, lineLimit, levelFilter, excludedClasses, search, updateFilteredData]);

    if (!data) {
        return <FileUploader />;

    }

    return <div>
        <div className="panel">
            <LogLevelFilter levelFilter={levelFilter} setLevelFilter={setLevelFilter} />
            <LogClassFilter excludedClasses={excludedClasses} setExcludedClasses={setExcludedClasses} />
        </div>
        <div className="main-content">
            <LineLimit lineLimit={lineLimit} setLineLimit={setLineLimit} />
            <Search search={search} setSearch={setSearch} />
            {<LogTable data={filteredData} />}
        </div>
    </div>;
};