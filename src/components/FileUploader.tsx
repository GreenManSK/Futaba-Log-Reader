import React from "react";

export const FileUploader = () => {

    const readData = (content: string) => console.log(content);

    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file) {
            const fileReader = new FileReader();
            fileReader.onload = (e) => {
                const result = e.target?.result;
                if (!result) return;
                if (typeof result === 'string') {
                    readData(result);
                } else {
                    readData((new TextDecoder()).decode(result));
                }
            };
            fileReader.readAsText(file);
        }
    }

    return (
        <div>
            <input type="file" onChange={handleFileChange} />
        </div>
    );
};