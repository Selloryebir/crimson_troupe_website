import assert from 'node:assert/strict';
import { execFileSync, spawnSync } from 'node:child_process';
import { mkdtemp, mkdir, copyFile, writeFile, rm } from 'node:fs/promises';
import os from 'node:os';
import path from 'node:path';
import test from 'node:test';

const root = new URL('../', import.meta.url);

async function fixture(t) {
  const cwd = await mkdtemp(path.join(os.tmpdir(), 'crimson-quality-'));
  t.after(() => rm(cwd, { recursive: true, force: true }));
  await mkdir(path.join(cwd, 'scripts'), { recursive: true });
  await mkdir(path.join(cwd, 'src/styles'), { recursive: true });
  await mkdir(path.join(cwd, 'src/data'), { recursive: true });
  for (const name of ['quality.mjs', 'creative-review.mjs']) {
    await copyFile(new URL(`scripts/${name}`, root), path.join(cwd, 'scripts', name));
  }
  await writeFile(path.join(cwd, 'src/data/content.ts'), "export const title = 'Unreviewed';\n");
  await writeFile(path.join(cwd, 'src/styles/main.css'), 'body { color: black; }\n');
  await writeFile(path.join(cwd, 'README.md'), '# Example\n');
  await writeFile(
    path.join(cwd, 'package.json'),
    JSON.stringify({
      type: 'module',
      scripts: {
        'review:creative': 'node scripts/creative-review.mjs',
        'lint:styles:files': 'node -e "console.log(\'STYLE_STEP_REACHED\')"',
      },
    }),
  );
  execFileSync('git', ['init', '--quiet'], { cwd });
  execFileSync('git', ['add', '.'], { cwd });
  execFileSync(
    'git',
    [
      '-c',
      'user.name=Test',
      '-c',
      'user.email=test@example.invalid',
      'commit',
      '--quiet',
      '-m',
      'fixture',
    ],
    { cwd },
  );
  return cwd;
}

function quality(cwd, ...args) {
  return spawnSync(process.execPath, ['scripts/quality.mjs', ...args], {
    cwd,
    encoding: 'utf8',
    env: { ...process.env, CREATIVE_REVIEW_BASE_REF: '' },
  });
}

test('scoped CSS and documentation still check the global creative record', async (t) => {
  const cwd = await fixture(t);
  for (const file of ['src/styles/main.css', 'README.md']) {
    const result = quality(cwd, '--plan', file);
    assert.equal(result.status, 0, result.stderr);
    assert.match(result.stdout, /npm run review:creative/);
  }
  const result = quality(cwd, 'src/styles/main.css');
  assert.equal(result.status, 1, result.stderr);
  assert.match(result.stdout, /review-required/);
  assert.doesNotMatch(result.stdout, /STYLE_STEP_REACHED/);
});

test('a clean checkout with no review record fails instead of skipping committed content', async (t) => {
  const cwd = await fixture(t);
  const result = quality(cwd);
  assert.equal(result.status, 1, result.stderr);
  assert.match(result.stdout, /review-required/);
});

test('toolchain changes delegate to verify once instead of duplicating its review check', async (t) => {
  const cwd = await fixture(t);
  const result = quality(cwd, '--plan', 'package.json');
  assert.equal(result.status, 0, result.stderr);
  assert.equal((result.stdout.match(/npm run verify/g) ?? []).length, 1);
  assert.doesNotMatch(result.stdout, /npm run review:creative/);
});
