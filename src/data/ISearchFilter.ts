import { ISearchSerialized } from "./ISearchSerialization";

export interface ISearchFilter {
    id: number;
    enabled: boolean;
    matchesFilter(text: string, lowerCaseText?: string): boolean;
    getData(): ISearchSerialized;
}