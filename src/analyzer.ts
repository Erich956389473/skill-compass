import type { DetectedSkill, CoverageAnalysis, ScenarioMatch, SkillDB, SkillCompassConfig } from './types.js';
import { categoryLabels, scenarioMatches } from './types.js';

// ── 覆盖分析 ──

export function analyzeCoverage(
  skills: DetectedSkill[],
  db: SkillDB,
  config?: SkillCompassConfig
): CoverageAnalysis {
  const covered = new Set<string>();
  const details: Record<string, { name: string; description: string }[]> = {};

  for (const skill of skills) {
    for (const cat of skill.categories) {
      covered.add(cat);
      if (!details[cat]) details[cat] = [];
      details[cat].push({ name: skill.name, description: skill.description });
    }
  }

  const allCats = Object.keys(categoryLabels);
  const coveredCats = [...covered].filter(c => allCats.includes(c));
  const missingCats = allCats.filter(c => !covered.has(c));

  // 场景匹配
  const scenarioResults: ScenarioMatch[] = scenarioMatches.map(s => {
    const has = s.needs.filter(n => covered.has(n));
    const miss = s.needs.filter(n => !covered.has(n));
    const coverage = s.needs.length > 0 ? Math.round((has.length / s.needs.length) * 100) : 0;
    return { ...s, covered: has, missing: miss, coverage };
  });

  return { coveredCats, missingCats, details, scenarioResults };
}

// ── 生成扫描报告 ──

export function generateScanReport(
  skills: DetectedSkill[],
  analysis: CoverageAnalysis,
  db: SkillDB
): string {
  const lines: string[] = [];
  lines.push('# Skill 环境扫描报告\n');
  lines.push(`找到 ${skills.length} 个 Skill\n`);

  // 按来源分类
  lines.push('## 按来源分类\n');
  for (const source of ['workbuddy', 'self-made'] as const) {
    const group = skills.filter(s => s.source === source);
    if (group.length === 0) continue;
    const label = source === 'workbuddy' ? 'WorkBuddy 已安装' : '自建项目';
    lines.push(`### ${label}（${group.length} 个）`);
    for (const s of group) {
      const known = s.knownId ? ` ✅ 已知（${s.knownId}）` : '';
      lines.push(`- **${s.name}**${known} — ${s.description}`);
    }
    lines.push('');
  }

  // 能力覆盖
  lines.push('## 能力覆盖\n');
  lines.push(`已覆盖：${analysis.coveredCats.map(c => categoryLabels[c] || c).join('、') || '无'}`);
  if (analysis.missingCats.length > 0) {
    lines.push(`未覆盖：${analysis.missingCats.map(c => categoryLabels[c] || c).join('、')}`);
  }
  lines.push('');

  // 按分类详情
  lines.push('## 按分类详情\n');
  for (const cat of analysis.coveredCats) {
    const label = categoryLabels[cat] || cat;
    const items = analysis.details[cat]?.map(d => d.name).join('、') || '-';
    lines.push(`- **${label}**：${items}`);
  }
  for (const cat of analysis.missingCats) {
    lines.push(`- **${categoryLabels[cat] || cat}**：⚠️ 无覆盖`);
  }
  lines.push('');

  // 场景匹配度
  lines.push('## 场景匹配度\n');
  for (const sc of analysis.scenarioResults) {
    const icon = sc.coverage >= 75 ? '✅' : sc.coverage >= 40 ? '🟡' : '❌';
    lines.push(`${icon} **${sc.label}**：${sc.coverage}% 覆盖`);
    if (sc.missing.length > 0) {
      lines.push(`   缺：${sc.missing.map(c => categoryLabels[c] || c).join('、')}`);
    }
  }
  lines.push('');
  lines.push('---\n运行 `suggest_additions` 查看推荐补充的 Skill。');

  return lines.join('\n');
}

// ── 生成建议报告 ──

export function generateSuggestionReport(
  goal: string,
  skills: DetectedSkill[],
  analysis: CoverageAnalysis,
  db: SkillDB
): string {
  const lines: string[] = [];
  lines.push('# Skill 补充建议\n');

  if (goal) {
    lines.push(`基于目标"${goal}"分析：\n`);
    const tokens = goal.toLowerCase();
    const suggestions = db.skills.filter(s => {
      const allText = (s.name + ' ' + s.description + ' ' + s.bestFor.join(' ')).toLowerCase();
      return tokens.length > 3 && allText.includes(tokens.slice(0, 10));
    });

    if (suggestions.length > 0) {
      for (const s of suggestions.slice(0, 5)) {
        const already = skills.some(sk => sk.knownId === s.id);
        lines.push(`${already ? '✅ 已有' : '📥 推荐'} **${s.name}**：${s.description}`);
        lines.push(`  仓库：${s.repo}`);
      }
    } else {
      lines.push('没有完全匹配目标场景的已知 Skill，以下是从能力缺口角度的建议：\n');
    }
    lines.push('');
  }

  // 基于缺口
  const missingSet = new Set(analysis.missingCats);
  lines.push('## 基于能力缺口的推荐\n');
  if (missingSet.size === 0) {
    lines.push('✅ 你当前的能力覆盖已经很全面了。\n');
  } else {
    for (const cat of missingSet) {
      const label = categoryLabels[cat] || cat;
      const candidates = db.skills.filter(s => s.categories.includes(cat));
      if (candidates.length === 0) continue;
      lines.push(`### ${label}\n`);
      for (const s of candidates.slice(0, 3)) {
        const already = skills.some(sk => sk.knownId === s.id);
        if (!already) {
          lines.push(`- **${s.name}**：${s.description}`);
          lines.push(`  → ${s.repo}`);
        }
      }
      lines.push('');
    }
  }

  return lines.join('\n');
}

// ── 生成知识库列表 ──

export function generateKnowledgeBaseList(
  category: string,
  db: SkillDB
): string {
  let filtered = db.skills;
  if (category) filtered = filtered.filter(s => s.categories.includes(category));

  const lines: string[] = [`# 已知 Skill 列表（共 ${filtered.length} 个）\n`];
  for (const s of filtered) {
    lines.push(`**${s.name}** — ${s.description}`);
    lines.push(`  分类：${s.categories.map(c => categoryLabels[c] || c).join('、')}`);
    lines.push(`  ${s.repo}`);
    lines.push('');
  }

  return lines.join('\n');
}
