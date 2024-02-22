export enum FilterBy {
  REVIEWER = "reviewer",
  CREATED_BY = "created_by",
  CREATED_AT = "created_at",
  UPDATED_AT = "updated_at",
}

export const FilterN = {
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
  list(): Promise<{ data: PagedDto }>;
}

export type PagedDto<T = Record<string, any>> = {
  has_more: boolean;
  items: T[];
  page_count: number;
  total: number;
};
