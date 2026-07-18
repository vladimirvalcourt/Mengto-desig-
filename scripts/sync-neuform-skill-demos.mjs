#!/usr/bin/env node

import { createHash } from "node:crypto";
import { existsSync } from "node:fs";
import { mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";

const root = process.cwd();
const dryRun = process.argv.includes("--dry-run");
const maxAssetBytes = 5 * 1024 * 1024;
const concurrency = 5;
const neuformRepo = process.env.NEUFORM_REPO || "/Users/mengto/Downloads/Projects/Landing Pages";
const sourceEnvFile = path.join(neuformRepo, ".env");

const targets = [
  ["media", "aura-asset-images"],
  ["web-design", "agency-grid-layout-minimal"],
  ["web-design", "atmosphere-background"],
  ["web-design", "background-grid-webgl"],
  ["web-design", "beautiful-shadows"],
  ["web-design", "blue-cloudy-clean-modern"],
  ["web-design", "blue-laser-clean-glass-layout"],
  ["web-design", "book-serif-index"],
  ["web-design", "bright-green-tech-system-webgl"],
  ["web-design", "clean-minimal-beige-light-mode"],
  ["web-design", "company-logos"],
  ["web-design", "container-lines"],
  ["web-design", "corner-diagonals"],
  ["web-design", "corner-lasers"],
  ["web-design", "css-border-gradient"],
  ["web-design", "dark-blue-contrasting-clean"],
  ["web-design", "dark-glass-clean-layout"],
  ["web-design", "dither-background"],
  ["web-design", "dither-laser-dark-mode"],
  ["web-design", "editorial-tech"],
  ["web-design", "framed-grid-layout"],
  ["web-design", "framed-tech-dark-border-gradient"],
  ["web-design", "funky-purple-container-tech"],
  ["web-design", "glass-dark-mode-clock"],
  ["web-design", "globe-particles"],
  ["web-design", "gooey-blob-system"],
  ["web-design", "gsap"],
  ["web-design", "gsap-scrolltrigger-storytelling"],
  ["web-design", "high-contrast-skeuomorphic-clean"],
  ["web-design", "image-first-grid-layout"],
  ["web-design", "light-mode-paper-technical"],
  ["web-design", "marquee-loop"],
  ["web-design", "masked-reveal"],
  ["web-design", "mesh-gradient-dark-blue-clean"],
  ["web-design", "nested-container-clean-agency"],
  ["web-design", "nested-container-frames"],
  ["web-design", "number-details"],
  ["web-design", "orange-clean-paper-saas"],
  ["web-design", "progressive-blur"],
  ["web-design", "skeuomorphic-ui"],
  ["web-design", "solar-duotone-bold"],
  ["web-design", "split-layout-technical"],
  ["web-design", "tech-green-dark-mode-modern"],
  ["web-design", "technical-wireframe-info-layout"],
  ["web-design", "webgl-3d-object"],
  ["web-design", "webgl-laser"],
].map(([category, slug]) => ({ category, slug }));

function parseEnv(source) {
  const values = {};
  for (const rawLine of String(source || "").split(/\r?\n/)) {
    const line = rawLine.trim();
    if (!line || line.startsWith("#")) continue;
    const separator = line.indexOf("=");
    if (separator < 1) continue;
    const key = line.slice(0, separator).trim();
    let value = line.slice(separator + 1).trim();
    if ((value.startsWith('"') && value.endsWith('"')) || (value.startsWith("'") && value.endsWith("'"))) {
      value = value.slice(1, -1);
    }
    values[key] = value;
  }
  return values;
}

function sha256(value) {
  return createHash("sha256").update(value).digest("hex");
}

function safeText(value) {
  return String(value || "").replace(/\s+/g, " ").trim();
}

function normalizeLines(value) {
  if (Array.isArray(value)) return value.map(safeText).filter(Boolean);
  return String(value || "")
    .split(/\r?\n/)
    .map((line) => line.replace(/^[-*]\s*/, "").trim())
    .filter(Boolean);
}

function canonicalPageUrl(page) {
  const pathname = String(page?.canonical_path || page?.community_path || "").trim();
  if (pathname) return new URL(pathname, "https://neuform.ai").href;
  return new URL(`/p/${encodeURIComponent(String(page?.slug || page?.id || "design"))}`, "https://neuform.ai").href;
}

function extensionFor(contentType, url) {
  const normalizedType = String(contentType || "").split(";")[0].trim().toLowerCase();
  const byType = {
    "image/avif": ".avif",
    "image/gif": ".gif",
    "image/jpeg": ".jpg",
    "image/png": ".png",
    "image/svg+xml": ".svg",
    "image/webp": ".webp",
    "video/mp4": ".mp4",
    "video/webm": ".webm",
  };
  if (byType[normalizedType]) return byType[normalizedType];
  const pathname = new URL(url).pathname;
  const extension = path.extname(pathname).toLowerCase();
  return /^\.(?:avif|gif|jpe?g|png|svg|webp|mp4|webm)$/.test(extension) ? extension.replace(".jpeg", ".jpg") : "";
}

function collectPageAssetUrls(html) {
  const urls = new Set();
  const add = (value) => {
    const url = String(value || "").trim();
    if (/^https?:\/\//i.test(url)) urls.add(url);
  };

  for (const match of html.matchAll(/<(?:img|source|video)\b[^>]*>/gi)) {
    const tag = match[0];
    for (const attribute of tag.matchAll(/\b(?:src|poster)\s*=\s*["']([^"']+)["']/gi)) add(attribute[1]);
    for (const attribute of tag.matchAll(/\bsrcset\s*=\s*["']([^"']+)["']/gi)) {
      for (const candidate of attribute[1].split(",")) add(candidate.trim().split(/\s+/)[0]);
    }
  }
  for (const match of html.matchAll(/url\(\s*["']?(https?:\/\/[^)'"\s]+)["']?\s*\)/gi)) add(match[1]);
  return [...urls].filter((url) => {
    const hostname = new URL(url).hostname.toLowerCase();
    return hostname !== "fonts.googleapis.com" && hostname !== "api.fontshare.com";
  });
}

function runtimeDependencies(html) {
  const urls = new Set();
  for (const match of html.matchAll(/<(?:script|link)\b[^>]*(?:src|href)\s*=\s*["'](https?:\/\/[^"']+)["'][^>]*>/gi)) {
    urls.add(match[1]);
  }
  return [...urls].sort();
}

async function fetchRequired(url, options = {}) {
  const response = await fetch(url, options);
  if (!response.ok) throw new Error(`${response.status} ${response.statusText} for ${url}`);
  return response;
}

async function bundlePageAssets(html, demoDirectory, slug) {
  const assetDirectory = path.join(demoDirectory, "assets");
  const sourceUrls = collectPageAssetUrls(html);
  const bundled = [];
  const skipped = [];
  let rewrittenHtml = html;

  if (!dryRun) await mkdir(assetDirectory, { recursive: true });

  for (let index = 0; index < sourceUrls.length; index += 1) {
    const url = sourceUrls[index];
    try {
      const requestUrl = new URL(url);
      if (requestUrl.hostname === "images.unsplash.com") {
        requestUrl.searchParams.set("w", "1600");
        requestUrl.searchParams.set("q", "82");
        requestUrl.searchParams.set("auto", "format");
        requestUrl.searchParams.set("fit", "crop");
      }
      const response = await fetchRequired(requestUrl.href);
      const announcedSize = Number(response.headers.get("content-length"));
      if (Number.isFinite(announcedSize) && announcedSize > maxAssetBytes) {
        skipped.push({ reason: "over-5mb", url });
        continue;
      }
      const bytes = Buffer.from(await response.arrayBuffer());
      if (bytes.byteLength > maxAssetBytes) {
        skipped.push({ reason: "over-5mb", url });
        continue;
      }
      const extension = extensionFor(response.headers.get("content-type"), requestUrl.href);
      if (!extension) {
        skipped.push({ reason: "unsupported-content-type", url });
        continue;
      }
      const sourceName = path.basename(new URL(url).pathname, path.extname(new URL(url).pathname))
        .replace(/[^a-z0-9]+/gi, "-")
        .replace(/^-|-$/g, "")
        .toLowerCase()
        .slice(0, 48) || "asset";
      const fileName = `page-${String(index + 1).padStart(2, "0")}-${sourceName}${extension}`;
      const relativePath = `assets/${fileName}`;
      if (!dryRun) await writeFile(path.join(assetDirectory, fileName), bytes);
      rewrittenHtml = rewrittenHtml.split(url).join(relativePath);
      bundled.push({ bytes: bytes.byteLength, file: relativePath, original_url: url });
    } catch (error) {
      skipped.push({ reason: safeText(error?.message || error), url });
    }
  }

  return { bundled, html: rewrittenHtml, skipped };
}

function buildPrompt(skill, page, metrics, sourceUrl) {
  const headings = (Array.isArray(page?.metadata?.headings) ? page.metadata.headings : [])
    .map(safeText)
    .filter(Boolean)
    .slice(0, 5);
  const tags = (Array.isArray(page?.metadata?.tags) ? page.metadata.tags : [])
    .map(safeText)
    .filter(Boolean)
    .slice(0, 8);
  const promptLines = normalizeLines(skill?.prompt_lines).slice(0, 8);
  const title = safeText(page?.title) || safeText(skill?.label) || skill.id;
  const description = safeText(page?.description || page?.metadata?.description);

  return [
    `# ${safeText(skill?.label) || skill.id} Demo Prompts`,
    "",
    "## Minimal prompt",
    "",
    `Use $${skill.id} to create a responsive standalone HTML design with the same visual confidence, hierarchy, and interaction finish as the included Neuform reference.`,
    "",
    "## Recreate the demo",
    "",
    `Use $${skill.id} to recreate the design quality and behavior of **${title}** as a complete responsive HTML document. Treat the included demo/index.html as the visual and interaction reference, not as a loose mood board.`,
    "",
    "### Product brief",
    "",
    `- Page concept: ${title}.`,
    ...(description ? [`- Purpose: ${description}`] : []),
    ...(headings.length ? [`- Content anchors: ${headings.join(" · ")}.`] : []),
    ...(tags.length ? [`- Useful subject tags: ${tags.join(", ")}.`] : []),
    "",
    "### Skill direction",
    "",
    `- ${safeText(skill?.description)}`,
    ...promptLines.map((line) => `- ${line}`),
    "",
    "### Fidelity target",
    "",
    "- Match the reference's composition, information density, type scale, spacing rhythm, surface treatment, color relationships, and motion restraint.",
    "- Preserve the strongest interaction and animated background behavior instead of replacing it with generic fades or decorative movement.",
    "- Keep the first screen art-directed, then carry the same design logic through every supporting section.",
    "- Make the result responsive from mobile to desktop, keyboard accessible, and stable when reduced motion is enabled.",
    "- Deliver a full index.html. Put page-owned images, video, models, and textures in demo/assets/. External runtime libraries may stay as pinned CDN dependencies when the source relies on them.",
    "",
    "### Reference snapshot",
    "",
    `- Source: ${sourceUrl}`,
    `- Neuform rank: #1 for ${skill.id} when synced.`,
    `- Popularity: ${metrics.views.toLocaleString("en-US")} views · ${metrics.favorites.toLocaleString("en-US")} favorites · ${metrics.remixes.toLocaleString("en-US")} remixes.`,
    "- Ranking rule: views descending, then favorites descending.",
    "",
    "## Remix prompt",
    "",
    `Use $${skill.id} and the included Neuform demo as the quality bar, but replace the brand, subject, copy, palette, and content. Preserve the underlying layout logic, signature visual treatment, interaction choreography, responsive behavior, and performance constraints so the remix still clearly demonstrates the skill.`,
    "",
  ].join("\n");
}

async function syncTarget(target, env) {
  const skillDirectory = path.join(root, "agent-skills", target.category, target.slug);
  const demoDirectory = path.join(skillDirectory, "demo");
  if (!existsSync(path.join(skillDirectory, "SKILL.md"))) throw new Error(`Missing local skill ${target.category}/${target.slug}`);

  const params = new URLSearchParams({
    action: "public-skill",
    skillSlug: target.slug,
    page: "1",
    pageSize: "1",
    preview: "1",
    htmlPreviewLimit: "1",
    promptSkillsLimit: "1",
  });
  const endpoint = `${env.apiUrl}/functions/v1/pages?${params}`;
  const payloadResponse = await fetch(endpoint, { headers: env.headers });
  if (payloadResponse.status === 404) {
    return { ...target, skipped: true };
  }
  if (!payloadResponse.ok) throw new Error(`${payloadResponse.status} ${payloadResponse.statusText} for ${endpoint}`);
  const payload = await payloadResponse.json();
  const skill = payload?.skill;
  const page = Array.isArray(payload?.pages) ? payload.pages[0] : null;
  if (!skill || !page?.html_signed_url) throw new Error(`No public ranked design for ${target.slug}`);

  const originalHtml = await (await fetchRequired(page.html_signed_url)).text();
  const assetResult = await bundlePageAssets(originalHtml, demoDirectory, target.slug);
  const sourceUrl = canonicalPageUrl(page);
  const metrics = {
    favorites: Math.max(0, Number(page.community_favorite_count) || 0),
    remixes: Math.max(0, Number(page.remix_count) || 0),
    views: Math.max(0, Number(page.view_count) || 0),
  };

  let previewAsset = "";
  if (page.screenshot_signed_url) {
    const screenshotResponse = await fetchRequired(page.screenshot_signed_url);
    const screenshotBytes = Buffer.from(await screenshotResponse.arrayBuffer());
    const screenshotExtension = extensionFor(screenshotResponse.headers.get("content-type"), page.screenshot_signed_url) || ".jpg";
    previewAsset = `assets/source-preview${screenshotExtension}`;
    if (!dryRun) {
      await mkdir(path.join(demoDirectory, "assets"), { recursive: true });
      await writeFile(path.join(demoDirectory, previewAsset), screenshotBytes);
    }
  }

  const manifest = {
    version: 1,
    provider: "Neuform",
    synced_at: new Date().toISOString(),
    skill: {
      id: skill.id,
      label: skill.label,
      usage_count: Math.max(0, Number(skill.usage_count) || 0),
      url: `https://neuform.ai/skill/${encodeURIComponent(skill.id)}`,
    },
    ranking: {
      position: 1,
      order: ["view_count desc", "community_favorite_count desc", "relation_created_at desc"],
      visible_design_count: Math.max(0, Number(payload.visible_page_count) || 0),
    },
    design: {
      id: page.id,
      slug: page.slug,
      title: page.title,
      url: sourceUrl,
      view_count: metrics.views,
      favorite_count: metrics.favorites,
      remix_count: metrics.remixes,
    },
    html: {
      original_sha256: sha256(originalHtml),
      bundled_sha256: sha256(assetResult.html),
      runtime_dependencies: runtimeDependencies(assetResult.html),
    },
    assets: {
      preview: previewAsset,
      bundled: assetResult.bundled,
      skipped: assetResult.skipped,
    },
  };

  if (!dryRun) {
    await mkdir(demoDirectory, { recursive: true });
    await writeFile(path.join(demoDirectory, "index.html"), assetResult.html.endsWith("\n") ? assetResult.html : `${assetResult.html}\n`);
    await writeFile(path.join(demoDirectory, "PROMPT.md"), buildPrompt(skill, page, metrics, sourceUrl));
    await writeFile(path.join(demoDirectory, "source.json"), `${JSON.stringify(manifest, null, 2)}\n`);
  }

  return {
    ...target,
    assets: assetResult.bundled.length + (previewAsset ? 1 : 0),
    title: safeText(page.title),
    ...metrics,
  };
}

async function main() {
  const fileEnv = existsSync(sourceEnvFile) ? parseEnv(await readFile(sourceEnvFile, "utf8")) : {};
  const apiUrl = String(process.env.NEUFORM_API_URL || fileEnv.VITE_SUPABASE_URL || "").replace(/\/$/, "");
  const anonKey = String(process.env.NEUFORM_ANON_KEY || fileEnv.VITE_SUPABASE_ANON_KEY || "").trim();
  if (!apiUrl || !anonKey) throw new Error("Set NEUFORM_API_URL and NEUFORM_ANON_KEY, or provide the Neuform .env file.");
  const env = {
    apiUrl,
    headers: { apikey: anonKey, Authorization: `Bearer ${anonKey}` },
  };

  const queue = [...targets];
  const results = [];
  const skipped = [];
  const failures = [];
  const workers = Array.from({ length: concurrency }, async () => {
    while (queue.length) {
      const target = queue.shift();
      try {
        const result = await syncTarget(target, env);
        if (result.skipped) {
          skipped.push(result);
          console.log(`skipped ${result.slug}: no ranked public design`);
        } else {
          results.push(result);
          console.log(`synced ${result.slug}: ${result.title} (${result.views} views)`);
        }
      } catch (error) {
        failures.push({ ...target, message: safeText(error?.message || error) });
        console.error(`failed ${target.slug}: ${safeText(error?.message || error)}`);
      }
    }
  });
  await Promise.all(workers);

  console.log(`${dryRun ? "Checked" : "Synced"} ${results.length}/${targets.length} Neuform demos; ${skipped.length} had no ranked public design.`);
  if (failures.length) {
    for (const failure of failures) console.error(`- ${failure.category}/${failure.slug}: ${failure.message}`);
    process.exitCode = 1;
  }
}

await main();
