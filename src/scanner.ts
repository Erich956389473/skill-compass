import { readFileSync, existsSync, readdirSync } from 'fs';
import { join } from 'path';
import { homedir } from 'os';
import type { DetectedSkill, SkillDB, SkillCompassConfig } from './types.js';
import { catKeywords } from './types.js';

// ── 分类推断 ──

export function inferCategories(name: string, description: string): string[] {
  const combined = (name + ' ' + description).toLowerCase();
  const cats: string[] = [];
  for (const [cat, keywords] of catKeywords) {
    if (keywords.some(k => combined.includes(k.toLowerCase()))) cats.push(cat);
  }
  return cats.length > 0 ? cats : ['infrastructure'];
}

// ── 扫描单个目录 ──

function scanDirectory(
  dir: string,
  label: string,
  source: 'workbuddy' | 'self-made',
  db: SkillDB
): DetectedSkill[] {
  const results: DetectedSkill[] = [];

  if (!existsSync(dir)) return results;

  try {
    const entries = readdirSync(dir, { withFileTypes: true });
    for (const entry of entries) {
      const fullPath = join(dir, entry.name);

      if (entry.isDirectory()) {
        const skillMd = join(fullPath, 'SKILL.md');
        if (!existsSync(skillMd)) continue;

        const content = readFileSync(skillMd, 'utf-8').slice(0, 500);
        const nm = content.match(/name:\s*(.+)/);
        const dm = content.match(/description:\s*"(.+?)"/);

        results.push({
          name: nm?.[1]?.trim() || entry.name,
          source,
          path: fullPath,
          categories: inferCategories(entry.name + ' ' + content, content),
          description: dm?.[1] || `Skill（来自 ${label}）`,
        });
      } else if (entry.name.endsWith('.md') && entry.name !== 'README.md') {
        const content = readFileSync(fullPath, 'utf-8').slice(0, 300);
        if (!content.startsWith('---')) continue;

        const nm = content.match(/name:\s*(.+)/);
        const dm = content.match(/description:\s*"(.+?)"/);

        results.push({
          name: nm?.[1]?.trim() || entry.name.replace(/\.md$/, ''),
          source: 'self-made',
          path: fullPath,
          categories: inferCategories(entry.name + ' ' + content, content),
          description: dm?.[1] || `Skill 文件（来自 ${label}）`,
        });
      }
    }
  } catch (error) {
    console.error(`扫描目录失败: ${dir}`, error);
  }

  return results;
}

// ── 匹配知识库 ──

function matchKnowledgeBase(skills: DetectedSkill[], db: SkillDB): void {
  for (const skill of skills) {
    const match = db.skills.find(s =>
      s.id === skill.name || s.name === skill.name
    );
    if (match) skill.knownId = match.id;
  }
}

// ── 主扫描函数 ──

export function scanUserSkills(
  db: SkillDB,
  config?: SkillCompassConfig
): DetectedSkill[] {
  const results: DetectedSkill[] = [];
  const home = homedir();

  // 1. WorkBuddy installed skills
  const wbDir = join(home, '.workbuddy', 'skills');
  if (existsSync(wbDir)) {
    const wbSkills = scanDirectory(wbDir, 'WorkBuddy', 'workbuddy', db);
    results.push(...wbSkills);
  }

  // 2. Self-made skills
  const cwd = process.cwd();
  const defaultScanDirs = [
    { dir: join(cwd, 'skills'), label: '当前项目 skills/' },
    { dir: join(cwd, '.agents'), label: '当前项目 .agents/' },
    { dir: join(home, '.agents'), label: '~/.agents' },
  ];

  const scanDirs = config?.scanDirs
    ? config.scanDirs.map(dir => ({ dir, label: dir }))
    : defaultScanDirs;

  const excludeDirs = new Set(config?.excludeDirs || []);
  const seenPaths = new Set<string>();

  for (const { dir, label } of scanDirs) {
    if (excludeDirs.has(dir) || seenPaths.has(dir)) continue;
    seenPaths.add(dir);

    const dirSkills = scanDirectory(dir, label, 'self-made', db);
    results.push(...dirSkills);
  }

  // 3. Match against knowledge base
  matchKnowledgeBase(results, db);

  return results;
}
