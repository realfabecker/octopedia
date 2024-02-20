import type { VercelRequest, VercelResponse } from "@vercel/node";
import { DB } from "../../lib/db";
import { subDays, toTzDate } from "../../lib/date";

export enum Period {
  TODAY = "today",
  WEEK = "week",
  MONTH = "month",
}

const getQuery = (opts: {
  filters?: {
    created_by?: string;
    reviewer?: string;
    created_at?: Period;
    updated_at?: Period;
  };
}): { q: string; p: any[] } => {
  let params = [];
  let query = "SELECT * FROM pull_request WHERE 1=1 ";

  if (opts?.filters?.created_by) {
    query += "AND created_by like ?";
    params.push(`%${opts.filters.created_by}%`);
  }
  if (opts?.filters?.reviewer) {
    query += "AND UPPER(reviewers) like ?";
    params.push(`%${opts.filters.reviewer.toUpperCase()}%`);
  }
  if (opts.filters?.created_at) {
    if (opts.filters.created_at === Period.TODAY) {
      query += "AND DATE(created_at) = ?";
      params.push(toTzDate(new Date()).toISOString().slice(0, 10));
    } else if (opts.filters.created_at === Period.WEEK) {
      query += "AND DATE(created_at) BETWEEN ? AND ?";
      params.push(subDays(new Date(), 7).toISOString().slice(0, 10));
      params.push(new Date().toISOString().slice(0, 10));
    } else if (opts.filters.created_at === Period.MONTH) {
      query += "AND DATE(created_at) BETWEEN ? AND ?";
      params.push(subDays(new Date(), 30).toISOString().slice(0, 10));
      params.push(new Date().toISOString().slice(0, 10));
    }
  }
  if (opts.filters?.updated_at) {
    if (opts.filters.updated_at === Period.TODAY) {
      query += "AND DATE(updated_at) = ?";
      params.push(toTzDate(new Date()).toISOString().slice(0, 10));
    } else if (opts.filters.updated_at === Period.WEEK) {
      query += "AND DATE(updated_at) BETWEEN ? AND ?";
      params.push(subDays(new Date(), 7).toISOString().slice(0, 10));
      params.push(new Date().toISOString().slice(0, 10));
    } else if (opts.filters.updated_at === Period.MONTH) {
      query += "AND DATE(updated_at) BETWEEN ? AND ?";
      params.push(subDays(new Date(), 30).toISOString().slice(0, 10));
      params.push(new Date().toISOString().slice(0, 10));
    }
  }
  return { q: query, p: params };
};

const getCount = (opts: {
  db: DB;
  filters?: {
    created_by?: string;
    reviewer?: string;
    created_at?: Period;
    updated_at?: Period;
  };
}): number => {
  const { q, p } = getQuery({ filters: opts.filters });
  const query = `SELECT count(*) as c1 from (${q})`;
  const count = opts.db.query(query, p as never[]) as Record<string, any>[];
  return count?.[0]?.c1 || 0;
};

const getItems = (opts: {
  db: DB;
  limit: number;
  offset: number;
  filters?: {
    created_at?: Period;
    updated_at?: Period;
    created_by?: string;
    reviewer?: string;
  };
}) => {
  let { q: query, p: params } = getQuery({
    filters: opts.filters,
  });
  params.push(opts.offset, opts.limit);
  query += " LIMIT ?,? ";
  return opts.db.query(query, params as never[]);
};

export default function handler(req: VercelRequest, res: VercelResponse) {
  try {
    const { created_by, reviewer, created_at, updated_at } =
      req.query as Record<string, any>;

    const page = Number(req.query?.page || 1);
    const limit = Number(req.query?.limit || 10);

    const db = new DB(
      <string>process.env.DB_URL,
      <string>process.env.DB_TOKEN,
      <string>process.env.DB_PATH,
    );

    const rows = getItems({
      db,
      offset: (page - 1) * limit,
      limit,
      filters: {
        created_by,
        reviewer,
        created_at,
        updated_at,
      },
    });

    const total = getCount({
      db,
      filters: { created_by, reviewer, created_at, updated_at },
    });

    return res.json({
      data: {
        items: rows,
        total: total,
        page_count: rows.length,
        has_more: page * limit < total,
      },
    });
  } catch (e) {
    return res.json({
      status: 500,
      message: (<Error>e).message,
    });
  }
}
