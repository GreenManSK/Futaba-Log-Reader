import React from "react";
import './LogClassFilter.css';
import { useLogsDataContext } from "../../contexts/LogsDataContext";

interface ILogClassFilterProps {
    excludedClasses: Set<string>;
    setExcludedClasses: (filteredClasses: Set<string>) => void;
}

export const LogClassFilter = (props: ILogClassFilterProps) => {
    const { excludedClasses, setExcludedClasses } = props;
    const { currentSession } = useLogsDataContext();
    const [classFilter, setClassFilter] = React.useState("");

    const classes = React.useMemo(() => {
        return Array.from(new Set(currentSession?.data.map(entry => entry.loggingClass).sort((a, b) => a.localeCompare(b)))) || [];
    }, [currentSession]);
    const filteredClasses = React.useMemo(() => {
        const lowerCaseFilter = classFilter.toLowerCase();
        return classes.filter(cls => cls.toLowerCase().includes(lowerCaseFilter));
    }, [classes, classFilter]);

    const onChange = (cls: string) => {
        const newSet = new Set(excludedClasses);
        if (newSet.has(cls)) {
            newSet.delete(cls);
        } else {
            newSet.add(cls);
        }
        setExcludedClasses(newSet);
    }

    const selectAll = () => {
        const newSet = new Set(excludedClasses);
        classes.forEach(cls => newSet.delete(cls));
        setExcludedClasses(newSet);
    }
    const deselectAll = () => {
        const newSet = new Set(excludedClasses);
        classes.forEach(cls => newSet.add(cls));
        setExcludedClasses(newSet);
    }

    return <div className="box classes-panel">
        <h2>Logging Class</h2>
        <div className="buttons">
            <button onClick={deselectAll}>Clear all</button>
            <button onClick={selectAll}>Select all</button>
        </div>
        <input className="class-search" type="text" value={classFilter} onChange={e => setClassFilter(e.target.value)} placeholder="Select class" />
        <div className="classes-list">
            <ul className="checkbox-list">
                {filteredClasses.map(cls => (<li key={cls}>
                    <label>
                        <input type="checkbox" checked={!excludedClasses.has(cls)} onChange={() => onChange(cls)} />
                        <span className="class-name">{cls}</span>
                    </label>
                </li>))}
            </ul>
        </div>
    </div>;
};