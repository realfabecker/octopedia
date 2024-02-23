import React, { useEffect, useState } from "react";
import { FilterBy } from "../lib";
import debounce from "lodash.debounce";

export const PullsContext = React.createContext(
  {} as {
    prData?: { data: Record<string, any>[]; more: boolean };
    prError: string | null;
    prLoading: boolean;
    filterName: FilterBy;
    filterValue: any;
    onChangeFilterValue: (v: any) => void;
    onChangeFilterName: (v: any) => void;
    handleClickNextPage: () => void;
  },
);

export const PullsProvider = (opts: { children: React.ReactElement }) => {
  const [filterName, setFilterName] = useState(FilterBy.REVIEWER);
  const [filterValue, setFilterValue] = useState<any>(null);
  const [data, setData] = useState<{
    data: Record<string, any>[];
    more: boolean;
  }>();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(1);

  const handleClickNextPage = () => {
    setPage((prevState) => prevState + 1);
  };

  const onChangeFilterName = debounce((v: any) => {
    setFilterName(v);
    setPage(1);
    setFilterValue(null);
  }, 300);

  const onChangeFilterValue = debounce((v: any) => {
    setPage(1);
    setFilterValue(v);
  }, 300);

  useEffect(() => {
    (async () => {
      try {
        const url = new URL("https://octopadia.vercel.app/api/repos/list");
        url.searchParams.set("limit", "6");
        url.searchParams.set("page", page + "");
        if (filterValue && filterValue.length) {
          url.searchParams.set(filterName, filterValue);
        }
        const response = await fetch(url);
        const data = await response.json();
        setLoading(true);
        //@ts-ignore
        setData((prevState) => ({
          data:
            page === 1
              ? data.data.items
              : [...(prevState?.data || []), ...(data?.data?.items || [])],
          more: data.data?.has_more || false,
        }));
        setLoading(false);
      } catch (err) {
        setError("unexpected error fetching pulls");
        setLoading(false);
      }
    })();
  }, [filterValue, filterName, page]);

  return (
    <PullsContext.Provider
      value={{
        prData: data,
        prLoading: loading,
        prError: error,
        onChangeFilterName,
        onChangeFilterValue,
        handleClickNextPage,
        filterValue,
        filterName,
      }}
    >
      {opts.children}
    </PullsContext.Provider>
  );
};
