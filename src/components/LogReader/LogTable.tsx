import React from "react";
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
        <table border={1}>
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
                    <tr key={index}>
                        <td>
                            {entry.id}
                            <button onClick={() => toggleFavourite(entry.id)}>{favourites.has(entry.id) ? "💔" : "❤️"}</button>
                        </td>
                        <td>{entry.dateText}</td>
                        <td>{LogLevel[entry.level]}</td>
                        <td>
                            {entry.loggingClass}
                            {entry.callId && <sup>{entry.callId}</sup>}
                        </td>
                        <td>{entry.message}</td>
                    </tr>
                ))}
            </tbody>
        </table>
    );
}