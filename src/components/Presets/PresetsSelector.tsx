import React from "react";
import { usePresetsContext } from "../../contexts/PresetsContext";
import { IPreset } from "../../data/Preset";
import "./PresetsSelector.css";
import { DEFAULT_LEVEL_FILTER, useDataStorageContext } from "../../contexts/DataStorageContext";
import { SearchFilter } from "../../data/SearchFilter";
import { useLogsDataContext } from "../../contexts/LogsDataContext";

export interface IPresetsSelectorProps {
    setIsEditMode: (isEditMode: boolean) => void;
}

export const PresetsSelector = (props: IPresetsSelectorProps) => {
    const { presets } = usePresetsContext();
    const { setLevelFilter, setExcludedClasses, setSearches } = useDataStorageContext();
    const { currentSession } = useLogsDataContext();
    const [value, setValue] = React.useState<number | undefined>(undefined);

    const presetOptions = React.useMemo(() => {
        // group presets by category
        const groupedPresets: { [key: string]: (IPreset & { id: number })[] } = {};
        presets.forEach((preset, index) => {
            if (!groupedPresets[preset.category]) {
                groupedPresets[preset.category] = [];
            }
            groupedPresets[preset.category].push({ ...preset, id: index });
        });
        return groupedPresets;
    }, [presets]);

    const loadPreset = () => {
        if (value === undefined) {
            return;
        }
        const preset = presets[value];
        const classes = new Set(Array.from(new Set(currentSession?.data.map(entry => entry.loggingClass).sort((a, b) => a.localeCompare(b)))) || []);
        preset.data.includedClasses.forEach(cls => classes.delete(cls));
        setLevelFilter(new Set(preset.data.levelFilter));
        setExcludedClasses(classes);
        setSearches([
            ...preset.data.searchData.map(data => new SearchFilter(data)),
            new SearchFilter()
        ]);
    };

    const clearPreset = () => {
        setLevelFilter(new Set(DEFAULT_LEVEL_FILTER));
        setExcludedClasses(new Set());
        setSearches([new SearchFilter()]);
    };

    return <div className="PresetsSelector">
        <select name="preset" value={value} onChange={e => {
            const value = parseInt(e.target.value);
            setValue(isNaN(value) ? undefined : value);
        }
        }>
            <option value="">Choose a preset</option>
            {Object.entries(presetOptions).map(([category, presets]) => {
                return <optgroup label={category} key={category}>
                    {presets.map(preset => {
                        return <option key={preset.name} value={preset.id}>{preset.name}</option>;
                    })}
                </optgroup>;
            })}
        </select>
        <div className="buttons">
            <button onClick={loadPreset} disabled={value === undefined}>Load</button>
            <button onClick={() => props.setIsEditMode(true)}>Edit</button>
            <button onClick={clearPreset}>Clear</button>
        </div>
    </div>;
};