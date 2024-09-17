import React from "react";
import { PresetsSelector } from "./PresetsSelector";
import { PresetsEdit } from "./PresetsEdit";

export const PresetsMenu = () => {
    const [isEditMode, setIsEditMode] = React.useState(false);
    return <div className="box">
        <h2>Filter Presets</h2>
        {isEditMode ? <PresetsEdit setIsEditMode={setIsEditMode} /> : <PresetsSelector setIsEditMode={setIsEditMode} />}
    </div>;
};