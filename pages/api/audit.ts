import { NextApiRequest, NextApiResponse } from "next";

// Importación CommonJS
import { analyzeRobots } from "../../backend/utils/robots";
import { parseHTML } from "../../backend/utils/cheerio";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") return res.status(405).end();

  const { url } = req.body;

  if (typeof url !== "string" || !url.startsWith("http")) {
    return res.status(400).json({ error: "URL inválida" });
  }

  try {
    // Analizar HTML con puppeteer + cheerio
    const htmlInfo = await parseHTML(url);

    // Obtener robots.txt
    const robotsTxt = await analyzeRobots(url);

    // Importación dinámica para módulo ESM (lighthouse.mjs)
    const { launchLighthouse } = await import("../../backend/utils/lighthouse.mjs");
    const lighthouse = await launchLighthouse(url);

    res.status(200).json({
      result: {
        ...htmlInfo,
        robotsTxt,
      },
      lighthouse,
    });
  } catch (err) {
    console.error("Audit error:", err);
    res.status(500).json({ error: "Error durante la auditoría" });
  }
}
