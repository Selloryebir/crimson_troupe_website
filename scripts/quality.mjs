#!/usr/bin/env node

import { existsSync, lstatSync, readFileSync, readdirSync } from 'node:fs';
import path from 'node:path';
import { spawnSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';

const repositoryRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const npmCommand = process.platform === 'win32' ? 'npm.cmd' : 'npm';
const ignoredDirectories = new Set([
  '.astro',
  '.cache',
  '.git',
  'build',
  'coverage',
  'dist',
  'node_modules',
  'playwright-report',
  'test-results',
]);
const prettierExtensions = new Set([
  '.astro',
  '.cjs',
  '.js',
  '.json',
  '.json5',
  '.md',
  '.mdx',
  '.mjs',
  '.ts',
  '.yaml',
  '.yml',
]);
const textExtensions = new Set([...prettierExtensions, '.css', '.csv', '.html', '.svg', '.txt']);

function printUsage() {
  console.log(`用法：
  npm run quality
  npm run quality -- <文件或目录...>
  npm run quality -- --plan <文件或目录...>

未提供路径时检查相对 HEAD 的已暂存、未暂存和未跟踪文件。
--plan 只显示将执行的检查，不运行检查。完整发布门禁使用 npm run verify。`);
}

function run(command, arguments_, options = {}) {
  const result = spawnSync(command, arguments_, {
    cwd: repositoryRoot,
    encoding: 'utf8',
    stdio: options.capture ? 'pipe' : 'inherit',
  });

  if (result.error) {
    throw result.error;
  }
  if (result.status !== 0) {
    if (options.capture) {
      process.stderr.write(result.stderr || result.stdout || '');
    }
    process.exit(result.status ?? 1);
  }
  return options.capture ? result.stdout : '';
}

function runGit(arguments_) {
  return run('git', arguments_, { capture: true });
}

function normalizeRepositoryPath(value) {
  const absolutePath = path.resolve(repositoryRoot, value);
  const relativePath = path.relative(repositoryRoot, absolutePath);
  if (relativePath === '..' || relativePath.startsWith(`..${path.sep}`)) {
    throw new Error(`路径不在仓库内：${value}`);
  }
  return relativePath.split(path.sep).join('/');
}

function splitNullList(value) {
  return value.split('\0').filter(Boolean).map(normalizeRepositoryPath);
}

function listGitPaths(arguments_) {
  return new Set(splitNullList(runGit(arguments_)));
}

function discoverChanges() {
  const changed = listGitPaths(['diff', '--name-only', '-z', 'HEAD', '--']);
  const untracked = listGitPaths(['ls-files', '--others', '--exclude-standard', '-z']);
  const structural = new Set([
    ...listGitPaths(['diff', '--name-only', '--diff-filter=ADR', '-z', 'HEAD', '--']),
    ...untracked,
  ]);

  return {
    paths: new Set([...changed, ...untracked]),
    structural,
    untracked,
  };
}

function collectDirectory(directoryPath, target) {
  for (const entry of readdirSync(directoryPath, { withFileTypes: true })) {
    if (entry.isDirectory() && ignoredDirectories.has(entry.name)) {
      continue;
    }
    const entryPath = path.join(directoryPath, entry.name);
    if (entry.isDirectory()) {
      collectDirectory(entryPath, target);
    } else if (entry.isFile()) {
      target.add(normalizeRepositoryPath(entryPath));
    }
  }
}

function collectExplicitPaths(values, discovered) {
  const paths = new Set();
  for (const value of values) {
    const repositoryPath = normalizeRepositoryPath(value);
    const absolutePath = path.join(repositoryRoot, repositoryPath);
    if (existsSync(absolutePath) && lstatSync(absolutePath).isDirectory()) {
      collectDirectory(absolutePath, paths);
    } else {
      paths.add(repositoryPath);
    }
  }

  const untracked = new Set([...paths].filter((entry) => discovered.untracked.has(entry)));
  const structural = new Set(
    [...paths].filter(
      (entry) =>
        discovered.structural.has(entry) ||
        (!existsSync(path.join(repositoryRoot, entry)) && isFunctionalSource(entry)),
    ),
  );
  return { paths, structural, untracked };
}

function hasExtension(repositoryPath, extensions) {
  return extensions.has(path.extname(repositoryPath).toLowerCase());
}

function isFunctionalSource(repositoryPath) {
  return /^src\/.+\.(?:astro|css|ts)$/u.test(repositoryPath);
}

function isCodeSource(repositoryPath) {
  return /^src\/.+\.(?:astro|ts)$/u.test(repositoryPath);
}

function isStyleSource(repositoryPath) {
  return /^src\/.+\.css$/u.test(repositoryPath);
}

function isRuntimeAsset(repositoryPath) {
  return (
    /^(?:public|src\/assets)\//u.test(repositoryPath) &&
    !['.md', '.mdx'].includes(path.extname(repositoryPath).toLowerCase())
  );
}

function isFormalBlueprint(repositoryPath) {
  return repositoryPath.startsWith('docs/blueprint/');
}

function isToolchain(repositoryPath) {
  return (
    repositoryPath === 'package.json' ||
    repositoryPath === 'package-lock.json' ||
    repositoryPath === 'astro.config.ts' ||
    repositoryPath === 'tsconfig.json' ||
    repositoryPath === '.editorconfig' ||
    repositoryPath === '.prettierignore' ||
    /^(?:eslint|prettier|stylelint)\.config\.[cm]?[jt]s$/u.test(repositoryPath) ||
    repositoryPath.startsWith('.github/') ||
    repositoryPath.startsWith('.husky/') ||
    repositoryPath.startsWith('scripts/')
  );
}

function commandText(script, files = []) {
  const suffix =
    files.length > 0 ? ` -- ${files.map((file) => JSON.stringify(file)).join(' ')}` : '';
  return `npm run ${script}${suffix}`;
}

function buildPlan(changeSet) {
  const paths = [...changeSet.paths].sort();
  const existingPaths = paths.filter((entry) => existsSync(path.join(repositoryRoot, entry)));
  const prettierFiles = existingPaths.filter(
    (entry) => hasExtension(entry, prettierExtensions) && entry !== 'package-lock.json',
  );
  const codeFiles = existingPaths.filter(isCodeSource);
  const styleFiles = existingPaths.filter(isStyleSource);
  const hasCodeChanges = paths.some(isCodeSource);
  const hasStyleChanges = paths.some(isStyleSource);
  const hasBlueprintChanges = paths.some(isFormalBlueprint);
  const hasStructuralSourceChanges = [...changeSet.structural].some(isFunctionalSource);
  const hasToolchainChanges = paths.some(isToolchain);

  const runtimeLayers = [
    hasCodeChanges ? 'Astro/TypeScript' : null,
    hasStyleChanges ? 'CSS' : null,
    paths.some(isRuntimeAsset) ? '运行时资产' : null,
  ].filter(Boolean);
  const crossesRuntimeLayers = runtimeLayers.length > 1;
  const crossesBlueprintAndRuntime =
    hasBlueprintChanges && (hasCodeChanges || hasStyleChanges || paths.some(isRuntimeAsset));

  const tasks = [
    {
      id: 'whitespace',
      reason: '所有变更都需要检查补丁空白错误；未跟踪文本另行检查尾随空白',
      command: `git diff --check HEAD -- ${paths.map((file) => JSON.stringify(file)).join(' ')}`,
    },
  ];

  if (hasToolchainChanges || crossesRuntimeLayers || crossesBlueprintAndRuntime) {
    const reasons = [];
    if (hasToolchainChanges) {
      reasons.push('检测到工具链或质量配置变更');
    }
    if (crossesRuntimeLayers) {
      reasons.push(`检测到运行时跨层集成（${runtimeLayers.join(' + ')}）`);
    }
    if (crossesBlueprintAndRuntime) {
      reasons.push('正式蓝图与运行时实现同时变更');
    }
    tasks.push({
      id: 'verify',
      reason: `${reasons.join('；')}，按规范执行一次完整门禁与一次构建`,
      command: commandText('verify'),
      script: 'verify',
      files: [],
    });
    return { paths, tasks };
  }

  if (hasBlueprintChanges || hasStructuralSourceChanges) {
    tasks.push({
      id: 'blueprint',
      reason: hasBlueprintChanges
        ? '正式蓝图或追踪信息发生变化'
        : '功能源码新增、删除或重命名，需确认追踪映射未漂移',
      command: commandText('blueprint:check'),
      script: 'blueprint:check',
      files: [],
    });
  }
  if (hasCodeChanges) {
    tasks.push({
      id: 'astro-check',
      reason: 'Astro/TypeScript 变更可能影响完整类型依赖图，因此类型检查保持项目级',
      command: commandText('check'),
      script: 'check',
      files: [],
    });
    if (codeFiles.length > 0) {
      tasks.push({
        id: 'eslint',
        reason: 'ESLint 规则按文件独立执行，只检查本次变更的 Astro/TypeScript 文件',
        command: commandText('lint:code:files', codeFiles),
        script: 'lint:code:files',
        files: codeFiles,
      });
    }
  }
  if (hasStyleChanges && styleFiles.length > 0) {
    tasks.push({
      id: 'stylelint',
      reason: '只检查本次变更的 CSS 文件',
      command: commandText('lint:styles:files', styleFiles),
      script: 'lint:styles:files',
      files: styleFiles,
    });
  }
  if (prettierFiles.length > 0) {
    tasks.push({
      id: 'prettier',
      reason: '只检查本次变更且受 Prettier 管理的文本文件',
      command: commandText('format:check:files', prettierFiles),
      script: 'format:check:files',
      files: prettierFiles,
    });
  }

  return { paths, tasks };
}

function checkWhitespace(changeSet) {
  const paths = [...changeSet.paths].sort();
  if (paths.length > 0) {
    run('git', ['diff', '--check', 'HEAD', '--', ...paths]);
  }

  const issues = [];
  for (const repositoryPath of changeSet.untracked) {
    const absolutePath = path.join(repositoryRoot, repositoryPath);
    if (!existsSync(absolutePath) || !hasExtension(repositoryPath, textExtensions)) {
      continue;
    }
    const lines = readFileSync(absolutePath, 'utf8').split(/\r?\n/u);
    lines.forEach((line, index) => {
      if (/[\t ]+$/u.test(line)) {
        issues.push(`${repositoryPath}:${index + 1}: 存在尾随空白`);
      }
    });
  }
  if (issues.length > 0) {
    console.error(issues.join('\n'));
    process.exit(1);
  }
}

function printPlan(plan) {
  console.log(`quality: 识别到 ${plan.paths.length} 个目标文件。`);
  for (const task of plan.tasks) {
    console.log(`- ${task.id}: ${task.reason}`);
    console.log(`  ${task.command}`);
  }
  if (plan.tasks.length === 1) {
    console.log('- 其余检查：没有与这些文件相关的静态检查。');
  }
}

function executePlan(plan, changeSet) {
  for (const task of plan.tasks) {
    console.log(`\n[quality:${task.id}] ${task.reason}`);
    if (task.id === 'whitespace') {
      checkWhitespace(changeSet);
    } else {
      run(npmCommand, ['run', '--silent', task.script, '--', ...task.files]);
    }
  }
}

const rawArguments = process.argv.slice(2);
if (rawArguments.includes('--help') || rawArguments.includes('-h')) {
  printUsage();
  process.exit(0);
}
const planOnly = rawArguments.includes('--plan');
const pathArguments = rawArguments.filter((argument) => argument !== '--plan');
const discovered = discoverChanges();
const changeSet =
  pathArguments.length > 0 ? collectExplicitPaths(pathArguments, discovered) : discovered;

if (changeSet.paths.size === 0) {
  console.log(
    'quality: 未发现工作区变更；没有需要执行的日常检查。完整门禁请显式运行 npm run verify。',
  );
  process.exit(0);
}

const plan = buildPlan(changeSet);
printPlan(plan);
if (!planOnly) {
  executePlan(plan, changeSet);
}
