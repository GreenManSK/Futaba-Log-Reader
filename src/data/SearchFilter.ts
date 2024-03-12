import { ISearchFilter } from "./ISearchFilter";

export class SearchFilter implements ISearchFilter {
    private static _idCounter: number = 0;

    public enabled: boolean = true;

    private _isCaseSensitive: boolean = false;
    private _isRegex: boolean = false;

    private _text: string = "";
    private _searchText: string = "";
    private _searchRegex?: RegExp;

    private _id: number;

    constructor() {
        this._id = SearchFilter._idCounter++;
    }

    public matchesFilter(text: string, lowerCaseText?: string | undefined): boolean {
        if (!this.enabled || this._text === "") {
            return true;
        }

        if (this._isRegex && this._searchRegex) {
            return this._searchRegex.test(text);
        }

        if (this.isCaseSensitive) {
            return text.includes(this._searchText);
        }

        return lowerCaseText ? lowerCaseText.includes(this._searchText) : text.toLowerCase().includes(this._searchText);
    }

    public set isCaseSensitive(value: boolean) {
        this._isCaseSensitive = value;
        this.prepareSearch();
    }
    public get isCaseSensitive(): boolean {
        return this._isCaseSensitive;
    }

    public set isRegex(value: boolean) {
        this._isRegex = value;
        this.prepareSearch();
    }
    public get isRegex(): boolean {
        return this._isRegex;
    }

    public set text(value: string) {
        this._text = value;
        this.prepareSearch();
    }

    public get text(): string {
        return this._text;
    }

    public get id(): number {
        return this._id;
    }

    private prepareSearch() {
        if (this._isRegex) {
            this._searchRegex = new RegExp(this._text, this._isCaseSensitive ? "g" : "gi");
            return;
        }
        this._searchText = this._isCaseSensitive ? this._text : this._text.toLowerCase();
    }

}