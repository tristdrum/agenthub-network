import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

import { docsPages, renderMintlifyDoc } from "../src/content/docs-content.js";

const rootDir = path.resolve(
  path.dirname(fileURLToPath(import.meta.url)),
  "..",
);
const docsDir = path.join(rootDir, "docs");

await mkdir(docsDir, { recursive: true });

await Promise.all(
  docsPages.map((page) =>
    writeFile(
      path.join(docsDir, `${page.slug}.mdx`),
      renderMintlifyDoc(page),
      "utf8",
    ),
  ),
);

console.log(`Synced ${docsPages.length} Mintlify docs files.`);
