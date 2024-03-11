import React from "react";
import { useLogsDataContext } from "../contexts/LogsDataContext";
import { FileUploader } from "./FileUploader";
import { LogTable } from "./LogTable";
import { LineLimit } from "./LineLimit";
import { LogLevel } from "../data/LogParser";
import { LogLevelFilter } from "./LogLevelFilter";
import { LogClassFilter } from "./LogClassFilter";
import { Search } from "./Search";

const DEFAULT_LINES_LIMIT = 5000;
const DEFAULT_LEVEL_FILTER = [LogLevel.WARNING, LogLevel.ERROR, LogLevel.UNKNOWN];

export const Content = () => {
    const { data } = useLogsDataContext();

    const [lineLimit, setLineLimit] = React.useState(DEFAULT_LINES_LIMIT);
    const [levelFilter, setLevelFilter] = React.useState(new Set(DEFAULT_LEVEL_FILTER));
    const [excludedClasses, setExcludedClasses] = React.useState(new Set<string>());
    const [search, setSearch] = React.useState("");

    const filteredData = React.useMemo(() => {
        if (!data) {
            return [];
        }
        const prefiltered = data
            .filter(entry => levelFilter.has(entry.level) && !excludedClasses.has(entry.loggingClass));
        if (!search) {
            return prefiltered.slice(0, lineLimit);
        }
        return prefiltered.filter(entry => entry.matchesFilter(search)).slice(0, lineLimit);
    }, [data, lineLimit, levelFilter, excludedClasses, search]);

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