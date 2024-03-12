import React from "react";
import { ILogEntry, LogLevel } from "../../data/ILogEntry";

enum SortType {
    Alphabetical,
    AllLogsCount,
    InfoCount,
    WarningCount,
    ErrorCount,
    DebugCount,
    UnknownCount
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
        const typeCounts = data.reduce((acc, entry) => {
            const type = entry.level;
            if (!acc[type]) {
                acc[type] = 0;
            }
            acc[type]++;
            return acc;
        }, {} as Record<string, number>);
        return { ...typeCounts, total: data.length } as ITypeStats;
    }, [data]);

    const classStats = React.useMemo(() => {
        if (!data) {
            return [] as IClassStats[];
        }
        const classCounts = data.reduce((acc, entry) => {
            const name = entry.loggingClass;
            if (!acc[name]) {
                acc[name] = {
                    name,
                    [LogLevel.INFO]: 0,
                    [LogLevel.WARNING]: 0,
                    [LogLevel.ERROR]: 0,
                    [LogLevel.DEBUG]: 0,
                    [LogLevel.UNKNOWN]: 0,
                    total: 0
                };
            }
            acc[name][entry.level]++;
            acc[name].total++;
            return acc;
        }, {} as Record<string, IClassStats>);
        return Object.values(classCounts);
    }, [data]);

    const sortedClassStats = React.useMemo(() => {
        switch (sortType) {
            case SortType.Alphabetical:
                return classStats.sort((a, b) => a.name.localeCompare(b.name));
            case SortType.AllLogsCount:
                return classStats.sort((a, b) => b.total - a.total);
            case SortType.InfoCount:
                return classStats.sort((a, b) => b[LogLevel.INFO] - a[LogLevel.INFO]);
            case SortType.WarningCount:
                return classStats.sort((a, b) => b[LogLevel.WARNING] - a[LogLevel.WARNING]);
            case SortType.ErrorCount:
                return classStats.sort((a, b) => b[LogLevel.ERROR] - a[LogLevel.ERROR]);
            case SortType.DebugCount:
                return classStats.sort((a, b) => b[LogLevel.DEBUG] - a[LogLevel.DEBUG]);
            case SortType.UnknownCount:
                return classStats.sort((a, b) => b[LogLevel.UNKNOWN] - a[LogLevel.UNKNOWN]);
            default:
                return classStats;
        }
    }, [classStats, sortType]);

    const onExcludedClassChange = React.useCallback((cls: string) => {
        const newSet = new Set(excludedClasses);
        if (newSet.has(cls)) {
            newSet.delete(cls);
        } else {
            newSet.add(cls);
        }
        setExcludedClasses(newSet);
    }, [excludedClasses, setExcludedClasses]);

    return <>
        <h2>Stats by log type</h2>
        <strong>Lines:</strong> {typeStats.total ?? 0}<br />
        <strong>Info:</strong> {typeStats[LogLevel.INFO] ?? 0}<br />
        <strong>Warning:</strong> {typeStats[LogLevel.WARNING] ?? 0}<br />
        <strong>Error:</strong> {typeStats[LogLevel.ERROR] ?? 0}<br />
        <strong>Debug:</strong> {typeStats[LogLevel.DEBUG] ?? 0}<br />
        <strong>Unknown:</strong> {typeStats[LogLevel.UNKNOWN] ?? 0}<br />

        <h2>Stats by log class</h2>
        Sort by <select value={sortType} onChange={e => setSortType(+e.target.value)}>
            <option value={SortType.Alphabetical}>Alphabetical</option>
            <option value={SortType.AllLogsCount}>All logs count</option>
            <option value={SortType.InfoCount}>Info count</option>
            <option value={SortType.WarningCount}>Warning count</option>
            <option value={SortType.ErrorCount}>Error count</option>
            <option value={SortType.DebugCount}>Debug count</option>
            <option value={SortType.UnknownCount}>Unknown count</option>
        </select>
        <ul>
            {sortedClassStats.map((stat) => <ClassStats
                key={stat.name}
                stats={stat}
                totalStats={typeStats}
                onExcludedClassChange={onExcludedClassChange}
                isExcluded={excludedClasses.has(stat.name)}
            />)}
        </ul>
    </>
}

const getPercentage = (value: number, total: number) => {
    if (!total) {
        return 0;
    }
    return (value / total * 100).toFixed(2);
}

const ClassStats = (props: IClassStatsProps) => {
    const { stats, totalStats, isExcluded, onExcludedClassChange } = props;
    return <li key={stats.name}>
        <input type="checkbox" checked={!isExcluded} onChange={() => onExcludedClassChange(stats.name)} />
        <strong>{stats.name}</strong> - ({stats.total})
        (i{stats[LogLevel.INFO]} - {getPercentage(stats[LogLevel.INFO], totalStats[LogLevel.INFO])}%)
        (w{stats[LogLevel.WARNING]} - {getPercentage(stats[LogLevel.WARNING], totalStats[LogLevel.WARNING])}%)
        (e{stats[LogLevel.ERROR]} - {getPercentage(stats[LogLevel.ERROR], totalStats[LogLevel.ERROR])}%)
        (d{stats[LogLevel.DEBUG]} - {getPercentage(stats[LogLevel.DEBUG], totalStats[LogLevel.DEBUG])}%)
        (u{stats[LogLevel.UNKNOWN]} - {getPercentage(stats[LogLevel.UNKNOWN], totalStats[LogLevel.UNKNOWN])}%)
    </li>
};