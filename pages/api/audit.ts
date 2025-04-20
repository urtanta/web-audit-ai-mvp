import { NextApiRequest, NextApiResponse } from "next";
import lighthouse from "lighthouse";
import puppeteer from "puppeteer";
import cheerio from "cheerio";
import { parse } from "url";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") return res.status(405).end();

  const { url } = req.body;
  if (!url || !url.startsWith("http")) return res.status(400).json({ error: "URL inválida" });

  try {
    const browser = await puppeteer.launch({ headless: true, args: ['--no-sandbox'] });
    const page = await browser.newPage();
    await page.goto(url, { waitUntil: "networkidle2" });

    const html = await page.content();
    const $ = cheerio.load(html);

    // Extrae algunos elementos clave
    const title = $("title").text();
    const h1 = $("h1").first().text();
    const metaDesc = $('meta[name="description"]').attr("content") || "";
    const robotsMeta = $('meta[name="robots"]').attr("content") || "no meta";

    const parsedUrl = parse(url);
    const robotsTxtUrl = `${parsedUrl.protocol}//${parsedUrl.host}/robots.txt`;

    const robotsTxtRes = await fetch(robotsTxtUrl);
    const robotsTxt = robotsTxtRes.ok ? await robotsTxtRes.text() : "No encontrado";

    const result = {
      title,
      h1,
      metaDesc,
      robotsMeta,
      robotsTxt,
    };

    const { lhr } = await lighthouse(url, {
      port: new URL(browser.wsEndpoint!).port,
      output: "json",
      logLevel: "error",
    });

    await browser.close();

    res.status(200).json({
      result,
      lighthouse: {
        performance: lhr.categories.performance.score,
        seo: lhr.categories.seo.score,
        accessibility: lhr.categories.accessibility.score,
      },
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Error durante la auditoría" });
  }
}
