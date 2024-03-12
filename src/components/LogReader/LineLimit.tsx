import React from "react";
import { useLogsDataContext } from "../../contexts/LogsDataContext";

interface ILineLimitProps {
    lineLimit: number;
    setLineLimit: (lineLimit: number) => void;
}

const DEFAULT_LINES_LIMIT_INCREASE = 5000;
export const LineLimit = (props: ILineLimitProps) => {
    const { lineLimit, setLineLimit } = props;
    const { currentSession } = useLogsDataContext();

    const loadMoreLines = () => setLineLimit(lineLimit + DEFAULT_LINES_LIMIT_INCREASE);
    const setCustomLimit = () => {
        const customLimit = prompt("Enter custom limit", `${currentSession?.data.length || lineLimit}`);
        setLineLimit(Number(customLimit) || lineLimit);

    };

    return <div>
        {`Showing at most the first ${lineLimit} lines of ${currentSession?.data.length}.`}
        <button onClick={loadMoreLines}>Load more</button>
        <button onClick={setCustomLimit}>Set custom limit</button>
    </div>
};