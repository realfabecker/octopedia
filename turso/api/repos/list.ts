import type { VercelRequest, VercelResponse } from "@vercel/node";
import { DB } from "../../lib/db";

const getQuery = (opts: {
  filters?: { created_by?: string, reviewer?:string };
}): { q: string; p: any[] } => {
  let params = [];
  let query = "SELECT * FROM pull_request WHERE 1=1 ";

  if (opts?.filters?.created_by) {
    query += "AND created_by = ?";
    params.push(opts.filters.created_by);
  }
  if (opts?.filters?.reviewer) {
    query += "AND UPPER(reviewer) like ?";
    params.push(`%${opts.filters.reviewer.toUpperCase()}%`);
  }
  return { q: query, p: params };
};

const getCount = (opts: {
  db: DB;
  filters?: { created_by?: string, reviewer?:string };
}): number => {
  const { q, p } = getQuery({ filters: opts.filters });
  const query = `SELECT count(*) as c1
                   from (${q})`;
  const count = opts.db.query(query, p as never[]);
  //@ts-ignore
  return count?.[0]?.c1 || 0;
};

const getItems = (opts: {
  db: DB;
  limit: number;
  offset: number;
  created_by?: string;
  reviewer?: string;
}) => {
  let { q: query, p: params } = getQuery({
    filters: { created_by: opts.created_by, reviewer},
  });
  params.push(opts.limit, opts.offset);
  query += " LIMIT ? OFFSET ? ";
  return opts.db.query(query, params as never[]);
};

export default function handler(req: VercelRequest, res: VercelResponse) {
  try {
    const {
      page = 1,
      limit = 10,
      created_by,
      reviewer
    } = req.query as Record<string, any>;

    const db = new DB(
      <string>process.env.DB_URL,
      <string>process.env.DB_TOKEN,
      <string>process.env.DB_PATH,
    );

    const rows = getItems({
      db,
      offset: page - 1,
      limit,
      created_by,
      reviewer
    });

    const total = getCount({ db, filters: { created_by, reviewer } });
    return res.json({
      data: {
        items: rows,
        total: total,
        has_more: (page > 1 ? page - 1 : 1) * Number(limit) < total,
      },
    });
  } catch (e) {
    return res.json({
      status: 500,
      message: (<Error>e).message,
    });
  }
}
