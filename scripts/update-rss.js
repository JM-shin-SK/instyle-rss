import fs from "fs";
import RSS from "rss";
import fetch from "node-fetch";
import { JSDOM } from "jsdom";

const URL = "https://www.instyle.com/skin-5341478";

(async () => {
  const res = await fetch(URL);
  const html = await res.text();
  const dom = new JSDOM(html);
  const document = dom.window.document;

  const items = [...document.querySelectorAll("a.mntl-card-list-items")]
    .slice(0, 10)
    .map(el => ({
      title: el.querySelector("h3")?.textContent?.trim() || "No title",
      link: el.href,
      date: new Date().toUTCString()
    }));

  const feed = new RSS({
    title: "InStyle – Skin",
    site_url: URL,
    feed_url: "https://JM-shin-SK.github.io/instyle-rss/instyle-skin.xml",
    language: "en"
  });

  items.forEach(item => {
    feed.item({
      title: item.title,
      url: item.link,
      pubDate: item.date
    });
  });

  fs.writeFileSync("instyle-skin.xml", feed.xml({ indent: true }));
})();
