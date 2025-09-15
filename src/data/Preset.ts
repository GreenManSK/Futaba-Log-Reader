import { LogLevel } from "./ILogEntry";
import { ISearchSerialized } from "./ISearchSerialization";

export interface IPreset {
  name: string;
  category: string;
  data: IPresetData;
}

export interface IPresetData {
  levelFilter: LogLevel[];
  searchData: ISearchSerialized[];
  includedClasses: string[];
}
