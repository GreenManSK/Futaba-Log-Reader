import React from "react";
import { parseLogs } from "../data/LogParser";
import { ILogSession } from "../data/ILogSession";

interface ILogsDataContext {
    currentSession?: ILogSession
    sessions: ILogSession[]
    readData: (content: string) => void
    setCurrentSession: (session: ILogSession) => void
    clearData: () => void
}

export const LogsDataContext = React.createContext<ILogsDataContext>({
    sessions: [],
    readData: () => { },
    setCurrentSession: () => { },
    clearData: () => { }
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
    const clearData = () => {
        setSessions([]);
        setCurrentSession(undefined);
    }

    return (
        <LogsDataContext.Provider value={{ sessions, currentSession, readData, setCurrentSession, clearData }}>
            {children}
        </LogsDataContext.Provider>
    );
};