// @ts-check
const fs = require('fs');
const path = require('path');

const distDir =
  process.env['DIST_PATH'] ?
    path.resolve(process.env['DIST_PATH'])
  : path.resolve(__dirname, '..', '..', 'dist');

async function* walk(dir) {
  for await (const d of await fs.promises.opendir(dir)) {
    const entry = path.join(dir, d.name);
    if (d.isDirectory()) yield* walk(entry);
    else if (d.isFile()) yield entry;
  }
}

async function postprocess() {
  for await (const file of walk(distDir)) {
    if (!/(\.d)?[cm]?ts$/.test(file)) continue;

    const code = await fs.promises.readFile(file, 'utf8');

    // strip out lib="dom", types="node", and types="react" references; these
    // are needed at build time, but would pollute the user's TS environment
    let transformed = code.replace(
      /^ *\/\/\/ *<reference +(lib="dom"|types="(node|react)").*?\n/gm,
      // replace with same number of characters to avoid breaking source maps
      (match) => ' '.repeat(match.length - 1) + '\n',
    );

    // TypeScript's declaration emitter collapses /** @ts-ignore */ onto the same
    // line as the type declaration, which doesn't work. So we convert to // @ts-ignore
    // on its own line to properly suppresses errors.
    if (file.endsWith('.d.ts') || file.endsWith('.d.mts') || file.endsWith('.d.cts')) {
      transformed = transformed.replace(/\/\*\* @ts-ignore\b[^*]*\*\/ /gm, '// @ts-ignore\n');
    }

    if (transformed !== code) {
      console.error(`wrote ${path.relative(process.cwd(), file)}`);
      await fs.promises.writeFile(file, transformed, 'utf8');
    }
  }

  // langsmith/vitest* are ESM-only at runtime (top-level await), but CJS and node10
  // TypeScript projects still resolve their types, as langsmith-sdk shipped them:
  // write a .d.ts next to every entrypoint .d.mts that has no .js twin.
  for await (const file of walk(distDir)) {
    const rel = path.relative(distDir, file);
    if (!rel.endsWith('.d.mts') || /^(src|internal|bin|lib)\//.test(rel)) continue;
    const base = file.slice(0, -'.d.mts'.length);
    if (fs.existsSync(base + '.js')) continue;
    const code = await fs.promises.readFile(file, 'utf8');
    await fs.promises.writeFile(base + '.d.ts', code.replace(/^\/\/# sourceMappingURL=.*\n?/m, ''), 'utf8');
  }

  const newExports = {
    '.': {
      require: {
        types: './index.d.ts',
        default: './index.js',
      },
      types: './index.d.mts',
      default: './index.mjs',
    },
  };

  for (const entry of await fs.promises.readdir(distDir, { withFileTypes: true })) {
    if (entry.isDirectory() && entry.name !== 'src' && entry.name !== 'internal' && entry.name !== 'bin') {
      const subpath = './' + entry.name;
      newExports[subpath + '/*.mjs'] = {
        default: subpath + '/*.mjs',
      };
      newExports[subpath + '/*.js'] = {
        default: subpath + '/*.js',
      };
      newExports[subpath + '/*'] = {
        import: subpath + '/*.mjs',
        require: subpath + '/*.js',
      };
    } else if (entry.isFile() && /\.[cm]?js$/.test(entry.name)) {
      const { name, ext } = path.parse(entry.name);
      const subpathWithoutExt = './' + name;
      const subpath = './' + entry.name;
      newExports[subpathWithoutExt] ||= { import: undefined, require: undefined };
      const isModule = ext[1] === 'm';
      if (isModule) {
        newExports[subpathWithoutExt].import = subpath;
      } else {
        newExports[subpathWithoutExt].require = subpath;
      }
      newExports[subpath] = {
        default: subpath,
      };
    }
  }
  // ESM-only entrypoints: types for `require`, no runtime target
  for (const [subpath, target] of Object.entries(newExports)) {
    if ('import' in target && !target.require && fs.existsSync(path.join(distDir, subpath + '.d.ts'))) {
      target.require = { types: subpath + '.d.ts' };
    }
  }
  // entrypoints package.json points into lib/ (hand-written code) win over the generated file of the same name;
  // `./package.json` is kept as in langsmith-sdk
  const distPkg = JSON.parse(await fs.promises.readFile('dist/package.json', 'utf-8'));
  for (const [subpath, target] of Object.entries(distPkg.exports ?? {})) {
    if (subpath === './package.json' || JSON.stringify(target).includes('./lib/'))
      newExports[subpath] = target;
  }
  await fs.promises.writeFile(
    'dist/package.json',
    JSON.stringify(
      Object.assign(
        /** @type {Record<String, unknown>} */ (
          JSON.parse(await fs.promises.readFile('dist/package.json', 'utf-8'))
        ),
        {
          exports: newExports,
        },
      ),
      null,
      2,
    ),
  );
}
postprocess();
