import Database from "libsql";
import fs from "fs";

export class DB {
  private db: Database.Database | null = null;
  private ready: boolean = false;

  constructor(
    private readonly url: string,
    private readonly token: string,
    private readonly p: string,
  ) {}

  _init() {
    this.db = new Database(this.p, {
      syncUrl: this.url,
      // @ts-ignore
      authToken: this.token,
      timeout: 5,
    });
    // if (fs.existsSync(this.p)) {
    //   const stats = fs.statSync(this.p);
    //   if ((stats.mtimeMs - Date.now()) / 1000 < 30) return true;
    // }
    this.db.sync();
    this.ready = true;
  }

  query(qry: string, params = []) {
    try {
      if (!this.ready) this._init();
      return this.db!.prepare(qry).all(params);
    } catch (e) {
      throw new Error("db-query:" + (<Error>e).message);
    }
  }
}
