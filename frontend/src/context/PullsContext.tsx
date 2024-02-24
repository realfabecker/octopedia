import React from "react";
import { PullCtx } from "../lib";
import { usePulls } from "../hooks/usePulls.ts";

export const PullsContext = React.createContext<PullCtx>({} as PullCtx);
export const PullsProvider = (opts: { children: React.ReactElement }) => {
  const pulls = usePulls();
  return (
    <PullsContext.Provider value={pulls}>{opts.children}</PullsContext.Provider>
  );
};
