import React from "react";
import { useLogsDataContext } from "../../contexts/LogsDataContext";

export const SessionSelector = () => {
    const { currentSession, sessions, setCurrentSession } = useLogsDataContext();

    const onChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const session = sessions.find(s => s.name === e.target.value);
        if (session) {
            setCurrentSession(session);
        }
    }

    // Create HTML select to choose session
    return <div>
        Current session:
        <select value={currentSession?.name} onChange={onChange}>
            {sessions.map(session => <option key={session.name} value={session.name}>{session.name}</option>)}
        </select>
    </div>;
};