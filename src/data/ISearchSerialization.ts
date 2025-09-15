
export type ISearchData = {
    text: string;
    enabled: boolean;
    isCaseSensitive: boolean;
    isRegex: boolean;
}

export type ISearchGroupData = {
    isGroup: true;
    enabled: boolean;
    isOr: boolean;
    children: (ISearchGroupData | ISearchData)[]
}

export type ISearchSerialized = ISearchData | ISearchGroupData;