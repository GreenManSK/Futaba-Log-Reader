import React from "react";
import './LogTable.css';
import { ILogEntry, LogLevel } from "../../data/ILogEntry";

interface ILogTableProps {
    data: ILogEntry[],
    favourites: Set<number>;
    setFavourites: (favourites: Set<number>) => void;
}

export const LogTable = (props: ILogTableProps) => {
    const { data, favourites, setFavourites } = props;
    const toggleFavourite = (id: number) => {
        const newFavourites = new Set(favourites);
        if (newFavourites.has(id)) {
            newFavourites.delete(id);
        } else {
            newFavourites.add(id);
        }
        setFavourites(newFavourites);
    }

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
                {data.map((entry, index) => (
                    <tr key={index} className={`level-${entry.level}`}>
                        <td className="number">
                            <button className="fav-button" onClick={() => toggleFavourite(entry.id)} title={favourites.has(entry.id) ? "Add to favourites" : "Remove from favourites"}>{favourites.has(entry.id) ? "🫀" : "♡"}</button>
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
                ))}
            </tbody>
        </table>
    );
}