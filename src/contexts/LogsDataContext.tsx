import React from 'react';
import { parseLogs } from '../data/LogParser';
import { ILogSession } from '../data/ILogSession';

interface ILogsDataContext {
    currentSession?: ILogSession;
    sessions: ILogSession[];
    fileName?: string;
    dataHash?: string;
    readData: (fileName: string, content: string) => void;
    setCurrentSession: (session: ILogSession) => void;
    clearData: () => void;
}

export const LogsDataContext = React.createContext<ILogsDataContext>({
    sessions: [],
    readData: () => {},
    setCurrentSession: () => {},
    clearData: () => {},
});
export const useLogsDataContext = () => React.useContext(LogsDataContext);

export const LogsDataProvider: React.FC<React.PropsWithChildren> = ({
    children,
}) => {
    const [dataHash, setDataHash] = React.useState<string>('');
    const [fileName, setFileName] = React.useState<string>('');
    const [sessions, setSessions] = React.useState<ILogSession[]>([]);
    const [currentSession, setCurrentSession] = React.useState<
        ILogSession | undefined
    >();

    const readData = (fileName: string, content: string) => {
        const { sessions, hash } = parseLogs(content);
        setSessions(sessions);
        setCurrentSession(sessions[0]);
        setDataHash(hash);
        setFileName(fileName);
    };
    const clearData = () => {
        setSessions([]);
        setCurrentSession(undefined);
        setDataHash('');
    };

    return (
        <LogsDataContext.Provider
            value={{
                dataHash,
                fileName,
                sessions,
                currentSession,
                readData,
                setCurrentSession,
                clearData,
            }}
        >
            {children}
        </LogsDataContext.Provider>
    );
};
