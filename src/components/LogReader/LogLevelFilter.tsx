import React from 'react';
import { LogLevel } from '../../data/ILogEntry';

interface ILogLevelFilterProps {
    levelFilter: Set<LogLevel>;
    setLevelFilter: (levelFilter: Set<LogLevel>) => void;
}

const LEVELS = [
    LogLevel.INFO,
    LogLevel.WARNING,
    LogLevel.ERROR,
    LogLevel.DEBUG,
    LogLevel.UNKNOWN,
];
export const LogLevelFilter = React.memo((props: ILogLevelFilterProps) => {
    const { levelFilter, setLevelFilter } = props;

    const onChange = (level: LogLevel) => {
        const newSet = new Set(levelFilter);
        if (newSet.has(level)) {
            newSet.delete(level);
        } else {
            newSet.add(level);
        }
        setLevelFilter(newSet);
    };

    return (
        <div className="box">
            <h2>Logging Level</h2>
            <ul className="checkbox-list">
                {LEVELS.map((level) => (
                    <li key={level}>
                        <label>
                            <input
                                type="checkbox"
                                checked={levelFilter.has(level)}
                                onChange={() => onChange(level)}
                            />
                            {LogLevel[level]}
                        </label>
                    </li>
                ))}
            </ul>
        </div>
    );
});
LogLevelFilter.displayName = 'LogLevelFilter';
