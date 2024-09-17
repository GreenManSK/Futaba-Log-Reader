import { LogLevel } from "./ILogEntry";
import { ISearchData } from "./SearchFilter";

export interface IPreset {
  name: string;
  category: string;
  data: IPresetData;
}

export interface IPresetData {
  levelFilter: LogLevel[];
  searchData: ISearchData[];
  includedClasses: string[];
}
