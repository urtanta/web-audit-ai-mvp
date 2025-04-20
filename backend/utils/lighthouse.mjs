import lighthouse from "lighthouse";
import puppeteer from "puppeteer";

export async function launchLighthouse(url) {
  const browser = await puppeteer.launch({
    headless: true,
    args: ["--no-sandbox"],
  });

  const result = await lighthouse(url, {
    port: new URL(browser.wsEndpoint()).port,
    output: "json",
    logLevel: "error",
  });

  await browser.close();

  if (!result || !result.lhr) {
    throw new Error("Lighthouse no devolvió resultados");
  }

  const { lhr } = result;
  return {
    performance: lhr.categories.performance.score,
    seo: lhr.categories.seo.score,
    accessibility: lhr.categories.accessibility.score,
  };
}
