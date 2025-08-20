// scripts/list-files.mjs
import { globby } from 'globby';
import fs from 'fs';

const run = async () => {
  const files = await globby([
    '**/*.{js,ts,tsx,json}',
    '!node_modules/**',
    '!.next/**',
    '!.git/**',
  ]);

  fs.writeFileSync('file-list.txt', files.join('\n'));
  console.log('✅ file-list.txt generated');
};

run();
