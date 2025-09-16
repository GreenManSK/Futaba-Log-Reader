import React from 'react';
import './LogTable.css';
import { ILogEntry, LogLevel } from '../../data/ILogEntry';
import { Heart, HeartOff } from 'lucide-react';

interface ILogTableProps {
    data: ILogEntry[];
    favourites: Set<number>;
    setFavourites: (favourites: Set<number>) => void;
}

const HeartMemo = React.memo(Heart);
HeartMemo.displayName = 'HeartMemo';
const HeartOffMemo = React.memo(HeartOff);
HeartOffMemo.displayName = 'HeartOffMemo';

export const LogTable = React.memo((props: ILogTableProps) => {
    const { data, favourites, setFavourites } = props;

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

    return (
        <table className="logs">
            <thead>
                <tr>
                    <th>#</th>
                    <th>Date</th>
                    <th>Level</th>
                    <th>Class</th>
                    <th>Message</th>
                </tr>
            </thead>
            <tbody>
                {data.map((entry) => (
                    <LogTableRow
                        key={entry.id}
                        entry={entry}
                        toggleFavourite={toggleFavourite}
                        isFavourite={favourites.has(entry.id)}
                    />
                ))}
            </tbody>
        </table>
    );
});
LogTable.displayName = 'LogTable';

interface ILogTableRowProps {
    isFavourite: boolean;
    toggleFavourite: (id: number) => void;
    entry: ILogEntry;
}
const LogTableRow = React.memo((props: ILogTableRowProps) => {
    const { entry, isFavourite, toggleFavourite } = props;

    return (
        <tr className={`level-${entry.level}`}>
            <td className="number">
                <button
                    className="fav-button"
                    onClick={() => toggleFavourite(entry.id)}
                    title={
                        isFavourite
                            ? 'Add to favourites'
                            : 'Remove from favourites'
                    }
                >
                    {isFavourite ? (
                        <HeartOffMemo fill="white" size={12} />
                    ) : (
                        <HeartMemo fill="white" size={12} />
                    )}
                </button>
                {entry.id}
            </td>
            <td className="date">{entry.dateText}</td>
            <td>{LogLevel[entry.level]}</td>
            <td className="class-name">
                {entry.loggingClass}
                {entry.callId && <div className="call-id">{entry.callId}</div>}
            </td>
            <td className="message">{entry.message}</td>
        </tr>
    );
});
LogTableRow.displayName = 'LogTableRow';
