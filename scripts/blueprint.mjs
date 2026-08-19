import { existsSync } from 'node:fs';
import { readdir, readFile } from 'node:fs/promises';
import path from 'node:path';
import process from 'node:process';

const repositoryRoot = path.resolve(import.meta.dirname, '..');
const registryPath = path.join(repositoryRoot, 'docs/blueprint/traceability.json');
const blueprintDirectories = ['foundation', 'modules', 'content', 'i18n', 'quality'];
const functionalExtensions = new Set(['.astro', '.css', '.ts']);
const validStatuses = new Set(['active', 'retired']);
const validStages = new Set(['planned', 'demo', 'candidate', 'formal']);

function toRepositoryPath(filePath) {
  const absolutePath = path.isAbsolute(filePath)
    ? filePath
    : path.resolve(repositoryRoot, filePath);

  return path.relative(repositoryRoot, absolutePath).split(path.sep).join('/');
}

async function readRegistry() {
  const source = await readFile(registryPath, 'utf8');
  return JSON.parse(source);
}

async function listFiles(directory) {
  const entries = await readdir(directory, { withFileTypes: true });
  const files = [];

  for (const entry of entries) {
    const entryPath = path.join(directory, entry.name);
    if (entry.isDirectory()) {
      files.push(...(await listFiles(entryPath)));
    } else if (entry.isFile()) {
      files.push(toRepositoryPath(entryPath));
    }
  }

  return files;
}

function findDependencyCycles(blueprintsById) {
  const cycles = [];
  const state = new Map();
  const stack = [];

  function visit(id) {
    const currentState = state.get(id) ?? 0;
    if (currentState === 1) {
      const cycleStart = stack.indexOf(id);
      cycles.push([...stack.slice(cycleStart), id].join(' -> '));
      return;
    }
    if (currentState === 2) {
      return;
    }

    state.set(id, 1);
    stack.push(id);
    const blueprint = blueprintsById.get(id);
    for (const dependency of blueprint?.dependsOn ?? []) {
      if (blueprintsById.has(dependency)) {
        visit(dependency);
      }
    }
    stack.pop();
    state.set(id, 2);
  }

  for (const id of blueprintsById.keys()) {
    visit(id);
  }

  return [...new Set(cycles)];
}

async function checkRegistry(registry) {
  const issues = [];
  const blueprints = Array.isArray(registry.blueprints) ? registry.blueprints : [];
  const mappings = Array.isArray(registry.mappings) ? registry.mappings : [];

  if (registry.version !== 1) {
    issues.push('traceability.json 的 version 必须为 1。');
  }
  if (!Array.isArray(registry.blueprints)) {
    issues.push('traceability.json 缺少 blueprints 数组。');
  }
  if (!Array.isArray(registry.mappings)) {
    issues.push('traceability.json 缺少 mappings 数组。');
  }

  const blueprintsById = new Map();
  const documentPaths = new Set();

  for (const blueprint of blueprints) {
    if (typeof blueprint?.id !== 'string') {
      issues.push('发现缺少字符串 id 的蓝图记录。');
      continue;
    }

    const { id } = blueprint;
    if (!/^BP-(FND|MOD|CNT|I18N|QLT)-[A-Z0-9-]+$/.test(id)) {
      issues.push(`${id} 不符合 BP-<领域>-<能力> 命名规则。`);
    }
    if (blueprintsById.has(id)) {
      issues.push(`蓝图 ID 重复：${id}。`);
    }
    blueprintsById.set(id, blueprint);

    if (typeof blueprint.document !== 'string') {
      issues.push(`${id} 缺少 document 路径。`);
    } else {
      if (documentPaths.has(blueprint.document)) {
        issues.push(`蓝图文档被重复注册：${blueprint.document}。`);
      }
      documentPaths.add(blueprint.document);

      const documentPath = path.resolve(repositoryRoot, blueprint.document);
      if (!blueprint.document.startsWith('docs/blueprint/') || !existsSync(documentPath)) {
        issues.push(`${id} 的文档不存在或不在 docs/blueprint/：${blueprint.document}。`);
      } else {
        const heading = (await readFile(documentPath, 'utf8')).split(/\r?\n/, 1)[0];
        if (!heading.startsWith(`# ${id}`)) {
          issues.push(`${blueprint.document} 的一级标题必须以 ${id} 开头。`);
        }
      }
    }

    if (!validStatuses.has(blueprint.status)) {
      issues.push(`${id} 使用了未知 status：${String(blueprint.status)}。`);
    }
    if (!validStages.has(blueprint.stage)) {
      issues.push(`${id} 使用了未知 stage：${String(blueprint.stage)}。`);
    }
    if (!Array.isArray(blueprint.dependsOn)) {
      issues.push(`${id} 的 dependsOn 必须是数组。`);
    }
  }

  for (const blueprint of blueprints) {
    if (typeof blueprint?.id !== 'string' || !Array.isArray(blueprint.dependsOn)) {
      continue;
    }
    for (const dependency of blueprint.dependsOn) {
      if (!blueprintsById.has(dependency)) {
        issues.push(`${blueprint.id} 依赖未知蓝图：${String(dependency)}。`);
      } else if (
        blueprint.status === 'active' &&
        blueprintsById.get(dependency)?.status === 'retired'
      ) {
        issues.push(`${blueprint.id} 不能依赖已终止蓝图 ${String(dependency)}。`);
      }
      if (dependency === blueprint.id) {
        issues.push(`${blueprint.id} 不能依赖自身。`);
      }
    }
  }

  for (const cycle of findDependencyCycles(blueprintsById)) {
    issues.push(`蓝图依赖存在环：${cycle}。`);
  }

  const mappedPaths = new Set();
  for (const mapping of mappings) {
    if (typeof mapping?.path !== 'string') {
      issues.push('发现缺少字符串 path 的源码映射。');
      continue;
    }

    if (mappedPaths.has(mapping.path)) {
      issues.push(`功能源码被重复映射：${mapping.path}。`);
    }
    mappedPaths.add(mapping.path);

    if (
      !mapping.path.startsWith('src/') ||
      !existsSync(path.resolve(repositoryRoot, mapping.path))
    ) {
      issues.push(`映射的功能源码不存在或不在 src/：${mapping.path}。`);
    }
    if (!blueprintsById.has(mapping.primary)) {
      issues.push(`${mapping.path} 的主要蓝图不存在：${String(mapping.primary)}。`);
    } else if (blueprintsById.get(mapping.primary)?.status !== 'active') {
      issues.push(`${mapping.path} 的主要蓝图必须处于 active 状态：${String(mapping.primary)}。`);
    }
    if (!Array.isArray(mapping.related)) {
      issues.push(`${mapping.path} 的 related 必须是数组。`);
      continue;
    }

    const relatedIds = new Set();
    for (const relatedId of mapping.related) {
      if (!blueprintsById.has(relatedId)) {
        issues.push(`${mapping.path} 关联未知蓝图：${String(relatedId)}。`);
      } else if (blueprintsById.get(relatedId)?.status !== 'active') {
        issues.push(`${mapping.path} 的相关蓝图必须处于 active 状态：${String(relatedId)}。`);
      }
      if (relatedId === mapping.primary) {
        issues.push(`${mapping.path} 不应在 related 中重复主要蓝图 ${relatedId}。`);
      }
      if (relatedIds.has(relatedId)) {
        issues.push(`${mapping.path} 重复关联蓝图 ${String(relatedId)}。`);
      }
      relatedIds.add(relatedId);
    }
  }

  const functionalSourceFiles = (await listFiles(path.join(repositoryRoot, 'src'))).filter((file) =>
    functionalExtensions.has(path.extname(file)),
  );
  for (const file of functionalSourceFiles) {
    if (!mappedPaths.has(file)) {
      issues.push(`功能源码尚未关联蓝图：${file}。`);
    }
  }

  const registeredDocuments = new Set(blueprints.map((blueprint) => blueprint.document));
  for (const directory of blueprintDirectories) {
    const directoryPath = path.join(repositoryRoot, 'docs/blueprint', directory);
    for (const document of await listFiles(directoryPath)) {
      if (path.extname(document) === '.md' && !registeredDocuments.has(document)) {
        issues.push(`蓝图文档尚未注册：${document}。`);
      }
    }
  }

  if (issues.length > 0) {
    console.error(`blueprint:check 发现 ${issues.length} 个问题：`);
    for (const issue of issues) {
      console.error(`- ${issue}`);
    }
    process.exitCode = 1;
    return;
  }

  console.log(
    `blueprint:check 通过：${blueprints.length} 份蓝图，${mappings.length} 个功能源码映射。`,
  );
}

function showBlueprint(role, id, blueprintsById) {
  const blueprint = blueprintsById.get(id);
  if (!blueprint) {
    console.log(`  ${role}: ${id}（未注册）`);
    return;
  }

  console.log(`  ${role}: ${id} [${blueprint.status}/${blueprint.stage}] ${blueprint.document}`);
}

function findBlueprintsForPaths(registry, inputPaths) {
  const blueprintsById = new Map(registry.blueprints.map((blueprint) => [blueprint.id, blueprint]));
  const mappingsByPath = new Map(registry.mappings.map((mapping) => [mapping.path, mapping]));
  let missing = false;

  for (const inputPath of inputPaths) {
    const repositoryPath = toRepositoryPath(inputPath);
    const mapping = mappingsByPath.get(repositoryPath);
    console.log(repositoryPath);
    if (!mapping) {
      console.log('  未找到功能源码映射。请先判断它是否需要蓝图，并检查 traceability.json。');
      missing = true;
      continue;
    }

    showBlueprint('主要', mapping.primary, blueprintsById);
    for (const relatedId of mapping.related) {
      showBlueprint('相关', relatedId, blueprintsById);
    }
  }

  if (missing) {
    process.exitCode = 1;
  }
}

function showImpact(registry, requestedIds) {
  const blueprintsById = new Map(registry.blueprints.map((blueprint) => [blueprint.id, blueprint]));
  const impactedIds = new Set();

  for (const id of requestedIds) {
    if (!blueprintsById.has(id)) {
      console.error(`未知蓝图 ID：${id}。`);
      process.exitCode = 1;
    } else if (blueprintsById.get(id)?.status !== 'active') {
      console.error(`蓝图 ${id} 已终止，不再提供实现影响范围。`);
      process.exitCode = 1;
    } else {
      impactedIds.add(id);
    }
  }
  if (process.exitCode) {
    return;
  }

  let changed = true;
  while (changed) {
    changed = false;
    for (const blueprint of registry.blueprints) {
      if (
        blueprint.status === 'active' &&
        !impactedIds.has(blueprint.id) &&
        blueprint.dependsOn.some((dependency) => impactedIds.has(dependency))
      ) {
        impactedIds.add(blueprint.id);
        changed = true;
      }
    }
  }

  console.log('候选影响蓝图：');
  for (const blueprint of registry.blueprints) {
    if (impactedIds.has(blueprint.id)) {
      const relation = requestedIds.includes(blueprint.id) ? '直接' : '传递';
      console.log(
        `- [${relation}] ${blueprint.id} [${blueprint.status}/${blueprint.stage}] ${blueprint.document}`,
      );
    }
  }

  const impactedFiles = registry.mappings.filter((mapping) =>
    [mapping.primary, ...mapping.related].some((id) => impactedIds.has(id)),
  );
  console.log('候选影响源码：');
  if (impactedFiles.length === 0) {
    console.log('- 无直接映射；仍需判断内容或未来实现是否受影响。');
  } else {
    for (const mapping of impactedFiles) {
      console.log(`- ${mapping.path}`);
    }
  }

  console.log('以上是检查范围，不要求每个候选文件都产生改动。');
}

function showUsage() {
  console.log(`用法：
  node scripts/blueprint.mjs check
  node scripts/blueprint.mjs where <源码路径...>
  node scripts/blueprint.mjs impact <蓝图 ID...>`);
}

async function main() {
  const [command, ...arguments_] = process.argv.slice(2);
  const registry = await readRegistry();

  if (command === 'check' && arguments_.length === 0) {
    await checkRegistry(registry);
    return;
  }
  if (command === 'where' && arguments_.length > 0) {
    findBlueprintsForPaths(registry, arguments_);
    return;
  }
  if (command === 'impact' && arguments_.length > 0) {
    showImpact(registry, arguments_);
    return;
  }

  showUsage();
  process.exitCode = 1;
}

main().catch((error) => {
  console.error(error instanceof Error ? error.message : error);
  process.exitCode = 1;
});
