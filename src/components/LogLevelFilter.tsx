import React from "react";
import { LogLevel } from "../data/LogParser";

interface ILogLevelFilterProps {
    levelFilter: Set<LogLevel>,
    setLevelFilter: (levelFilter: Set<LogLevel>) => void;
}

const LEVELS = [LogLevel.INFO, LogLevel.WARNING, LogLevel.ERROR, LogLevel.DEBUG, LogLevel.UNKNOWN];
export const LogLevelFilter = (props: ILogLevelFilterProps) => {
    const { levelFilter, setLevelFilter } = props;

    const onChange = (level: LogLevel) => {
        const newSet = new Set(levelFilter);
        if (newSet.has(level)) {
            newSet.delete(level);
        } else {
            newSet.add(level);
        }
        setLevelFilter(newSet);
    }

    return <>
        <h2>Logging Level</h2>
        {LEVELS.map(level => (<div key={level}>
            <input type="checkbox" checked={levelFilter.has(level)} onChange={() => onChange(level)} />
            {LogLevel[level]}
        </div>))}
    </>;
};