import React from "react";
import { useLogsDataContext } from "../contexts/LogsDataContext";
import "./FileUploader.css";

export const FileUploader = () => {
  const { readData } = useLogsDataContext();

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const fileReader = new FileReader();
      fileReader.onload = (e) => {
        const result = e.target?.result;
        if (!result) return;
        if (typeof result === "string") {
          readData(file.name, result);
        } else {
          readData(file.name, new TextDecoder().decode(result));
        }
      };
      fileReader.readAsText(file);
    }
  };

  return (
    <div className="file-uploader">
      <div className="futaba"></div>
      <h1>Upload or drag-n-drop your logs</h1>
      <div>
        <input type="file" onChange={handleFileChange} />
      </div>
      <div></div>
    </div>
  );
};
