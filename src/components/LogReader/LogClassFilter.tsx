import React from "react";
import { useLogsDataContext } from "../../contexts/LogsDataContext";

interface ILogClassFilterProps {
    excludedClasses: Set<string>;
    setExcludedClasses: (filteredClasses: Set<string>) => void;
}

export const LogClassFilter = (props: ILogClassFilterProps) => {
    const { excludedClasses, setExcludedClasses } = props;
    const { data } = useLogsDataContext();
    const [classFilter, setClassFilter] = React.useState("");

    const classes = React.useMemo(() => {
        return Array.from(new Set(data?.map(entry => entry.loggingClass).sort())) || [];
    }, [data]);
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

    return <>
        <h2>Logging class</h2>
        <button onClick={deselectAll}>Clear all</button>
        <button onClick={selectAll}>Select all</button>
        <input type="text" value={classFilter} onChange={e => setClassFilter(e.target.value)} placeholder="Select class" />
        {filteredClasses.map(cls => (<div key={cls}>
            <input type="checkbox" checked={!excludedClasses.has(cls)} onChange={() => onChange(cls)} />
            {cls}
        </div>))}
    </>;
};