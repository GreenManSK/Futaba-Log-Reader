import React from "react";
import { parseLogs } from "../data/LogParser";
import { ILogEntry } from "../data/ILogEntry";
import { ILogSession } from "../data/ILogSession";

interface ILogsDataContext {
    currentSession?: ILogSession
    sessions: ILogSession[]
    readData: (content: string) => void
    setCurrentSession: (session: ILogSession) => void
}

export const LogsDataContext = React.createContext<ILogsDataContext>({
    sessions: [],
    readData: () => { },
    setCurrentSession: () => { }
});
export const useLogsDataContext = () => React.useContext(LogsDataContext);

export const LogsDataProvider: React.FC<React.PropsWithChildren> = ({ children }) => {
    const [sessions, setSessions] = React.useState<ILogSession[]>([]);
    const [currentSession, setCurrentSession] = React.useState<ILogSession | undefined>();

    const readData = (content: string) => {
        const sessions = parseLogs(content);
        setSessions(sessions)
        setCurrentSession(sessions[0])
    };

    return (
        <LogsDataContext.Provider value={{ sessions, currentSession, readData, setCurrentSession }}>
            {children}
        </LogsDataContext.Provider>
    );
};