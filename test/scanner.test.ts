import { inferCategories } from '../src/scanner.js';

console.log('=== Scanner 测试 ===\n');

// 测试 1: inferCategories 基本功能
console.log('测试 1: inferCategories 基本功能');
const result1 = inferCategories('frontend-design', 'UI/UX design for web applications');
console.assert(result1.includes('aesthetic'), '应包含 aesthetic');
console.log(result1.includes('aesthetic') ? '✓ PASS' : '✗ FAIL');

// 测试 2: inferCategories 多分类
console.log('\n测试 2: inferCategories 多分类');
const result2 = inferCategories('accessibility-checker', 'Check a11y compliance');
console.assert(result2.includes('a11y'), '应包含 a11y');
console.log(result2.includes('a11y') ? '✓ PASS' : '✗ FAIL');

// 测试 3: inferCategories 中文关键词
console.log('\n测试 3: inferCategories 中文关键词');
const result3 = inferCategories('产品管理工具', '竞品分析和用户画像');
console.assert(result3.includes('pm-tools'), '应包含 pm-tools');
console.log(result3.includes('pm-tools') ? '✓ PASS' : '✗ FAIL');

// 测试 4: inferCategories 默认分类
console.log('\n测试 4: inferCategories 默认分类');
const result4 = inferCategories('random-tool', 'Some random tool');
console.assert(result4.includes('infrastructure'), '应包含 infrastructure');
console.log(result4.includes('infrastructure') ? '✓ PASS' : '✗ FAIL');

// 测试 5: inferCategories 多个关键词匹配
console.log('\n测试 5: inferCategories 多个关键词匹配');
const result5 = inferCategories('video-editor', 'Video editing and content creation');
console.assert(result5.includes('content'), '应包含 content');
console.log(result5.includes('content') ? '✓ PASS' : '✗ FAIL');

console.log('\n=== Scanner 测试完成 ===\n');
