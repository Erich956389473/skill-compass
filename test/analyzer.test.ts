import { analyzeCoverage, generateScanReport, generateSuggestionReport } from '../src/analyzer.js';
import type { DetectedSkill, SkillDB } from '../src/types.js';

console.log('=== Analyzer 测试 ===\n');

// 测试数据
const mockSkills: DetectedSkill[] = [
  {
    name: 'fe-inspector',
    source: 'workbuddy',
    path: '/test/fe-inspector',
    categories: ['aesthetic', 'a11y', 'responsive', 'interaction'],
    description: '前端质量检测',
  },
  {
    name: 'pm-tool',
    source: 'self-made',
    path: '/test/pm-tool',
    categories: ['pm-tools'],
    description: '产品管理工具',
  },
];

const mockDB: SkillDB = {
  version: '1.0',
  categories: {},
  skills: [],
};

// 测试 1: analyzeCoverage 基本功能
console.log('测试 1: analyzeCoverage 基本功能');
const analysis1 = analyzeCoverage(mockSkills, mockDB);
console.assert(analysis1.coveredCats.length > 0, '应有覆盖的分类');
console.assert(analysis1.missingCats.length > 0, '应有缺失的分类');
console.log(analysis1.coveredCats.length > 0 && analysis1.missingCats.length > 0 ? '✓ PASS' : '✗ FAIL');

// 测试 2: analyzeCoverage 覆盖分类正确
console.log('\n测试 2: analyzeCoverage 覆盖分类正确');
const hasAesthetic = analysis1.coveredCats.includes('aesthetic');
const hasPmTools = analysis1.coveredCats.includes('pm-tools');
console.assert(hasAesthetic, '应包含 aesthetic');
console.assert(hasPmTools, '应包含 pm-tools');
console.log(hasAesthetic && hasPmTools ? '✓ PASS' : '✗ FAIL');

// 测试 3: analyzeCoverage 场景匹配
console.log('\n测试 3: analyzeCoverage 场景匹配');
const frontendScenario = analysis1.scenarioResults.find(s => s.id === 'frontend-ui');
console.assert(frontendScenario, '应有前端场景');
console.assert(frontendScenario.coverage === 100, '前端场景应100%覆盖');
console.log(frontendScenario && frontendScenario.coverage === 100 ? '✓ PASS' : '✗ FAIL');

// 测试 4: generateScanReport 基本功能
console.log('\n测试 4: generateScanReport 基本功能');
const report1 = generateScanReport(mockSkills, analysis1, mockDB);
console.assert(report1.includes('Skill 环境扫描报告'), '应包含标题');
console.assert(report1.includes('fe-inspector'), '应包含 skill 名称');
console.log(report1.includes('Skill 环境扫描报告') && report1.includes('fe-inspector') ? '✓ PASS' : '✗ FAIL');

// 测试 5: generateSuggestionReport 基本功能
console.log('\n测试 5: generateSuggestionReport 基本功能');
const report2 = generateSuggestionReport('做前端页面', mockSkills, analysis1, mockDB);
console.assert(report2.includes('Skill 补充建议'), '应包含标题');
console.log(report2.includes('Skill 补充建议') ? '✓ PASS' : '✗ FAIL');

console.log('\n=== Analyzer 测试完成 ===\n');
