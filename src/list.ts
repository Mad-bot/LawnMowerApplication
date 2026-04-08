import * as fs from 'fs';
import * as path from 'path';

function walk(dir: string): void {
  fs.readdirSync(dir).forEach(f => {
    const full = path.join(dir, f);
    if (fs.statSync(full).isDirectory()) walk(full);
    else console.log(full);
  });
}
walk('src');
