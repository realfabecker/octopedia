export enum FilterBy {
  CHOOOSE = "choose",
  REVIEWER = "reviewer",
  CREATED_BY = "created_by",
  CREATED_AT = "created_at",
  UPDATED_AT = "updated_at",
}

export const FilterN = {
  [FilterBy.CHOOOSE]: "Select a Filter",
  [FilterBy.REVIEWER]: "Reviewer",
  [FilterBy.CREATED_AT]: "Created At",
  [FilterBy.UPDATED_AT]: "Updated At",
  [FilterBy.CREATED_BY]: "Created By",
};

export enum PeriodBy {
  TODAY = "today",
  WEEK = "week",
  MONTH = "month",
}

export interface IRepoSender {
  list(params: PullParms): Promise<{ data: PagedDto }>;
}

export type PagedDto<T = Record<string, any>> = {
  has_more: boolean;
  items: T[];
  page_count: number;
  total: number;
};

export type PullParms = {
  filterBy: FilterBy;
  filterVal?: any;
  page: number;
  limit: number;
};

export type PullData = {
  data: Record<string, any>[];
  more: boolean;
  loading: boolean;
  error?: Error | null;
};

export type PullCtx = {
  data: PullData;
  params: PullParms;
  onChangeFilterValue: (v: any) => void;
  onChangeFilterName: (v: any) => void;
  handleClickNextPage: () => void;
};
