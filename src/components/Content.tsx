import React from "react";
import { useLogsDataContext } from "../contexts/LogsDataContext";
import { FileUploader } from "./FileUploader";
import { LogReader } from "./LogReader/LogReader";


export const Content = () => {
    const { data } = useLogsDataContext();

    if (!data) {
        return <FileUploader />;

    }

    return <LogReader />
};