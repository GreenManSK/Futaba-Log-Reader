import React from "react";
import { parseLogs } from "../data/LogParser";
import { ILogEntry } from "../data/ILogEntry";

interface ILogsDataContext {
    data?: ILogEntry[]
    readData: (content: string) => void
}

export const LogsDataContext = React.createContext<ILogsDataContext>({
    readData: () => { }
});
export const useLogsDataContext = () => React.useContext(LogsDataContext);

export const LogsDataProvider: React.FC<React.PropsWithChildren> = ({ children }) => {
    const [data, setData] = React.useState<ILogEntry[] | undefined>();

    const readData = (content: string) => {
        setData(parseLogs(content))
    };

    return (
        <LogsDataContext.Provider value={{ data, readData }}>
            {children}
        </LogsDataContext.Provider>
    );
};