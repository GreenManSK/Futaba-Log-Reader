import React from "react";
import "./LogReader.css";
import { useLogsDataContext } from "../../contexts/LogsDataContext";
import { LogLevelFilter } from "./LogLevelFilter";
import { LogClassFilter } from "./LogClassFilter";
import { FilteredLogTable } from "./FilteredLogTable";
import { SessionSelector } from "./SessionSelector";
import { Stats } from "../Stats/Stats";
import { Favourite } from "../Favourite/Favourite";
import { useDataStorageContext } from "../../contexts/DataStorageContext";
import { GoToTopButton } from "./GoToTopButton";

const DEFAULT_LINES_LIMIT = 5000;

enum Tabs {
  FilteredLogs,
  Stats,
  Favorites,
}

export const LogReader = () => {
  const { currentSession, clearData } = useLogsDataContext();

  const [currentTab, setCurrentTab] = React.useState(Tabs.FilteredLogs);
  const [lineLimit, setLineLimit] = React.useState(DEFAULT_LINES_LIMIT);
  const [timeRange, setTimeRange] = React.useState({
    start: new Date(),
    end: new Date(),
  });

  const {
    levelFilter,
    setLevelFilter,
    excludedClasses,
    setExcludedClasses,
    searches,
    setSearches,
    favourites,
    setFavourites,
  } = useDataStorageContext();

  const data = currentSession?.data;

  React.useEffect(() => {
    if (!data) {
      return;
    }
    const dates = data
      .map((entry) => entry.date.getTime())
      .filter((date) => !isNaN(date));
    const start = new Date(Math.min(...dates));
    const end = new Date(Math.max(...dates));
    setTimeRange({ start, end });
  }, [data]);

  return (
    <div className="log-reader">
      <header id="header">
        <h1>Log Reader</h1>
      </header>
      <div className="panel">
        <LogLevelFilter
          levelFilter={levelFilter}
          setLevelFilter={setLevelFilter}
        />
        <LogClassFilter
          excludedClasses={excludedClasses}
          setExcludedClasses={setExcludedClasses}
        />
      </div>
      <div className="main-content">
        <SessionSelector />
        <div className="tabs-buttons">
          <button
            className={currentTab === Tabs.FilteredLogs ? "active" : ""}
            onClick={() => setCurrentTab(Tabs.FilteredLogs)}
          >
            Logs
          </button>
          <button
            className={currentTab === Tabs.Stats ? "active" : ""}
            onClick={() => setCurrentTab(Tabs.Stats)}
          >
            Stats
          </button>
          <button
            className={currentTab === Tabs.Favorites ? "active" : ""}
            onClick={() => setCurrentTab(Tabs.Favorites)}
          >
            Favorites
          </button>
          <button onClick={clearData}>Unload file</button>
        </div>
        {currentTab === Tabs.FilteredLogs && (
          <FilteredLogTable
            data={data}
            lineLimit={lineLimit}
            setLineLimit={setLineLimit}
            levelFilter={levelFilter}
            excludedClasses={excludedClasses}
            searches={searches}
            setSearches={setSearches}
            timeRange={timeRange}
            setTimeRange={setTimeRange}
            favourites={favourites}
            setFavourites={setFavourites}
          />
        )}
        {currentTab === Tabs.Stats && (
          <Stats
            data={data}
            excludedClasses={excludedClasses}
            setExcludedClasses={setExcludedClasses}
          />
        )}
        {currentTab === Tabs.Favorites && (
          <Favourite
            data={data}
            favourites={favourites}
            setFavourites={setFavourites}
          />
        )}
        <GoToTopButton />
      </div>
    </div>
  );
};
