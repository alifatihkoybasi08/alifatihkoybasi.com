// Uygunsuz ifade listesinden assets/js/content-filter-data.js dosyasını (yalnız özetler) üretir.
// Açık liste depoda tutulmaz. Kullanım: node tools/blocklist.mjs <liste.txt>
import { readFileSync, writeFileSync } from "node:fs";
import { createRequire } from "node:module";

const require = createRequire(import.meta.url);
const { canonical, hash, MIN_PREFIX } = require("../assets/js/content-filter.js");

const listPath = process.argv[2];
if (!listPath) {
  console.error("Usage: node tools/blocklist.mjs <list.txt>");
  process.exit(1);
}

// "=" tam sözcük, "+" kök (ekli halleriyle), "!" hiç engellenmeyecek sözcük (yanlış alarm düzeltmesi).
const sets = { "=": new Set(), "+": new Set(), "!": new Set() };
readFileSync(listPath, "utf8").split(/\r?\n/).forEach((line, index) => {
  const entry = line.trim();
  if (!entry || entry.startsWith("#")) return;
  const target = sets[entry[0]];
  const word = canonical(entry.slice(1).trim());
  if (!target) throw new Error(`Line ${index + 1}: entry must start with "=", "+" or "!"`);
  if (!/^[\p{L}\p{N}]+$/u.test(word)) throw new Error(`Line ${index + 1}: entry must be a single word`);
  if (entry[0] === "+" && word.length < MIN_PREFIX) {
    throw new Error(`Line ${index + 1}: a root needs at least ${MIN_PREFIX} letters, use "=" for shorter words`);
  }
  target.add(hash(word));
});

const sorted = (set) => [...set].sort();
const data = { exact: sorted(sets["="]), prefix: sorted(sets["+"]), allow: sorted(sets["!"]) };
writeFileSync(
  new URL("../assets/js/content-filter-data.js", import.meta.url),
  "// tools/blocklist.mjs ile üretilir, elle düzenlenmez.\n" +
    "// Uygunsuz ifade listesinin özetleridir (cyrb53); kelimelerin kendisi bu depoda yoktur.\n" +
    `self.CONTENT_FILTER_DATA = ${JSON.stringify(data)};\n`,
);
console.log(`content-filter-data.js written: exact=${data.exact.length} prefix=${data.prefix.length} allow=${data.allow.length}`);
