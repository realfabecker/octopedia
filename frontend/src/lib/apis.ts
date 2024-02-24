import { IRepoSender, PagedDto, PullParms } from "./types.ts";

export class RepoHttpSender implements IRepoSender {
  async list(params: PullParms): Promise<{ data: PagedDto }> {
    const url = new URL("https://octopadia.vercel.app/api/repos/list");
    url.searchParams.set("limit", params.limit + "");
    url.searchParams.set("page", params.page + "");
    if (params.filterBy && params.filterVal) {
      url.searchParams.set(params.filterBy, params.filterVal);
    }
    const response = await fetch(url);
    return await response.json();
  }
}
