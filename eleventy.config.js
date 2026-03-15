const path = require("path");
const fs = require("fs");
const { DateTime } = require("luxon");
const MarkdownIt = require("markdown-it");

const md = new MarkdownIt();

module.exports = function (eleventyConfig) {
  eleventyConfig.addFilter("date", function (dateObj, format) {
    return DateTime.fromJSDate(dateObj).toFormat(format || "yyyy-MM-dd");
  });
  eleventyConfig.addFilter("today", function () {
    return DateTime.now().toFormat("yyyy-MM-dd");
  });
  eleventyConfig.addFilter("readingTime", function (html) {
    const text = (html || "").replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim();
    const words = text.split(" ").filter(Boolean).length;
    const min = Math.max(1, Math.ceil(words / 200));
    return min + " min read";
  });

  eleventyConfig.addFilter("prevPost", function (posts, currentUrl) {
    const i = posts.findIndex((p) => p.url === currentUrl);
    return i > 0 ? posts[i - 1] : null;
  });
  eleventyConfig.addFilter("nextPost", function (posts, currentUrl) {
    const i = posts.findIndex((p) => p.url === currentUrl);
    return i >= 0 && i < posts.length - 1 ? posts[i + 1] : null;
  });

  eleventyConfig.addFilter("groupByYear", function (posts) {
    const byYear = {};
    for (const p of posts || []) {
      const y = DateTime.fromJSDate(p.date).toFormat("yyyy");
      if (!byYear[y]) byYear[y] = [];
      byYear[y].push(p);
    }
    return Object.entries(byYear).sort((a, b) => b[0].localeCompare(a[0]));
  });

  eleventyConfig.addFilter("contains", function (arr, val) {
    return Array.isArray(arr) && arr.includes(val);
  });

  eleventyConfig.addFilter("slugify", function (str) {
    if (!str) return "";
    return String(str)
      .toLowerCase()
      .replace(/\s+/g, "-")
      .replace(/[^a-z0-9-]/g, "");
  });

  eleventyConfig.addFilter("markdownFile", function (filePath) {
    if (!filePath) return "";
    const fullPath = path.join(__dirname, filePath);
    if (!fs.existsSync(fullPath)) return "";
    const content = fs.readFileSync(fullPath, "utf8");
    return md.render(content);
  });

  eleventyConfig.addCollection("posts", function (collectionApi) {
    return collectionApi.getFilteredByTag("post").reverse();
  });

  eleventyConfig.addCollection("recentPosts", function (collectionApi) {
    return collectionApi.getFilteredByTag("post").reverse().slice(0, 5);
  });

  eleventyConfig.addCollection("tagList", function (collectionApi) {
    const posts = collectionApi.getFilteredByTag("post");
    const tagSet = new Set();
    for (const post of posts) {
      const tags = post.data.tags || [];
      for (const tag of tags) {
        if (tag !== "post") tagSet.add(tag);
      }
    }
    return [...tagSet].sort();
  });

  return {
    dir: {
      input: "src",
      output: "_site",
    },
    markdownTemplateEngine: "njk",
    url: process.env.URL || "https://example.com",
  };
};
