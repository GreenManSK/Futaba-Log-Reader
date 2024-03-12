import React from "react";
import { useLogsDataContext } from "../contexts/LogsDataContext";
import { FileUploader } from "./FileUploader";
import { LogReader } from "./LogReader/LogReader";


export const Content = () => {
    const { sessions } = useLogsDataContext();

    if (!sessions.length) {
        return <FileUploader />;

    }

    return <LogReader />
};