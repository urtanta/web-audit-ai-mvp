import { NextApiRequest, NextApiResponse } from "next";
import lighthouse from "lighthouse";
import puppeteer from "puppeteer";
import cheerio from "cheerio";
import { parse } from "url";
import type { RunnerResult } from "lighthouse";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") return res.status(405).end();

  const { url } = req.body;
  if (!url || !url.startsWith("http")) {
    return res.status(400).json({ error: "URL inválida" });
  }

  try {
    const browser = await puppeteer.launch({
      headless: true,
      args: ["--no-sandbox"],
    });

    const page = await browser.newPage();
    await page.goto(url, { waitUntil: "networkidle2" });

    const html = await page.content();
    const $ = cheerio.load(html);

    // HTML info
    const title = $("title").text();
    const h1 = $("h1").first().text();
    const metaDesc = $('meta[name="description"]').attr("content") || "";
    const robotsMeta = $('meta[name="robots"]').attr("content") || "no meta";

    // robots.txt
    const parsedUrl = parse(url);
    const robotsTxtUrl = `${parsedUrl.protocol}//${parsedUrl.host}/robots.txt`;
    const robotsTxtRes = await fetch(robotsTxtUrl);
    const robotsTxt = robotsTxtRes.ok ? await robotsTxtRes.text() : "No encontrado";

    // Lighthouse
    const lhResult: RunnerResult | undefined = await lighthouse(url, {
      port: Number(new URL(browser.wsEndpoint!).port),
      output: "json",
      logLevel: "error",
    });

    if (!lhResult || !lhResult.lhr) {
      throw new Error("Lighthouse no devolvió resultados");
    }

    const { lhr } = lhResult;

    await browser.close();

    // Construir respuesta
    res.status(200).json({
      result: {
        title,
        h1,
        metaDesc,
        robotsMeta,
        robotsTxt,
      },
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

