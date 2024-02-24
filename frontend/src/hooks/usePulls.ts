import { useEffect, useState } from "react";
import { FilterBy, PullData, PullParms, RepoHttpSender } from "../lib";
import { useDebouncedCallback } from "./useDebouncedCallback.ts";

export const usePulls = (debounce: number = 300) => {
  const [params, setParams] = useState<PullParms>({
    filterBy: FilterBy.CHOOOSE,
    page: 1,
    limit: 6,
  });

  const [data, setData] = useState<PullData>({
    data: [],
    error: null,
    loading: false,
    more: false,
  });

  const handleClickNextPage = () => {
    setParams((prevState) => ({ ...prevState, page: prevState.page + 1 }));
  };

  const onChangeFilterValue = useDebouncedCallback((v: any) => {
    setParams((prevState) => ({
      ...prevState,
      filterVal: v,
      page: 1,
    }));
  }, debounce);

  const onChangeFilterName = useDebouncedCallback((v: any) => {
    setParams((prevState) => ({
      ...prevState,
      filterBy: v,
      filterVal: undefined,
      page: 1,
    }));
  }, debounce);

  useEffect(() => {
    (async () => {
      try {
        setData((prevState) => ({ ...prevState!, loading: true }));

        const sender = new RepoHttpSender();
        const json = await sender.list(params);
        if (!Array.isArray(json?.data?.items)) {
          throw new Error("unexpected return from pull request api");
        }

        await new Promise((resolve) => setTimeout(() => resolve(true), 1000));

        setData((prevState) => ({
          ...prevState!,
          data:
            params.page === 1
              ? json.data.items
              : [...(prevState?.data || []), ...(json?.data?.items || [])],
          more: json.data?.has_more || false,
          loading: false,
          error: null,
        }));
      } catch (err) {
        setData((prevState) => ({
          ...prevState!,
          loading: false,
          error: (err as Error) || new Error("Unknown error"),
        }));
      }
    })();
  }, [params]);

  return {
    data: data,
    params: params,
    onChangeFilterName,
    onChangeFilterValue,
    handleClickNextPage,
  };
};
