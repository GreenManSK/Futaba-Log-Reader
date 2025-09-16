import { ISearchFilter } from './ISearchFilter';
import { ISearchData, ISearchGroupData } from './ISearchSerialization';
import { SearchFilter } from './SearchFilter';

export class SearchGroup implements ISearchFilter {
    private static _idCounter: number = 0;

    public enabled: boolean = true;
    public isOr: boolean = false;
    public children: ISearchFilter[] = [];

    private _id: number;

    constructor(data?: ISearchGroupData) {
        this._id = SearchGroup._idCounter++;
        if (data) {
            this.enabled = data.enabled;
            this.isOr = data.isOr;
            this.children = data.children.map((child) => {
                if ('isGroup' in child && child.isGroup) {
                    return new SearchGroup(child);
                } else {
                    return new SearchFilter(child as ISearchData);
                }
            });
        } else {
            this.children = [new SearchFilter()];
        }
    }

    public matchesFilter(text: string, lowerCaseText?: string): boolean {
        if (!this.enabled || !this.children.length) {
            return true;
        }

        for (const child of this.children) {
            if (!child.enabled) {
                continue;
            }
            const isMatch = child.matchesFilter(text, lowerCaseText);
            if (this.isOr && isMatch) {
                return true;
            }
            if (!this.isOr && !isMatch) {
                return false;
            }
        }

        return this.isOr ? false : true;
    }

    public get id(): number {
        return this._id;
    }

    public getData(): ISearchGroupData {
        return {
            isGroup: true,
            enabled: this.enabled,
            isOr: this.isOr,
            children: this.children.map((child) => child.getData()),
        };
    }
}
