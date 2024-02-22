import {IRepoSender, PagedDto} from "./types.ts";

export class RepoHttpSender implements IRepoSender {
    async list(): Promise<{ data: PagedDto }> {
        const response = await fetch("https://octopadia.vercel.app/api/repos/list")
        return await response.json()
    }
}