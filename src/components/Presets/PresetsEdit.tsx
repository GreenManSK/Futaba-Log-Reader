import React from "react";
import "./PresetsEdit.css";
import { usePresetsContext } from "../../contexts/PresetsContext";
import { IPreset } from "../../data/Preset";
import { useDataStorageContext } from "../../contexts/DataStorageContext";
import { useLogsDataContext } from "../../contexts/LogsDataContext";

export interface IPresetsEditProps {
    setIsEditMode: (isEditMode: boolean) => void;
}

export const PresetsEdit = (props: IPresetsEditProps) => {
    const { setIsEditMode } = props;
    const { presets, remove, update } = usePresetsContext();
    const { levelFilter, searches, excludedClasses } = useDataStorageContext();
    const { currentSession } = useLogsDataContext();

    const [category, setCategory] = React.useState("");
    const [name, setName] = React.useState("");

    const saveData = (presetToUpdate?: IPreset) => {
        if (!presetToUpdate && (!category || !name)) {
            return;
        }
        const preset = {
            category: category || presetToUpdate?.category || "",
            name: name || presetToUpdate?.name || "",
            data: {
                levelFilter: Array.from(levelFilter),
                searchData: searches.map(s => s.getData()),
                includedClasses: currentSession?.data.map(entry => entry.loggingClass).filter(cls => !excludedClasses.has(cls)) || []
            }
        };
        update(presetToUpdate || preset, preset);
    };

    return <div className="PresetsEdit">
        <div className="form">
            <label htmlFor="category-input">Category</label><br />
            <input type="text" id="category-input" placeholder="Category name" value={category} onChange={e => setCategory(e.target.value)} /><br />
            <label htmlFor="name-input">Name</label><br />
            <input type="text" id="name-input" placeholder="Preset name" value={name} onChange={e => setName(e.target.value)} /><br />
        </div>
        <div className="buttons">
            <button onClick={() => saveData()}>Save current</button>
            <button onClick={() => setIsEditMode(false)}>Close</button>
        </div>
        <hr />
        <ul className="preset-list">
            {presets.map(preset => {
                return <li className="preset" key={preset.name}>
                    <strong>{preset.category}</strong> - {preset.name}<br />
                    <button onClick={() => saveData(preset)}>Update with current</button>&nbsp;
                    <button onClick={() => remove(preset)}>Delete</button>
                </li>;
            })}
        </ul>
    </div>;
}