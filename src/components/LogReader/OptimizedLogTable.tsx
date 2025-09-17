import React from 'react';
import './LogTable.css';
import { ILogEntry, LogLevel } from '../../data/ILogEntry';
import { Heart, HeartOff } from 'lucide-react';
import {
    Table,
    Column,
    AutoSizer,
    Index,
    TableCellProps,
} from 'react-virtualized';
import { calculateEntryHeight } from '../../helpers/tableRowHeightCalculator';
import { useOptimizedTableContext } from '../../contexts/OptimizedTableContext';
import { SearchHighlighter } from './SearchHighlighter';
import { useSearchHighlighterContext } from '../../contexts/SearchHighlighterContext';

interface ILogTableProps {
    data: ILogEntry[];
    favourites: Set<number>;
    setFavourites: (favourites: Set<number>) => void;
}
const HeartMemo = React.memo(Heart);
HeartMemo.displayName = 'HeartMemo';
const HeartOffMemo = React.memo(HeartOff);
HeartOffMemo.displayName = 'HeartOffMemo';

const ID_WIDTH = 65;
const DATE_WIDTH = 180;
const LEVEL_WIDTH = 100;
const CLASS_WIDTH = 350;

export const OptimizedLogTable = React.memo((props: ILogTableProps) => {
    const { data, favourites, setFavourites } = props;

    const [tableWidth, setTableWidth] = React.useState(0);
    const tableRef = useOptimizedTableContext();
    const { activeId } = useSearchHighlighterContext();

    const toggleFavourite = React.useCallback(
        (id: number) => {
            const newFavourites = new Set(favourites);
            if (newFavourites.has(id)) {
                newFavourites.delete(id);
            } else {
                newFavourites.add(id);
            }
            setFavourites(newFavourites);
        },
        [favourites, setFavourites]
    );

    const getRowClassName = React.useCallback(
        ({ index }: Index) => {
            if (index < 0) {
                return 'logs-row';
            }
            return `logs-row level-${data[index].level}`;
        },
        [data]
    );

    const getRowHeight = React.useCallback(
        ({ index }: Index) =>
            calculateEntryHeight(
                data[index],
                CLASS_WIDTH,
                tableWidth - ID_WIDTH - DATE_WIDTH - LEVEL_WIDTH
            ),
        [data, tableWidth]
    );

    const idRenderer = React.useCallback(
        ({ rowData }: TableCellProps) => (
            <>
                <button
                    className="fav-button"
                    onClick={() => toggleFavourite(rowData.id)}
                    title={
                        favourites.has(rowData.id)
                            ? 'Add to favourites'
                            : 'Remove from favourites'
                    }
                >
                    {favourites.has(rowData.id) ? (
                        <HeartOffMemo fill="white" size={12} />
                    ) : (
                        <HeartMemo fill="white" size={12} />
                    )}
                </button>
                {rowData.id}
            </>
        ),
        [favourites, setFavourites]
    );
    React.useEffect(() => {
        // Needed to update width of each row
        tableRef.current?.recomputeRowHeights();
    }, [tableWidth, data, tableRef]);

    React.useEffect(() => {
        const index = data.findIndex((entry) => entry.id === activeId);
        if (index === -1) {
            return;
        }
        tableRef.current?.scrollToRow(index);
    }, [activeId, data, tableRef]);

    // TODO: add noRowsRenderer
    return (
        <div className="table-wrapper">
            <AutoSizer onResize={({ width }) => setTableWidth(width)}>
                {({ width, height }) => (
                    <Table
                        ref={tableRef}
                        width={width}
                        height={height}
                        headerHeight={20}
                        rowHeight={getRowHeight}
                        rowCount={data.length}
                        rowGetter={({ index }) => data[index]}
                        className="logs"
                        headerClassName="logs-header"
                        rowClassName={getRowClassName}
                    >
                        <Column
                            label="#"
                            dataKey="id"
                            width={ID_WIDTH}
                            className="td"
                            cellRenderer={idRenderer}
                        />
                        <Column
                            label="Date"
                            dataKey="dateText"
                            cellRenderer={({ rowData }) => (
                                <SearchHighlighter
                                    text={rowData.dateText}
                                    id={rowData.id}
                                />
                            )}
                            width={DATE_WIDTH}
                            className="td date"
                        />
                        <Column
                            label="Level"
                            dataKey="level"
                            width={LEVEL_WIDTH}
                            className="td"
                            cellRenderer={({ rowData }) =>
                                LogLevel[rowData.level]
                            }
                        />
                        <Column
                            label="Class"
                            dataKey="class"
                            width={CLASS_WIDTH}
                            className="td class-name"
                            cellRenderer={({ rowData }) => (
                                <>
                                    <SearchHighlighter
                                        text={rowData.loggingClass}
                                        id={rowData.id}
                                    />
                                    {rowData.callId && (
                                        <div className="call-id">
                                            <SearchHighlighter
                                                text={rowData.callId}
                                                id={rowData.id}
                                            />
                                        </div>
                                    )}
                                </>
                            )}
                        />
                        <Column
                            label="Message"
                            dataKey="message"
                            cellRenderer={({ rowData }) => (
                                <SearchHighlighter
                                    text={rowData.message}
                                    id={rowData.id}
                                />
                            )}
                            width={100}
                            flexGrow={1}
                            key={width}
                            className={`td message`}
                        />
                    </Table>
                )}
            </AutoSizer>
        </div>
    );
});
OptimizedLogTable.displayName = 'LogTable';
