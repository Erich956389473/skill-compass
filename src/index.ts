import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import { createServer } from './server.js';

// ── 导出模块（保持向后兼容） ──

export { scanUserSkills, inferCategories } from './scanner.js';
export { analyzeCoverage, generateScanReport, generateSuggestionReport, generateKnowledgeBaseList } from './analyzer.js';
export { readCache, writeCache, clearCache, getScanCache, setScanCache } from './cache.js';
export { exportReport, exportSuggestions, exportKnowledgeBase } from './exporter.js';
export type {
  SkillEntry,
  SkillDB,
  DetectedSkill,
  ScenarioMatch,
  CoverageAnalysis,
  SkillCompassConfig,
  CacheEntry,
  ScanCache,
  ExportOptions,
} from './types.js';
export { categoryLabels, catKeywords, scenarioMatches } from './types.js';

// ── 主函数 ──

async function main() {
  const server = createServer();
  const transport = new StdioServerTransport();
  await server.connect(transport);
  console.error('Skill Compass MCP Server v0.2.0 running');
}

main().catch((err) => {
  console.error('Fatal:', err);
  process.exit(1);
});
