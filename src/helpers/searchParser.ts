import { ISearchData, ISearchSerialized } from '../data/ISearchSerialization';
import { SearchFilter } from '../data/SearchFilter';
import { SearchGroup } from '../data/SearchGroup';

export const parseSearchData = (data: ISearchSerialized[]) => {
    const searches = data.map((searchData) => {
        if ('isGroup' in searchData && searchData.isGroup) {
            return new SearchGroup(searchData);
        } else {
            return new SearchFilter(searchData as ISearchData);
        }
    });
    if (!searches.length || searches[0] instanceof SearchGroup) {
        return searches;
    }
    const parentGroup = new SearchGroup();
    parentGroup.children = searches;
    return [parentGroup];
};
