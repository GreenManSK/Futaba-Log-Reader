import React from "react";
import { useLogsDataContext } from "../../contexts/LogsDataContext";

export const SessionSelector = () => {
    const { currentSession, sessions, setCurrentSession, fileName } = useLogsDataContext();

    const onChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const session = sessions.find(s => s.name === e.target.value);
        if (session) {
            setCurrentSession(session);
        }
    }

    // Create HTML select to choose session
    return <div>
        <strong>Current file:</strong> {fileName} &nbsp;
        <strong>Current session:</strong> &nbsp;
        <select value={currentSession?.name} onChange={onChange}>
            {sessions.map(session => <option key={session.name} value={session.name}>{session.name}</option>)}
        </select>
    </div>;
};