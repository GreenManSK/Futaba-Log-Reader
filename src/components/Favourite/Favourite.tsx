import React from "react";
import { ILogEntry } from "../../data/ILogEntry";
import { LogTable } from "../LogReader/LogTable";

interface IFavouriteProps {
    data?: ILogEntry[];
    favourites: Set<number>;
    setFavourites: (favourites: Set<number>) => void;
}

export const Favourite = (props: IFavouriteProps) => {
    const { data, favourites, setFavourites } = props;

    const filteredData = data?.filter(entry => favourites.has(entry.id)) || [];

    return <LogTable data={filteredData} favourites={favourites} setFavourites={setFavourites} />
}