import React from "react";
import { ILogEntry, LogLevel } from "../data/LogParser";

interface ILogTableProps {
    data: ILogEntry[]
}

export const LogTable = ({ data }: ILogTableProps) => {
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
                        <td>{entry.id}</td>
                        <td>{entry.date}</td>
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