import { ISearchFilter } from "./ISearchFilter";

export enum LogLevel {
    INFO,
    WARNING,
    ERROR,
    DEBUG,
    UNKNOWN
};

export interface ILogEntry {
    id: number,
    dateText: string,
    date: Date,
    level: LogLevel,
    loggingClass: string,
    message: string
    callId?: string;

    matchesFilter(search: ISearchFilter): boolean;
    isInRange(start: Date, end: Date): boolean;
}