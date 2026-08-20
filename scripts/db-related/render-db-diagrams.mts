import { execFileSync } from 'node:child_process';
import { mkdirSync, readdirSync } from 'node:fs';
import { basename, join, resolve } from 'node:path';

const sourceDir = resolve('docs/db-diagrams/source');
const outputDir = resolve('docs/db-diagrams');

mkdirSync(outputDir, { recursive: true });

const sources = readdirSync(sourceDir)
  .filter((name) => name.endsWith('.dbml'))
  .sort();

if (sources.length === 0) throw new Error(`No DBML sources found in ${sourceDir}`);

const renderer = resolve('node_modules/@softwaretechnik/dbml-renderer/lib/index.js');

for (const source of sources) {
  const output = join(outputDir, `${basename(source, '.dbml')}.svg`);
  execFileSync(process.execPath, [renderer, '-i', join(sourceDir, source), '-f', 'svg', '-o', output], {
    stdio: 'inherit',
  });
  console.log(`Rendered ${source} -> ${output}`);
}
