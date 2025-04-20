const { launchLighthouse } = require("./utils/lighthouse");
const { parseHTML } = require("./utils/cheerio");
const { analyzeRobots } = require("./utils/robots");

module.exports = async (req, res) => {
  if (req.method !== "POST") return res.status(405).json({ error: "Método no permitido" });

  const { url } = req.body;
  if (!url || typeof url !== "string" || !url.startsWith("http")) {
    return res.status(400).json({ error: "URL inválida" });
  }

  try {
    const htmlInfo = await parseHTML(url);
    const robots = await analyzeRobots(url);
    const lighthouse = await launchLighthouse(url);

    res.status(200).json({
      result: { ...htmlInfo, ...robots },
      lighthouse,
    });
  } catch (error) {
    console.error("Error en auditoría:", error);
    res.status(500).json({ error: "Error al ejecutar la auditoría" });
  }
};
