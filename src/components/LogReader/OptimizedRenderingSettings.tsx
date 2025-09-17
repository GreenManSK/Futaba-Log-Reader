import React from 'react';
import { useSettingsContext } from '../../contexts/SettingsContext';

export const OptimizedRenderingSettings: React.FC = () => {
    const { isOptimizedRenderingEnabled, setIsOptimizedRenderingEnabled } =
        useSettingsContext();

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setIsOptimizedRenderingEnabled(e.target.checked);
    };

    return (
        <label>
            <input
                type="checkbox"
                checked={isOptimizedRenderingEnabled}
                onChange={handleChange}
            />
            <strong>Enable optimized row rendering</strong> (Faster but Ctrl+F
            will not work properly)
        </label>
    );
};
