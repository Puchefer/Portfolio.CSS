// Genera la carpeta "dist" con el código comprimido (minificado) para publicar.
// Tu código original, legible, se queda tal cual en el repositorio.
import { promises as fs } from 'fs';
import path from 'path';
import { minify as minJS } from 'terser';
import CleanCSS from 'clean-css';
import { minify as minHTML } from 'html-minifier-terser';

const OUT = 'dist';
const IGNORAR = new Set(['.git', 'node_modules', OUT, 'build.mjs', 'package.json', 'package-lock.json', 'netlify.toml', '.gitignore', 'README.md']);

async function copiar(dir = '.') {
  for (const e of await fs.readdir(dir, { withFileTypes: true })) {
    if (IGNORAR.has(e.name)) continue;
    const src = path.join(dir, e.name), dst = path.join(OUT, src);
    if (e.isDirectory()) { await fs.mkdir(dst, { recursive: true }); await copiar(src); continue; }
    const ext = path.extname(e.name).toLowerCase();
    if (ext === '.js') {
      const r = await minJS(await fs.readFile(src, 'utf8'), { compress: true, mangle: { toplevel: true } });
      await fs.writeFile(dst, r.code);
    } else if (ext === '.css') {
      await fs.writeFile(dst, new CleanCSS({ level: 2 }).minify(await fs.readFile(src, 'utf8')).styles);
    } else if (ext === '.html') {
      await fs.writeFile(dst, await minHTML(await fs.readFile(src, 'utf8'), {
        collapseWhitespace: true, removeComments: true, minifyCSS: true, minifyJS: true
      }));
    } else if (ext === '.json') {
      await fs.writeFile(dst, JSON.stringify(JSON.parse(await fs.readFile(src, 'utf8'))));
    } else {
      await fs.copyFile(src, dst);
    }
  }
}

await fs.rm(OUT, { recursive: true, force: true });
await fs.mkdir(OUT, { recursive: true });
await copiar();
console.log('Listo: web minificada en /dist');
