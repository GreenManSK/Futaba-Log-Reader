import React from "react";
import { IPreset } from "../data/Preset";
import { LogLevel } from "../data/ILogEntry";

interface IPresetsContext {
    presets: IPreset[];
    add: (preset: IPreset) => void;
    update: (oldPreset: IPreset, newPreset: IPreset) => void;
    remove: (preset: IPreset) => void;
    import: (presets: IPreset[]) => void;
}

export const PresetsContext = React.createContext<IPresetsContext>({
    presets: [],
    add: () => { },
    update: () => { },
    remove: () => { },
    import: () => { }
});

export const usePresetsContext = () => React.useContext(PresetsContext);

const isMatchPreset = (preset: IPreset, name: string, category: string) => {
    return preset.name === name && preset.category === category;
}

const STORAGE_KEY = "PRESETS";
const DEFAULT_PRESETS: IPreset[] = [
    {
        category: "Modern Stage",
        name: "Speaker/Voice level issues",
        data: {
            levelFilter: [LogLevel.DEBUG, LogLevel.INFO, LogLevel.WARNING, LogLevel.ERROR],
            searchData: [{
                text: "(voice level|onActiveSpeakersChanged)",
                enabled: true,
                isCaseSensitive: false,
                isRegex: true
            }, {
                text: "roster",
                enabled: false,
                isCaseSensitive: false,
                isRegex: false
            }, {
                text: "callsmonitor",
                enabled: false,
                isCaseSensitive: false,
                isRegex: false
            }, {
                text: "calls]",
                enabled: false,
                isCaseSensitive: false,
                isRegex: false
            }],
            includedClasses: [
                "CallParticipantsVoiceLevelsContextProvider[calls]",
                "CallParticipantsVoiceLevelsContextProvider[callsmonitor]",
                "CallParticipantsVoiceLevelsContextProvider[roster]",
                "ModernGridLayout[calls]",
                "ModernGridLayout[callsmonitor]"
            ]
        }
    },
    {
        category: "Proximity",
        name: "Is somebody hidden by same room?",
        data: {
            levelFilter: [LogLevel.INFO],
            searchData: [{
                text: "isInSameRoom updated: true",
                enabled: true,
                isCaseSensitive: false,
                isRegex: false
            }, {
                text: "isInSameRoom",
                enabled: false,
                isCaseSensitive: false,
                isRegex: false
            }],
            includedClasses: []
        }
    }
];

export const PresetsProvider: React.FC<React.PropsWithChildren> = ({ children }) => {
    const [presets, setPresets] = React.useState<IPreset[]>(DEFAULT_PRESETS);

    const updatePresets = React.useCallback((newPresets: IPreset[]) => {
        setPresets(newPresets);
        localStorage.setItem(STORAGE_KEY, JSON.stringify(newPresets));
    }, [setPresets]);

    React.useEffect(() => {
        const storedPresets = localStorage.getItem(STORAGE_KEY);
        if (!storedPresets) {
            return;
        }
        setPresets(JSON.parse(storedPresets));
    }, []);

    const add = React.useCallback((preset: IPreset) => {
        updatePresets([...presets, preset]);
    }, [presets, updatePresets]);

    const update = React.useCallback((oldPreset: IPreset, newPreset: IPreset) => {
        const index = presets.findIndex(p => isMatchPreset(p, oldPreset.name, oldPreset.category));
        if (index === -1) {
            add(newPreset);
            return;
        }
        const newPresets = [...presets];
        newPresets[index] = newPreset;
        updatePresets(newPresets);
    }, [presets, updatePresets, add]);

    const importPresets = React.useCallback((newPresets: IPreset[]) => {
        const mergedPresets = newPresets.reduce((acc, preset) => {
            const index = acc.findIndex(p => isMatchPreset(p, preset.name, preset.category));
            if (index === -1) {
                return [...acc, preset];
            }
            acc[index] = preset;
            return acc;
        }, presets);
        updatePresets(mergedPresets);
    }, [presets, updatePresets]);

    const deletePreset = React.useCallback((preset: IPreset) => {
        const newPresets = presets.filter(p => !isMatchPreset(p, preset.name, preset.category));
        updatePresets(newPresets);
    }, [presets, updatePresets]);

    return (
        <PresetsContext.Provider value={{ presets, add, update, remove: deletePreset, import: importPresets }}>
            {children}
        </PresetsContext.Provider>
    );
};