import { NextApiRequest, NextApiResponse } from "next";
import { analyzeRobots } from "../../backend/utils/robots";
import { parseHTML } from "../../backend/utils/cheerio";
import { logToFile } from "../../backend/utils/logger";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") return res.status(405).end();

  const { url } = req.body;

  if (typeof url !== "string" || !url.startsWith("http")) {
    logToFile(`🔴 URL inválida recibida: ${url}`);
    return res.status(400).json({ error: "URL inválida" });
  }

  logToFile(`📥 Inicio de auditoría para: ${url}`);

  try {
    let htmlInfo, robotsTxt, lighthouse;

    try {
      htmlInfo = await parseHTML(url);
      logToFile("✅ HTML analizado con éxito");
    } catch (err) {
      logToFile(`❌ Error en parseHTML: ${err}`);
      throw new Error("Error al analizar el HTML");
    }

    try {
      robotsTxt = await analyzeRobots(url);
      logToFile("✅ robots.txt obtenido");
    } catch (err) {
      logToFile(`⚠️ robots.txt falló: ${err}`);
      robotsTxt = "No se pudo obtener el archivo robots.txt";
    }

    try {
      const { launchLighthouse } = await import("../../backend/utils/lighthouse.mjs");
      if (!launchLighthouse) throw new Error("launchLighthouse no definido");

      lighthouse = await launchLighthouse(url);
      logToFile("✅ Lighthouse ejecutado con éxito");
    } catch (err) {
      logToFile(`❌ Error al ejecutar Lighthouse: ${err}`);
      throw new Error("Error al ejecutar Lighthouse");
    }

    logToFile("📤 Auditoría finalizada correctamente");

    res.status(200).json({
      result: {
        ...htmlInfo,
        robotsTxt,
      },
      lighthouse,
    });
  } catch (err: any) {
    logToFile(`🚨 Error general: ${err.message}`);
    res.status(500).json({ error: err.message || "Error durante la auditoría" });
  }
}
