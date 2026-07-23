/**
 * README 文档测试
 * 测试 README 文档的完整性和规范性
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const readmePath = path.join(__dirname, '../README.md');
const readmeContent = fs.readFileSync(readmePath, 'utf-8');

let passed = 0;
let failed = 0;

function assert(condition: boolean, message: string) {
  if (condition) {
    passed++;
  } else {
    failed++;
    console.error(`  ❌ FAIL: ${message}`);
  }
}

console.log('\n===== README 文档测试 =====\n');

// 文档结构
console.log('文档结构:');
assert(readmeContent.includes('# Skill Compass'), '应该包含标题');
assert(readmeContent.includes('不用你报，它自己扫。'), '应该包含项目描述');
assert(readmeContent.includes('## ✨ 功能特性'), '应该包含功能特性章节');
assert(readmeContent.includes('## 🚀 快速开始'), '应该包含快速开始章节');
assert(readmeContent.includes('## 📖 工具列表'), '应该包含工具列表章节');
assert(readmeContent.includes('## 🎯 使用场景'), '应该包含使用场景章节');
assert(readmeContent.includes('## 📦 技术栈'), '应该包含技术栈章节');
assert(readmeContent.includes('## 📄 License'), '应该包含 License 章节');

// 功能特性
console.log('功能特性:');
assert(readmeContent.includes('自动扫描'), '应该列出自动扫描功能');
assert(readmeContent.includes('12 维分析'), '应该列出 12 维分析功能');
assert(readmeContent.includes('缺口检测'), '应该列出缺口检测功能');
assert(readmeContent.includes('智能推荐'), '应该列出智能推荐功能');

// 快速开始
console.log('快速开始:');
assert(readmeContent.includes('### 安装'), '应该包含安装说明');
assert(readmeContent.includes('npm install -g skill-compass-mcp'), '应该包含 npm 安装命令');
assert(readmeContent.includes('npx skill-compass-mcp'), '应该包含 npx 运行命令');
assert(readmeContent.includes('### MCP 配置'), '应该包含 MCP 配置说明');

// 工具列表
console.log('工具列表:');
assert(readmeContent.includes('scan_skills'), '应该列出 scan_skills 工具');
assert(readmeContent.includes('suggest_additions'), '应该列出 suggest_additions 工具');
assert(readmeContent.includes('list_known'), '应该列出 list_known 工具');
assert(readmeContent.includes('clear_cache'), '应该列出 clear_cache 工具');
assert(readmeContent.includes('export_report'), '应该列出 export_report 工具');

// 项目结构（验证与实际代码一致）
console.log('项目结构:');
assert(readmeContent.includes('scanner.ts'), '应该包含 scanner.ts');
assert(readmeContent.includes('analyzer.ts'), '应该包含 analyzer.ts');
assert(readmeContent.includes('cache.ts'), '应该包含 cache.ts');
assert(readmeContent.includes('exporter.ts'), '应该包含 exporter.ts');
assert(readmeContent.includes('server.ts'), '应该包含 server.ts');
assert(readmeContent.includes('types.ts'), '应该包含 types.ts');
assert(!readmeContent.includes('recommender.ts'), '不应该包含不存在的 recommender.ts');
assert(!readmeContent.includes('i18n/'), '不应该包含不存在的 i18n/ 目录');

// 技术栈（验证准确性）
console.log('技术栈:');
assert(readmeContent.includes('TypeScript'), '应该列出 TypeScript');
assert(readmeContent.includes('MCP'), '应该列出 MCP');
assert(readmeContent.includes('tsc'), '应该列出 tsc 构建工具');
assert(!readmeContent.includes('tsup'), '不应该包含不存在的 tsup');
assert(!readmeContent.includes('Jest'), '不应该包含不存在的 Jest');

// 配置命令（验证正确性）
console.log('配置命令:');
assert(readmeContent.includes('"command": "skill-compass"'), 'Claude Code 配置应使用正确的命令名');

// 乱码检测
console.log('乱码检测:');
const chineseRegex = /[一-鿿]/;
assert(chineseRegex.test(readmeContent), '应该包含中文字符');
assert(!readmeContent.includes('�'), '不应该包含替换字符');

// 输出结果
console.log(`\n===== 测试结果: ${passed} 通过, ${failed} 失败 =====\n`);

if (failed > 0) {
  process.exit(1);
}
