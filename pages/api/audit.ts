import { NextApiRequest, NextApiResponse } from "next";

// Importación CommonJS
import { analyzeRobots } from "../../backend/utils/robots";
import { parseHTML } from "../../backend/utils/cheerio";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") return res.status(405).end();

  const { url } = req.body;

  if (typeof url !== "string" || !url.startsWith("http")) {
    console.warn("🔴 URL inválida:", url);
    return res.status(400).json({ error: "URL inválida" });
  }

  console.log("📥 Iniciando auditoría para:", url);

  try {
    let htmlInfo, robotsTxt, lighthouse;

    // 1. Analizar HTML
    try {
      htmlInfo = await parseHTML(url);
      console.log("✅ HTML analizado con éxito");
    } catch (err) {
      console.error("❌ Error en parseHTML:", err);
      throw new Error("Error al analizar el HTML");
    }

    // 2. Analizar robots.txt
    try {
      robotsTxt = await analyzeRobots(url);
      console.log("✅ Robots.txt analizado");
    } catch (err) {
      console.error("❌ Error al obtener robots.txt:", err);
      robotsTxt = "No se pudo obtener el archivo robots.txt";
    }

    // 3. Lighthouse (ESM import dinámico)
    try {
      const { launchLighthouse } = await import("../../backend/utils/lighthouse.mjs");

      if (!launchLighthouse) {
        throw new Error("Función launchLighthouse no encontrada");
      }

      lighthouse = await launchLighthouse(url);
      console.log("✅ Lighthouse ejecutado");
    } catch (err) {
      console.error("❌ Error al ejecutar Lighthouse:", err);
      throw new Error("Error al lanzar Lighthouse");
    }

    // 4. Enviar respuesta
    res.status(200).json({
      result: {
        ...htmlInfo,
        robotsTxt,
      },
      lighthouse,
    });
  } catch (err: any) {
    console.error("🚨 Audit error general:", err.message);
    res.status(500).json({ error: err.message || "Error durante la auditoría" });
  }
}
