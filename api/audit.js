import { NextApiRequest, NextApiResponse } from "next";
import { parseHTML } from "@/lib/cheerio";
import { analyzeRobots } from "@/lib/robots";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") return res.status(405).end();

  const { url } = req.body;

  try {
    const { launchLighthouse } = await import("../../lib/lighthouse.mjs");
    const htmlInfo = await parseHTML(url);
    const robots = await analyzeRobots(url);
    const lighthouse = await launchLighthouse(url);

    res.status(200).json({ result: { ...htmlInfo, ...robots }, lighthouse });
  } catch (error) {
    console.error("Audit error:", error);
    res.status(500).json({ error: "Error en auditoría" });
  }
}
