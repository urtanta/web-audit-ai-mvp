const puppeteer = require("puppeteer");
const cheerio = require("cheerio");

async function parseHTML(url) {
  const browser = await puppeteer.launch({
    headless: true,
    args: ["--no-sandbox"],
  });

  const page = await browser.newPage();
  await page.goto(url, { waitUntil: "networkidle2" });
  const html = await page.content();
  await browser.close();

  const $ = cheerio.load(html);

  return {
    title: $("title").text(),
    h1: $("h1").first().text(),
    metaDesc: $('meta[name="description"]').attr("content") || "",
    robotsMeta: $('meta[name="robots"]').attr("content") || "no meta",
  };
}

module.exports = { parseHTML };
