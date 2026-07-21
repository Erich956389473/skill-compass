import { Server } from '@modelcontextprotocol/sdk/server/index.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import { CallToolRequestSchema, ListToolsRequestSchema } from '@modelcontextprotocol/sdk/types.js';
import { readFileSync, existsSync, readdirSync, statSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import { homedir } from 'os';

// ── Skill knowledge base ──
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

function findDb(): string {
  const candidates = [
    join(__dirname, '..', 'skills-index.json'),
    join(__dirname, '..', '..', 'skills-index.json'),
  ];
  for (const c of candidates) if (existsSync(c)) return c;
  return candidates[0];
}

interface SkillEntry {
  id: string; name: string; description: string; categories: string[];
  bestFor: string[]; notFor: string[]; platform: string; repo: string;
  strength: string; weakness: string;
}

interface SkillDB { version: string; categories: Record<string, string>; skills: SkillEntry[]; }
const db: SkillDB = existsSync(findDb())
  ? JSON.parse(readFileSync(findDb(), 'utf-8')) : { version: '0', categories: {}, skills: [] };

const categoryLabels: Record<string, string> = {
  aesthetic: '审美与视觉', a11y: '可访问性', responsive: '响应式', interaction: '交互',
  'code-quality': '代码质量', 'pm-tools': '产品管理', content: '内容创作',
  'data-analysis': '数据分析', infrastructure: '基础设施', knowledge: '知识管理',
  application: '应用层', security: '安全',
};

// ── Scanner ──

interface DetectedSkill {
  name: string;
  source: 'workbuddy' | 'self-made' | 'git-repo';
  path: string;
  knownId?: string;         // Matched ID in knowledge base
  categories: string[];
  description: string;
}

function scanUserSkills(): DetectedSkill[] {
  const results: DetectedSkill[] = [];
  const home = homedir();

  // 1. WorkBuddy installed skills
  const wbDir = join(home, '.workbuddy', 'skills');
  if (existsSync(wbDir)) {
    for (const entry of readdirSync(wbDir, { withFileTypes: true })) {
      if (!entry.isDirectory()) continue;
      const skillDir = join(wbDir, entry.name);
      const skillMd = join(skillDir, 'SKILL.md');
      let description = '';
      if (existsSync(skillMd)) {
        const content = readFileSync(skillMd, 'utf-8').slice(0, 500);
        const descMatch = content.match(/description:\s*"(.+?)"/);
        if (descMatch) description = descMatch[1];
      }
      results.push({
        name: entry.name,
        source: 'workbuddy',
        path: skillDir,
        categories: inferCategories(entry.name, description),
        description: description || 'WorkBuddy 内置 Skill',
      });
    }
  }

  // 2. Self-made skills in current workspace — scan current directory and ~/.agents
  const cwd = process.cwd();
  const scanDirs: { dir: string; label: string }[] = [
    { dir: join(cwd, 'skills'), label: '当前项目 skills/' },
    { dir: join(cwd, '.agents'), label: '当前项目 .agents/' },
    { dir: join(home, '.agents'), label: '~/.agents' },
  ];

  const seenPaths = new Set<string>();
  for (const { dir, label } of scanDirs) {
    if (!existsSync(dir) || seenPaths.has(dir)) continue;
    seenPaths.add(dir);
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
            source: 'self-made',
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
    } catch {}
  }

  // 3. Match against knowledge base
  for (const skill of results) {
    const match = db.skills.find(s =>
      s.id === skill.name || s.name === skill.name
    );
    if (match) skill.knownId = match.id;
  }

  return results;
}

const catKeywords: [string, string[]][] = [
  ['aesthetic', ['审美', '设计', '视觉', '样式', 'css', 'ui', '前端', 'landing', 'hallmark']],
  ['a11y', ['无障碍', '可访问', 'a11y', 'accessibility', 'alt']],
  ['responsive', ['响应式', '移动', '手机', 'responsive']],
  ['interaction', ['交互', 'hover', '点击', '按钮', '表单']],
  ['code-quality', ['代码', '质量', '审查', 'review', 'graph']],
  ['pm-tools', ['产品', '管理', 'pm', '竞品', '分析', '路线图', 'roadmap', '用户画像', '优先级']],
  ['content', ['内容', '创作', '编辑', '视频', '写作', '剪辑', 'archify', 'video']],
  ['data-analysis', ['数据', '分析', '指标', 'sql', '报表']],
  ['infrastructure', ['联网', '搜索', 'office', '文档', '模型', '网关', 'wigolo', 'omniroute']],
  ['knowledge', ['知识', '学习', '记忆', '蒸馏', 'cangjie']],
  ['application', ['求职', '视频', '剪辑', '自动化']],
  ['security', ['安全', '防护', '权限']],
];

function inferCategories(name: string, description: string): string[] {
  const combined = (name + ' ' + description).toLowerCase();
  const cats: string[] = [];
  for (const [cat, keywords] of catKeywords) {
    if (keywords.some(k => combined.includes(k.toLowerCase()))) cats.push(cat);
  }
  return cats.length > 0 ? cats : ['infrastructure'];
}

// ── Coverage analysis ──

function analyzeCoverage(skills: DetectedSkill[]) {
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

  // Scenario matching
  const scenarioMatches = [
    { id: 'frontend-ui', label: '前端页面生成', needs: ['aesthetic', 'a11y', 'responsive', 'interaction'] },
    { id: 'pm-work', label: '产品管理工作', needs: ['pm-tools'] },
    { id: 'data-analysis', label: '数据分析', needs: ['data-analysis'] },
    { id: 'content-creation', label: '内容创作', needs: ['content', 'knowledge'] },
  ];

  const scenarioResults = scenarioMatches.map(s => {
    const has = s.needs.filter(n => covered.has(n));
    const miss = s.needs.filter(n => !covered.has(n));
    const coverage = s.needs.length > 0 ? Math.round((has.length / s.needs.length) * 100) : 0;
    return { ...s, covered: has, missing: miss, coverage };
  });

  return { coveredCats, missingCats, details, scenarioResults };
}

// ── MCP Server ──

const server = new Server(
  { name: 'skill-compass-mcp', version: '0.1.0' },
  { capabilities: { tools: {} } }
);

server.setRequestHandler(ListToolsRequestSchema, async () => ({
  tools: [
    {
      name: 'scan_skills',
      description: '自动扫描你系统里已经安装的所有 Agent Skill（WorkBuddy、自建项目、GitHub 仓库），然后分析覆盖情况和缺口。',
      inputSchema: { type: 'object', properties: {} },
    },
    {
      name: 'suggest_additions',
      description: '基于你已有的 Skill 和你想做的事，推荐补充哪些 Skill。',
      inputSchema: {
        type: 'object',
        properties: {
          goal: { type: 'string', description: '你想做的事，比如"做前端页面"、"分析竞品"、"做数据分析"、留空则基于当前缺口推荐' },
        },
      },
    },
    {
      name: 'list_known',
      description: '查看当前 Skill 知识库中收录的已知 Skill（用于参考）。',
      inputSchema: {
        type: 'object',
        properties: {
          category: { type: 'string', description: '按分类筛选（可选）' },
        },
      },
    },
  ],
}));

server.setRequestHandler(CallToolRequestSchema, async (request) => {
  const { name: toolName, arguments: args } = request.params;

  switch (toolName) {
    case 'scan_skills': {
      const skills = scanUserSkills();
      const analysis = analyzeCoverage(skills);

      const lines: string[] = [];
      lines.push('# Skill 环境扫描报告\n');
      lines.push(`找到 ${skills.length} 个 Skill\n`);

      // Group by source
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

      // Category coverage
      lines.push('## 能力覆盖\n');
      lines.push(`已覆盖：${analysis.coveredCats.map(c => categoryLabels[c] || c).join('、') || '无'}`);
      if (analysis.missingCats.length > 0) {
        lines.push(`未覆盖：${analysis.missingCats.map(c => categoryLabels[c] || c).join('、')}`);
      }
      lines.push('');

      // Per-category detail
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

      // Scenario analysis
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

      return { content: [{ type: 'text', text: lines.join('\n') }] };
    }

    case 'suggest_additions': {
      const goal = (args?.goal as string) || '';
      const skills = scanUserSkills();
      const analysis = analyzeCoverage(skills);
      const coveredCats = new Set(analysis.coveredCats);

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

      // Based on gaps
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

      return { content: [{ type: 'text', text: lines.join('\n') }] };
    }

    case 'list_known': {
      const category = (args?.category as string) || '';
      let filtered = db.skills;
      if (category) filtered = filtered.filter(s => s.categories.includes(category));

      const lines: string[] = [`# 已知 Skill 列表（共 ${filtered.length} 个）\n`];
      for (const s of filtered) {
        lines.push(`**${s.name}** — ${s.description}`);
        lines.push(`  分类：${s.categories.map(c => categoryLabels[c] || c).join('、')}`);
        lines.push(`  ${s.repo}`);
        lines.push('');
      }
      return { content: [{ type: 'text', text: lines.join('\n') }] };
    }

    default:
      throw new Error(`Unknown tool: ${toolName}`);
  }
});

async function main() {
  const transport = new StdioServerTransport();
  await server.connect(transport);
  console.error(`Skill Compass MCP Server running (${db.skills.length} skills in KB)`);
}

main().catch((err) => {
  console.error('Fatal:', err);
  process.exit(1);
});
