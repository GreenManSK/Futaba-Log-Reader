import React from 'react';
import './PresetsEdit.css';
import { usePresetsContext } from '../../contexts/PresetsContext';
import { IPreset } from '../../data/Preset';
import { useDataStorageDataContext } from '../../contexts/DataStorageContext';
import { useLogsDataContext } from '../../contexts/LogsDataContext';
import { saveAs } from 'file-saver';

export interface IPresetsEditProps {
    setIsEditMode: (isEditMode: boolean) => void;
}

export const PresetsEdit = (props: IPresetsEditProps) => {
    const { setIsEditMode } = props;
    const {
        presets,
        remove,
        update,
        import: importPresets,
    } = usePresetsContext();
    const { levelFilter, searches, excludedClasses } =
        useDataStorageDataContext();
    const { currentSession } = useLogsDataContext();

    const fileUploadRef = React.useRef<HTMLInputElement>(null);

    const [category, setCategory] = React.useState('');
    const [name, setName] = React.useState('');
    const [uncheckedPresets, setUncheckedPresets] = React.useState<IPreset[]>(
        []
    );

    const saveData = (presetToUpdate?: IPreset) => {
        if (!presetToUpdate && (!category || !name)) {
            return;
        }
        const preset = {
            category: category || presetToUpdate?.category || '',
            name: name || presetToUpdate?.name || '',
            data: {
                levelFilter: Array.from(levelFilter),
                searchData: searches.map((s) => s.getData()),
                includedClasses:
                    currentSession?.data
                        .map((entry) => entry.loggingClass)
                        .filter((cls) => !excludedClasses.has(cls)) || [],
            },
        };
        update(presetToUpdate || preset, preset);
    };

    const exportData = () => {
        const data = JSON.stringify(
            presets.filter((p) => !uncheckedPresets.includes(p)),
            null,
            4
        );
        const blob = new Blob([data], { type: 'application/json' });
        saveAs(blob, 'futaba-export.json');
    };

    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file) {
            const fileReader = new FileReader();
            fileReader.onload = (e) => {
                const result = e.target?.result;
                if (!result) return;
                const data =
                    typeof result === 'string'
                        ? result
                        : new TextDecoder().decode(result);
                const importedPresets = JSON.parse(data) as IPreset[];
                importPresets(importedPresets);
            };
            fileReader.readAsText(file);
        }
    };

    return (
        <div className="PresetsEdit">
            <div className="form">
                <label htmlFor="category-input">Category</label>
                <br />
                <input
                    type="text"
                    id="category-input"
                    placeholder="Category name"
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                />
                <br />
                <label htmlFor="name-input">Name</label>
                <br />
                <input
                    type="text"
                    id="name-input"
                    placeholder="Preset name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                />
                <br />
            </div>
            <div className="buttons">
                <button onClick={() => saveData()}>Save current</button>
                <button onClick={() => setIsEditMode(false)}>Close</button>
            </div>
            <hr />
            <ul className="checkbox-list">
                {presets.map((preset) => {
                    return (
                        <li
                            className="preset"
                            key={`${preset.category}-${preset.name}`}
                        >
                            <label>
                                <input
                                    type="checkbox"
                                    checked={!uncheckedPresets.includes(preset)}
                                    onChange={() => {
                                        setUncheckedPresets(
                                            uncheckedPresets.includes(preset)
                                                ? uncheckedPresets.filter(
                                                      (p) => p !== preset
                                                  )
                                                : [...uncheckedPresets, preset]
                                        );
                                    }}
                                />
                                <strong>{preset.category}</strong> -{' '}
                                {preset.name}
                            </label>
                            <button onClick={() => saveData(preset)}>
                                Update with current
                            </button>
                            &nbsp;
                            <button onClick={() => remove(preset)}>
                                Delete
                            </button>
                        </li>
                    );
                })}
            </ul>
            <hr />
            <div className="buttons">
                <button onClick={() => exportData()}>Export selected</button>
                <button onClick={() => fileUploadRef.current?.click()}>
                    Import new
                </button>
                <input
                    type="file"
                    style={{ display: 'none' }}
                    onChange={handleFileChange}
                    ref={fileUploadRef}
                />
            </div>
        </div>
    );
};
