import React from 'react';
import { ILogEntry, LogLevel } from '../../data/ILogEntry';
import { SearchFilter } from '../../data/SearchFilter';
import { ITimeRange, TimeRange } from './TimeRange';
import _ from 'lodash';
import { Searches } from '../Search/Searches';
import { LogTable } from './LogTable';
import { LineLimit } from './LineLimit';
import './FilteredLogTable.css';
import { ISearchFilter } from '../../data/ISearchFilter';
import { useSettingsContext } from '../../contexts/SettingsContext';
import { OptimizedLogTable } from './OptimizedLogTable';

interface IFilteredLogTableProps {
    data?: ILogEntry[];
    lineLimit: number;
    setLineLimit: (limit: number) => void;
    levelFilter: Set<LogLevel>;
    excludedClasses: Set<string>;
    searches: ISearchFilter[];
    setSearches: (searches: ISearchFilter[]) => void;
    timeRange: ITimeRange;
    setTimeRange: (range: ITimeRange) => void;
    favourites: Set<number>;
    setFavourites: (favourites: Set<number>) => void;
}

const FILTER_DEBOUNCE = 250;

export const FilteredLogTable = (props: IFilteredLogTableProps) => {
    const {
        data,
        lineLimit,
        setLineLimit,
        levelFilter,
        excludedClasses,
        searches,
        setSearches,
        timeRange,
        setTimeRange,
        favourites,
        setFavourites,
    } = props;

    const { isOptimizedRenderingEnabled } = useSettingsContext();

    const [filteredData, setFilteredData] = React.useState([] as ILogEntry[]);

    const updateFilteredData = React.useMemo(() => {
        const update = (
            data: ILogEntry[] | undefined,
            lineLimit: number,
            levelFilter: Set<LogLevel>,
            excludedClasses: Set<string>,
            searches: ISearchFilter[],
            timeRange: ITimeRange
        ) => {
            if (!data) {
                return [];
            }
            const prefiltered = data.filter(
                (entry) =>
                    levelFilter.has(entry.level) &&
                    !excludedClasses.has(entry.loggingClass) &&
                    entry.isInRange(timeRange.start, timeRange.end)
            );
            if (!searches.length) {
                setFilteredData(prefiltered.slice(0, lineLimit));
                return;
            }
            setFilteredData(
                prefiltered
                    .filter((entry) => {
                        return searches.every((search) =>
                            entry.matchesFilter(search)
                        );
                    })
                    .slice(0, lineLimit)
            );
        };
        return isOptimizedRenderingEnabled
            ? update
            : _.debounce(update, FILTER_DEBOUNCE);
    }, [setFilteredData, isOptimizedRenderingEnabled]);

    React.useEffect(() => {
        updateFilteredData(
            data,
            lineLimit,
            levelFilter,
            excludedClasses,
            searches,
            timeRange
        );
    }, [
        data,
        lineLimit,
        levelFilter,
        excludedClasses,
        searches,
        updateFilteredData,
        timeRange,
    ]);

    return (
        <>
            <div className="table-tools">
                <TimeRange timeRange={timeRange} setTimeRange={setTimeRange} />
                <Searches searches={searches} setSearches={setSearches} />
            </div>
            {isOptimizedRenderingEnabled ? (
                <OptimizedLogTable
                    data={filteredData}
                    favourites={favourites}
                    setFavourites={setFavourites}
                />
            ) : (
                <LogTable
                    data={filteredData}
                    favourites={favourites}
                    setFavourites={setFavourites}
                />
            )}
            <LineLimit lineLimit={lineLimit} setLineLimit={setLineLimit} />
        </>
    );
};
