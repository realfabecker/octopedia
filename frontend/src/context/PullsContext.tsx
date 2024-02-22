import React, { useEffect, useState } from "react";
import { FilterBy } from "../lib";
import debounce from "lodash.debounce";

export const PullsContext = React.createContext(
  {} as {
    prData?: Record<string, any>;
    prError: string | null;
    prLoading: boolean;
    filterName: FilterBy;
    filterValue: any;
    onChangeFilterValue: (v: any) => void;
    onChangeFilterName: (v: any) => void;
  },
);

export const PullsProvider = (opts: { children: React.ReactElement }) => {
  const [filterName, setFilterName] = useState(FilterBy.REVIEWER);
  const [filterValue, setFilterValue] = useState<any>(null);
  const [data, setData] = useState<Record<string, any>>();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const onChangeFilterName = debounce((v: any) => {
    setFilterName(v);
    setFilterValue(null);
  }, 300);

  const onChangeFilterValue = debounce((v: any) => {
    setFilterValue(v);
  }, 300);

  useEffect(() => {
    (async () => {
      try {
        const url = new URL("https://octopadia.vercel.app/api/repos/list");
        url.searchParams.set("limit", "6");
        if (filterValue && filterValue.length) {
          url.searchParams.set(filterName, filterValue);
        }
        const response = await fetch(url);
        const data = await response.json();
        setData(data);
        setLoading(true);
      } catch (err) {
        setError("unexpected error fetching pulls");
        setLoading(false);
      }
    })();
  }, [filterValue, filterName]);

  return (
    <PullsContext.Provider
      value={{
        prData: data,
        prLoading: loading,
        prError: error,
        onChangeFilterName,
        onChangeFilterValue,
        filterValue,
        filterName,
      }}
    >
      {opts.children}
    </PullsContext.Provider>
  );
};
