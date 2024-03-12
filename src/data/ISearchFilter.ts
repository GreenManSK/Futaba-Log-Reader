export interface ISearchFilter {
    matchesFilter(text: string, lowerCaseText?: string): boolean;
}