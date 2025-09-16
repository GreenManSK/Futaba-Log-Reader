import React from 'react';
import { ILogEntry, LogLevel } from '../../data/ILogEntry';
import './Stats.css';

enum SortType {
    Alphabetical,
    AllLogsCount,
    InfoCount,
    WarningCount,
    ErrorCount,
    DebugCount,
    UnknownCount,
}

interface ITypeStats {
    [LogLevel.INFO]: number;
    [LogLevel.WARNING]: number;
    [LogLevel.ERROR]: number;
    [LogLevel.DEBUG]: number;
    [LogLevel.UNKNOWN]: number;
    total: number;
}

interface IClassStats {
    name: string;
    [LogLevel.INFO]: number;
    [LogLevel.WARNING]: number;
    [LogLevel.ERROR]: number;
    [LogLevel.DEBUG]: number;
    [LogLevel.UNKNOWN]: number;
    total: number;
}

interface IStatsProps {
    data?: ILogEntry[];
    excludedClasses: Set<string>;
    setExcludedClasses: (filteredClasses: Set<string>) => void;
}

interface IClassStatsProps {
    stats: IClassStats;
    totalStats: ITypeStats;
    onExcludedClassChange: (cls: string) => void;
    isExcluded: boolean;
}

export const Stats = (props: IStatsProps) => {
    const { data, excludedClasses, setExcludedClasses } = props;
    const [sortType, setSortType] = React.useState(SortType.AllLogsCount);

    const typeStats = React.useMemo(() => {
        if (!data) {
            return {} as ITypeStats;
        }
        const typeCounts = data.reduce(
            (acc, entry) => {
                const type = entry.level;
                if (!acc[type]) {
                    acc[type] = 0;
                }
                acc[type]++;
                return acc;
            },
            {} as Record<string, number>
        );
        return { ...typeCounts, total: data.length } as ITypeStats;
    }, [data]);

    const classStats = React.useMemo(() => {
        if (!data) {
            return [] as IClassStats[];
        }
        const classCounts = data.reduce(
            (acc, entry) => {
                const name = entry.loggingClass;
                if (!acc[name]) {
                    acc[name] = {
                        name,
                        [LogLevel.INFO]: 0,
                        [LogLevel.WARNING]: 0,
                        [LogLevel.ERROR]: 0,
                        [LogLevel.DEBUG]: 0,
                        [LogLevel.UNKNOWN]: 0,
                        total: 0,
                    };
                }
                acc[name][entry.level]++;
                acc[name].total++;
                return acc;
            },
            {} as Record<string, IClassStats>
        );
        return Object.values(classCounts);
    }, [data]);

    const sortedClassStats = React.useMemo(() => {
        switch (sortType) {
            case SortType.Alphabetical:
                return classStats.sort((a, b) => a.name.localeCompare(b.name));
            case SortType.AllLogsCount:
                return classStats.sort((a, b) => b.total - a.total);
            case SortType.InfoCount:
                return classStats.sort(
                    (a, b) => b[LogLevel.INFO] - a[LogLevel.INFO]
                );
            case SortType.WarningCount:
                return classStats.sort(
                    (a, b) => b[LogLevel.WARNING] - a[LogLevel.WARNING]
                );
            case SortType.ErrorCount:
                return classStats.sort(
                    (a, b) => b[LogLevel.ERROR] - a[LogLevel.ERROR]
                );
            case SortType.DebugCount:
                return classStats.sort(
                    (a, b) => b[LogLevel.DEBUG] - a[LogLevel.DEBUG]
                );
            case SortType.UnknownCount:
                return classStats.sort(
                    (a, b) => b[LogLevel.UNKNOWN] - a[LogLevel.UNKNOWN]
                );
            default:
                return classStats;
        }
    }, [classStats, sortType]);

    const onExcludedClassChange = React.useCallback(
        (cls: string) => {
            const newSet = new Set(excludedClasses);
            if (newSet.has(cls)) {
                newSet.delete(cls);
            } else {
                newSet.add(cls);
            }
            setExcludedClasses(newSet);
        },
        [excludedClasses, setExcludedClasses]
    );

    return (
        <div className="stats">
            <h2>Stats by Logging Level</h2>
            <ul className="level-stats">
                <li>
                    <span className="badge count">All Logs:</span>{' '}
                    {typeStats.total ?? 0}
                </li>
                <li>
                    <span className="badge info">Info:</span>{' '}
                    {typeStats[LogLevel.INFO] ?? 0}
                </li>
                <li>
                    <span className="badge warning">Warning:</span>{' '}
                    {typeStats[LogLevel.WARNING] ?? 0}
                </li>
                <li>
                    <span className="badge error">Error:</span>{' '}
                    {typeStats[LogLevel.ERROR] ?? 0}
                </li>
                <li>
                    <span className="badge debug">Debug:</span>{' '}
                    {typeStats[LogLevel.DEBUG] ?? 0}
                </li>
                <li>
                    <span className="badge unknown">Unknown:</span>{' '}
                    {typeStats[LogLevel.UNKNOWN] ?? 0}
                </li>
            </ul>

            <h2>Stats by Logging Class</h2>
            <div>
                Sort by{' '}
                <select
                    value={sortType}
                    onChange={(e) => setSortType(+e.target.value)}
                >
                    <option value={SortType.Alphabetical}>Alphabetical</option>
                    <option value={SortType.AllLogsCount}>
                        All logs count
                    </option>
                    <option value={SortType.InfoCount}>Info count</option>
                    <option value={SortType.WarningCount}>Warning count</option>
                    <option value={SortType.ErrorCount}>Error count</option>
                    <option value={SortType.DebugCount}>Debug count</option>
                    <option value={SortType.UnknownCount}>Unknown count</option>
                </select>
            </div>
            <table className="class-stats">
                <thead>
                    <tr>
                        <th>Class</th>
                        <th className="stats-header">All</th>
                        <th className="stats-header">Info</th>
                        <th className="stats-header">Warning</th>
                        <th className="stats-header">Error</th>
                        <th className="stats-header">Debug</th>
                        <th className="stats-header">Unknown</th>
                    </tr>
                </thead>
                <tbody>
                    {sortedClassStats.map((stat) => (
                        <ClassStats
                            key={stat.name}
                            stats={stat}
                            totalStats={typeStats}
                            onExcludedClassChange={onExcludedClassChange}
                            isExcluded={excludedClasses.has(stat.name)}
                        />
                    ))}
                </tbody>
            </table>
        </div>
    );
};

const getPercentage = (value: number, total: number) => {
    if (!total) {
        return 0;
    }
    return ((value / total) * 100).toFixed(2);
};

const ClassStats = (props: IClassStatsProps) => {
    const { stats, totalStats, isExcluded, onExcludedClassChange } = props;
    return (
        <tr key={stats.name}>
            <td className="class-name">
                <label>
                    <input
                        type="checkbox"
                        checked={!isExcluded}
                        onChange={() => onExcludedClassChange(stats.name)}
                    />{' '}
                    {stats.name}
                </label>
            </td>
            <td>
                <span className="badge count">{stats.total}</span>
            </td>
            <td>
                <span className="badge info">
                    {stats[LogLevel.INFO]} (
                    {getPercentage(
                        stats[LogLevel.INFO],
                        totalStats[LogLevel.INFO]
                    )}
                    %)
                </span>
            </td>
            <td>
                <span className="badge warning">
                    {stats[LogLevel.WARNING]} (
                    {getPercentage(
                        stats[LogLevel.WARNING],
                        totalStats[LogLevel.WARNING]
                    )}
                    %)
                </span>
            </td>
            <td>
                <span className="badge error">
                    {stats[LogLevel.ERROR]} (
                    {getPercentage(
                        stats[LogLevel.ERROR],
                        totalStats[LogLevel.ERROR]
                    )}
                    %)
                </span>
            </td>
            <td>
                <span className="badge debug">
                    {stats[LogLevel.DEBUG]} (
                    {getPercentage(
                        stats[LogLevel.DEBUG],
                        totalStats[LogLevel.DEBUG]
                    )}
                    %)
                </span>
            </td>
            <td>
                <span className="badge unknown">
                    {stats[LogLevel.UNKNOWN]} (
                    {getPercentage(
                        stats[LogLevel.UNKNOWN],
                        totalStats[LogLevel.UNKNOWN]
                    )}
                    %)
                </span>
            </td>
        </tr>
    );
};
