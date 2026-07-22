import { writeFileSync } from 'fs';
import type { DetectedSkill, CoverageAnalysis, ExportOptions, SkillDB } from './types.js';
import { generateScanReport, generateSuggestionReport, generateKnowledgeBaseList } from './analyzer.js';

// ── 导出为 JSON ──

function exportToJson(
  skills: DetectedSkill[],
  analysis: CoverageAnalysis,
  db: SkillDB,
  outputPath?: string
): string {
  const data = {
    timestamp: new Date().toISOString(),
    summary: {
      totalSkills: skills.length,
      bySource: {
        workbuddy: skills.filter(s => s.source === 'workbuddy').length,
        selfMade: skills.filter(s => s.source === 'self-made').length,
      },
      coverage: {
        coveredCategories: analysis.coveredCats.length,
        missingCategories: analysis.missingCats.length,
        totalCategories: analysis.coveredCats.length + analysis.missingCats.length,
      },
    },
    skills,
    analysis,
  };

  const json = JSON.stringify(data, null, 2);

  if (outputPath) {
    writeFileSync(outputPath, json, 'utf-8');
  }

  return json;
}

// ── 导出为 Markdown ──

function exportToMarkdown(
  skills: DetectedSkill[],
  analysis: CoverageAnalysis,
  db: SkillDB,
  outputPath?: string
): string {
  const report = generateScanReport(skills, analysis, db);

  if (outputPath) {
    writeFileSync(outputPath, report, 'utf-8');
  }

  return report;
}

// ── 导出为文本 ──

function exportToText(
  skills: DetectedSkill[],
  analysis: CoverageAnalysis,
  db: SkillDB,
  outputPath?: string
): string {
  // 移除 Markdown 格式，保留纯文本
  const report = generateScanReport(skills, analysis, db);
  const text = report
    .replace(/#{1,6}\s/g, '')
    .replace(/\*\*/g, '')
    .replace(/- /g, '• ')
    .replace(/\n{3,}/g, '\n\n');

  if (outputPath) {
    writeFileSync(outputPath, text, 'utf-8');
  }

  return text;
}

// ── 主导出函数 ──

export function exportReport(
  skills: DetectedSkill[],
  analysis: CoverageAnalysis,
  db: SkillDB,
  options: ExportOptions
): string {
  const { format, outputPath } = options;

  switch (format) {
    case 'json':
      return exportToJson(skills, analysis, db, outputPath);
    case 'markdown':
      return exportToMarkdown(skills, analysis, db, outputPath);
    case 'text':
      return exportToText(skills, analysis, db, outputPath);
    default:
      throw new Error(`不支持的导出格式: ${format}`);
  }
}

// ── 导出建议 ──

export function exportSuggestions(
  goal: string,
  skills: DetectedSkill[],
  analysis: CoverageAnalysis,
  db: SkillDB,
  options: ExportOptions
): string {
  const report = generateSuggestionReport(goal, skills, analysis, db);

  if (options.outputPath) {
    writeFileSync(options.outputPath, report, 'utf-8');
  }

  return report;
}

// ── 导出知识库列表 ──

export function exportKnowledgeBase(
  category: string,
  db: SkillDB,
  options: ExportOptions
): string {
  const report = generateKnowledgeBaseList(category, db);

  if (options.outputPath) {
    writeFileSync(options.outputPath, report, 'utf-8');
  }

  return report;
}
