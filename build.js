// Compiles src/*.mjml into dist/*.html with strict validation.
// Usage: node build.js
const fs = require('fs');
const path = require('path');
const mjml = require('mjml');

const srcDir = path.join(__dirname, 'src');
const outDir = path.join(__dirname, 'dist');
fs.mkdirSync(outDir, { recursive: true });

let failed = false;
for (const file of fs.readdirSync(srcDir).filter(f => f.endsWith('.mjml'))) {
  const source = fs.readFileSync(path.join(srcDir, file), 'utf8');
  const { html, errors } = mjml(source, { validationLevel: 'strict', keepComments: false, filePath: srcDir });
  if (errors.length) {
    failed = true;
    console.error(`${file}: ${errors.length} error(s)`);
    for (const e of errors) console.error(`  line ${e.line}: ${e.message}`);
    continue;
  }
  const out = path.join(outDir, file.replace(/\.mjml$/, '.html'));
  fs.writeFileSync(out, html);
  console.log(`${file} -> dist/${path.basename(out)} (${(Buffer.byteLength(html) / 1024).toFixed(1)} KB)`);
}
process.exit(failed ? 1 : 0);
