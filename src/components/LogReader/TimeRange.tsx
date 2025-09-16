import React from "react";
import "./TimeRange.css";

export type ITimeRange = { start: Date, end: Date };

interface ITimeRangeProps {
    timeRange: ITimeRange,
    setTimeRange: (timeRange: ITimeRange) => void
}

interface ITimePickerProps {
    time: Date,
    setTime: (time: Date) => void

}

export const TimeRange = React.memo((props: ITimeRangeProps) => {
    const { timeRange, setTimeRange } = props;

    const [start, setStart] = React.useState(timeRange.start);
    const [end, setEnd] = React.useState(timeRange.end);

    React.useEffect(() => {
        setStart(timeRange.start);
        setEnd(timeRange.end);
    }, [timeRange]);

    React.useEffect(() => {
        setTimeRange({ start, end });
    }, [start, end, setTimeRange]);

    return <div className="time-range">
        Showing logs from<br />
        <TimePicker time={start} setTime={setStart} /><br />
        &nbsp;to&nbsp;<br />
        <TimePicker time={end} setTime={setEnd} />
    </div>
});
TimeRange.displayName = "TimeRange";

const TimePicker = (props: ITimePickerProps) => {
    const { time, setTime } = props;

    const [date, setDate] = React.useState("");
    const [timeString, setTimeString] = React.useState("");

    React.useEffect(() => {
        setDate(time.toISOString().split("T")[0]);
        setTimeString(time.toISOString().split("T")[1].split(".")[0]);
    }, [time]);

    React.useEffect(() => {
        setTime(new Date(`${date}T${timeString}Z`));
    }, [date, timeString, setTime]);

    return <>
        <input type="date" value={date} onChange={e => setDate(e.target.value)} />
        <input type="time" value={timeString} onChange={e => setTimeString(e.target.value)} />
    </>
}