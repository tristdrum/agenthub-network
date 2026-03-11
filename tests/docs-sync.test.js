import test from "node:test";
import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

import { docsPages, renderMintlifyDoc } from "../src/content/docs-content.js";

const rootDir = path.resolve(
  path.dirname(fileURLToPath(import.meta.url)),
  "..",
);

test("Mintlify docs stay synced with the shared docs source", async () => {
  for (const page of docsPages) {
    const filePath = path.join(rootDir, "docs", `${page.slug}.mdx`);
    const actual = await readFile(filePath, "utf8");
    assert.equal(actual, renderMintlifyDoc(page));
  }
});
