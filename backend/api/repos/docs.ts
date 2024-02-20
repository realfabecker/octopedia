import fs from "fs";
import path from "path";
import { VercelRequest, VercelResponse } from "@vercel/node";

const d = path.resolve(__dirname, "..", "..", "docs", "openapi.json");
const p = fs.readFileSync(d, { encoding: "utf8" });

//@ts-ignore
export default function handler(req: VercelRequest, res: VercelResponse) {
  res.status(200).send(p);
}
