import { ILogEntry } from "./ILogEntry";

export interface ILogSession {
    name: string;
    data: ILogEntry[];
}