import React, {
    createContext,
    useContext,
    useState,
    useEffect,
    ReactNode,
} from 'react';

type SettingsContextType = {
    isOptimizedRenderingEnabled: boolean;
    setIsOptimizedRenderingEnabled: (value: boolean) => void;
};

const LOCAL_STORAGE_KEY = 'isOptimizedRenderingEnabled';

const SettingsContext = createContext<SettingsContextType | undefined>(
    undefined
);

export const SettingsProvider = ({ children }: { children: ReactNode }) => {
    const [isOptimizedRenderingEnabled, setIsOptimizedRenderingEnabledState] =
        useState<boolean>(() => {
            const stored = localStorage.getItem(LOCAL_STORAGE_KEY);
            return stored === null ? true : stored === 'true';
        });

    useEffect(() => {
        localStorage.setItem(
            LOCAL_STORAGE_KEY,
            String(isOptimizedRenderingEnabled)
        );
    }, [isOptimizedRenderingEnabled]);

    const value = {
        isOptimizedRenderingEnabled,
        setIsOptimizedRenderingEnabled: setIsOptimizedRenderingEnabledState,
    };

    return (
        <SettingsContext.Provider value={value}>
            {children}
        </SettingsContext.Provider>
    );
};

export const useSettingsContext = () => {
    const context = useContext(SettingsContext);
    if (!context) {
        throw new Error(
            'useSettingsContext must be used within a SettingsProvider'
        );
    }
    return context;
};
