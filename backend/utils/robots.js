const { parse } = require("url");
const fetch = require("node-fetch");

async function analyzeRobots(url) {
  const parsed = parse(url);
  const robotsTxtUrl = `${parsed.protocol}//${parsed.host}/robots.txt`;

  try {
    const res = await fetch(robotsTxtUrl);
    const text = res.ok ? await res.text() : "No encontrado";
    return { robotsTxt: text };
  } catch (error) {
    return { robotsTxt: "Error al obtener robots.txt" };
  }
}

module.exports = { analyzeRobots };
