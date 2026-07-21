// ── Test: Skill Compass MCP ──
// Manually importing the matching logic functions
import { readFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const dbPath = join(__dirname, '..', 'skills-index.json');
const db = JSON.parse(readFileSync(dbPath, 'utf-8'));

// ── Replicate matching logic inline for testing ──

function tokenize(text: string): string[] {
  const tokens: string[] = [];
  const normalized = text.toLowerCase();
  const delimiters = /[，。！？、；：""''（）【】《》\s,.;:!?()\[\]{}"'/\\|·]+/;
  const parts = normalized.split(delimiters).filter(Boolean);
  for (const part of parts) {
    if (/[a-z]/.test(part)) {
      tokens.push(part);
      tokens.push(...part.split(/(?=[A-Z])/).filter(Boolean));
    }
    const chars = [...part];
    for (let i = 0; i < chars.length - 1; i++) {
      tokens.push(chars.slice(i, i + 2).join(''));
      if (i < chars.length - 2) {
        tokens.push(chars.slice(i, i + 3).join(''));
      }
    }
    for (const ch of chars) {
      if (/[\u4e00-\u9fff]/.test(ch)) tokens.push(ch);
    }
  }
  return [...new Set(tokens)].filter(Boolean);
}

const categoryKeywords: Record<string, string[]> = {
  aesthetic: ['审美', '设计', '好看', '视觉', '样式', 'css', 'ui', 'frontend', '前端', '页面', 'landing'],
  a11y: ['无障碍', '可访问', 'a11y', 'accessibility'],
  responsive: ['响应式', '移动', '手机', 'responsive', 'mobile'],
  interaction: ['交互', 'hover', '点击', '按钮', '表单', 'form'],
  'code-quality': ['代码', '质量', '审查', 'review'],
  'pm-tools': ['产品', '管理', 'pm', '竞品', '分析', '路线图', 'roadmap'],
  content: ['内容', '创作', '编辑', '文章', '视频', '写作'],
  infrastructure: ['基础设施', '联网', '搜索', 'office', '文档', '模型', '网关'],
  knowledge: ['知识', '学习', '记忆'],
  application: ['求职', '视频', '剪辑'],
  security: ['安全', '防护'],
};

function matchSkill(input: string, skill: any): number {
  const tokens = tokenize(input);
  let score = 0;
  for (const best of skill.bestFor) {
    const bestTokens = tokenize(best);
    for (const t of tokens) {
      if (bestTokens.some((bt: string) => bt.includes(t) || t.includes(bt))) score += 10;
    }
  }
  for (const cat of skill.categories) {
    const catTokens = categoryKeywords[cat] || [];
    for (const t of tokens) {
      if (catTokens.some((ct: string) => ct.includes(t) || t.includes(ct))) score += 5;
    }
  }
  for (const not of skill.notFor) {
    const notTokens = tokenize(not);
    for (const t of tokens) {
      if (notTokens.some((nt: string) => nt.includes(t) || t.includes(nt))) score -= 20;
    }
  }
  return Math.max(0, score);
}

// ── Test 1: 前端页面场景匹配 ──
const frontendScores = db.skills
  .map((s: any) => ({ name: s.name, score: matchSkill('生成一个SaaS着陆页', s) }))
  .filter((s: any) => s.score > 0)
  .sort((a: any, b: any) => b.score - a.score);

console.log('Test 1: 前端页面场景');
console.assert(frontendScores.length >= 2, 'Should match at least 2 skills for frontend');
console.log(frontendScores.length >= 2 ? `✓ 匹配到 ${frontendScores.length} 个 Skill` : `✗ 只有 ${frontendScores.length} 个`);

// hallmark or fe-inspector should rank high
const topName = frontendScores[0]?.name || '';
console.assert(topName === 'FE Inspector' || topName === 'hallmark' || frontendScores.some((s: any) => s.name === 'FE Inspector' || s.name === 'hallmark'),
  'FE Inspector or hallmark should be in top matches');
console.log(topName ? `✓ Top 1: ${topName}（${frontendScores[0].score}分）` : '✗');

// ── Test 2: PM场景匹配 ──
const pmScores = db.skills
  .map((s: any) => ({ name: s.name, score: matchSkill('做竞品分析和用户画像', s) }))
  .filter((s: any) => s.score > 0)
  .sort((a: any, b: any) => b.score - a.score);
console.log('\nTest 2: PM场景');
console.assert(pmScores.some((s: any) => s.name.includes('PM')), 'PM skills should match');
console.log(pmScores.some((s: any) => s.name.includes('PM')) ? '✓ PM技能匹配成功' : '✗');
console.log(`  Top: ${pmScores.slice(0, 3).map((s: any) => s.name).join('、')}`);

// ── Test 3: 不适用场景排除 ──
const excludeScores = db.skills
  .map((s: any) => ({ name: s.name, score: matchSkill('纯后端项目, 不生成页面', s) }))
  .filter((s: any) => s.score > 0);
console.log('\nTest 3: 不适用场景排除');
// fe-inspector and hallmark should be excluded or low
const feScore = excludeScores.find((s: any) => s.name === 'FE Inspector');
console.log(!feScore ? '✓ FE Inspector 被排除（后端项目不适用）' : `✗ FE Inspector 得分 ${feScore?.score}`);
console.log(`  ${excludeScores.length} 个 Skill 匹配`);

// ── Test 4: 内容创作场景 ──
const contentScores = db.skills
  .map((s: any) => ({ name: s.name, score: matchSkill('把一本书变成AgentSkill', s) }))
  .filter((s: any) => s.score > 0)
  .sort((a: any, b: any) => b.score - a.score);
console.log('\nTest 4: 内容创作场景');
console.assert(contentScores.some((s: any) => s.name.includes('仓颉')), 'cangjie-skill should match for knowledge distillation');
console.log(contentScores.some((s: any) => s.name.includes('仓颉')) ? '✓ 仓颉技能匹配成功' : '✗');

// ── Test 5: 基础设施场景 ──
const infraScores = db.skills
  .map((s: any) => ({ name: s.name, score: matchSkill('给Agent联网搜索能力', s) }))
  .filter((s: any) => s.score > 0)
  .sort((a: any, b: any) => b.score - a.score);
console.log('\nTest 5: 基础设施场景');
console.assert(infraScores.some((s: any) => s.name === 'wigolo'), 'wigolo should match for web search');
console.log(infraScores.some((s: any) => s.name === 'wigolo') ? '✓ wigolo 匹配成功' : '✗');

// ── Test 6: 中文分词兼容 ──
const cnScores = db.skills
  .map((s: any) => ({ name: s.name, score: matchSkill('我需要检查页面设计', s) }))
  .filter((s: any) => s.score > 0)
  .sort((a: any, b: any) => b.score - a.score);
console.log('\nTest 6: 中文兼容');
console.assert(cnScores.some((s: any) => s.name === 'FE Inspector' || s.name === 'hallmark'),
  'Chinese queries should match related skills');
console.log(cnScores.length > 0 ? `✓ 中文匹配成功（${cnScores.length} 个）` : '✗');

// ── Test 7: JSON数据库完整性 ──
console.log('\nTest 7: 数据库完整性');
console.assert(db.skills.length >= 10, 'Should have at least 10 skills');
console.log(`✓ ${db.skills.length} 个 Skill 索引`);
const allFields = db.skills.every((s: any) =>
  s.id && s.name && s.description && s.categories && s.bestFor && s.notFor && s.platform && s.repo
);
console.assert(allFields, 'All skills should have complete fields');
console.log(allFields ? '✓ 所有 Skill 字段完整' : '✗');

console.log('\n===== Skill Compass tests complete =====\n');
