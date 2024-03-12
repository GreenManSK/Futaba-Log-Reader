import { ILogEntry, LogLevel } from "./ILogEntry";
import { ISearchFilter } from "./ISearchFilter";

const CALL_ID_PREFIX = "CID[";
class LogEntry implements ILogEntry {
    public id: number;
    public date: string;
    public level: LogLevel;
    public loggingClass: string;
    public message: string;
    public callId?: string;

    private _loggingClassLowerCase?: string;
    private _messageLoweCase?: string;

    constructor(id: number, date: string, level: LogLevel, loggingClass: string, message: string) {
        this.id = id;
        this.date = date;
        this.level = level;
        this.message = message;
        this.loggingClass = loggingClass;
        this.setLoggingClassData(loggingClass);
    }

    public matchesFilter(search: ISearchFilter): boolean {
        return this.messageMatchesFilter(search) || this.loggingClassMatchesFilter(search);
    }

    private messageMatchesFilter(search: ISearchFilter): boolean {
        if (this._messageLoweCase === undefined) {
            this._messageLoweCase = this.message.toLowerCase();
        }
        return search.matchesFilter(this.message, this._messageLoweCase);
    }

    private loggingClassMatchesFilter(search: ISearchFilter): boolean {
        if (this._loggingClassLowerCase === undefined) {
            this._loggingClassLowerCase = this.loggingClass.toLowerCase();
        }
        return search.matchesFilter(this.loggingClass, this._loggingClassLowerCase) || !!(this.callId && search.matchesFilter(this.callId, this.callId));
    }

    private setLoggingClassData(loggingClass: string) {
        if (!loggingClass.startsWith(CALL_ID_PREFIX)) {
            this.loggingClass = loggingClass;
            return;
        }
        const [callId, className] = loggingClass.split("] ");
        this.callId = callId.slice(CALL_ID_PREFIX.length);
        this.loggingClass = className;
    }
}

const stringToLogLevel = (level: string): LogLevel => {
    switch (level.toLowerCase()) {
        case "inf":
            return LogLevel.INFO;
        case "war":
            return LogLevel.WARNING;
        case "deb":
            return LogLevel.DEBUG;
        case "err":
            return LogLevel.ERROR;
        default:
            return LogLevel.UNKNOWN;
    }
}

const parseLine = (line: string, index: number): ILogEntry => {
    const dateSeparator = line.indexOf(" ");
    const levelSeparator = line.indexOf("\t");
    const loggingClassSeparator = line.indexOf(":", levelSeparator);

    const date = line.slice(0, dateSeparator);
    const level = line.slice(dateSeparator + 1, levelSeparator);
    const loggingClass = line.slice(levelSeparator + 1, loggingClassSeparator);
    const message = line.slice(loggingClassSeparator + 1).trim();

    return new LogEntry(index + 1, date, stringToLogLevel(level), loggingClass, message);
};

const SESSION_SPLITTER = "The following logs are for previous session";

export const parseLogs = (logs: string): ILogEntry[] => {
    const lines = logs.split('\r');
    // First line contains info about how many logs are guaranteed
    lines.shift();

    const sessionSplitterIndex = lines.findIndex(line => line.includes(SESSION_SPLITTER));
    if (sessionSplitterIndex !== -1) {
        lines.splice(sessionSplitterIndex);
    }

    return lines.map(line => line.trim()).filter(line => line !== "").map(parseLine);
}