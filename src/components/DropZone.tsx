import React from 'react';
import './DropZone.css';
import { useLogsDataContext } from '../contexts/LogsDataContext';

export const DropZone: React.FC<React.PropsWithChildren> = ({ children }) => {
    const { readData } = useLogsDataContext();
    const [isActive, setIsActive] = React.useState(false);

    const handleDrop = (event: React.DragEvent<HTMLDivElement>) => {
        event.preventDefault();
        event.stopPropagation();
        const file = event.dataTransfer.files[0];
        if (file) {
            const fileReader = new FileReader();
            fileReader.onload = (e) => {
                const result = e.target?.result;
                if (!result) return;
                if (typeof result === 'string') {
                    readData(file.name, result);
                } else {
                    readData(file.name, new TextDecoder().decode(result));
                }
            };
            fileReader.readAsText(file);
        }
        setIsActive(false);
    };

    const handleDragOver = (event: React.DragEvent<HTMLDivElement>) => {
        event.preventDefault();
        event.stopPropagation();
        setIsActive(true);
    };

    return (
        <div
            className={`drop-zone ${isActive ? 'active' : ''}`}
            onDragEnter={handleDragOver}
            onDragLeave={() => setIsActive(false)}
            onDragOver={handleDragOver}
        >
            {children}
            <div
                className="zone"
                onDrop={handleDrop}
                onDragOver={handleDragOver}
            >
                <img src="upload.gif" alt="Futaba Hacking" />
            </div>
        </div>
    );
};
