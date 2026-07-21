import { Server } from '@modelcontextprotocol/sdk/server/index.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import { CallToolRequestSchema, ListToolsRequestSchema } from '@modelcontextprotocol/sdk/types.js';
import { readFileSync, existsSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
// ── Load skill database ──
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const dbPath = join(__dirname, '..', 'skills-index.json');
const localDbPath = join(__dirname, '..', '..', 'skills-index.json');
let dbPath_ = dbPath;
if (!existsSync(dbPath_))
    dbPath_ = localDbPath;
const db = JSON.parse(readFileSync(dbPath_, 'utf-8'));
const scenarios = [
    {
        id: 'frontend-ui',
        label: '用AI生成前端页面',
        description: '生成HTML/CSS页面时需要质量控制和审美检查',
        combos: [
            { skillId: 'hallmark', reason: '57条审美规则，防AI模板味', phase: 'during' },
            { skillId: 'fe-inspector-mcp', reason: '查可访问性+响应式+交互+审美', phase: 'after' },
            { skillId: 'code-review-graph', reason: '大型项目的代码依赖分析', phase: 'after' },
        ],
        gaps: ['没有专门的AI生成文案/内容质量检查Skill'],
    },
    {
        id: 'pm-market-analysis',
        label: '做产品市场分析',
        description: '竞品分析、市场研究、产品规划',
        combos: [
            { skillId: 'pm-adaptive-skills', reason: '自适应中英文，根据行业选框架', phase: 'during' },
            { skillId: 'pm-skills', reason: '68个技能全生命周期覆盖（海外PM）', phase: 'during' },
            { skillId: 'wigolo', reason: '免费联网搜竞品信息和数据', phase: 'before' },
            { skillId: 'archify', reason: '把分析结果可视化成图', phase: 'after' },
        ],
        gaps: ['没有专门的PM数据分析可视化Skill'],
    },
    {
        id: 'content-creation',
        label: '内容创作与编辑',
        description: '创作、编辑、排版内容',
        combos: [
            { skillId: 'cangjie-skill', reason: '把书/视频/播客蒸馏成可执行技能', phase: 'before' },
            { skillId: 'video-use', reason: '用Agent剪辑视频', phase: 'during' },
            { skillId: 'officecli', reason: '最终产出为docx/pptx格式', phase: 'after' },
        ],
        gaps: ['没有专门的长文写作质量检测Skill'],
    },
    {
        id: 'job-seeking',
        label: '求职与职业发展',
        description: '求职流程自动化',
        combos: [
            { skillId: 'ai-job-search', reason: '搜索→定制简历→面试→跟进', phase: 'during' },
        ],
        gaps: ['没有中国市场的AI求职Skill'],
    },
    {
        id: 'agent-infra',
        label: 'Agent基础设施搭建',
        description: '给Agent扩展能力和安全保障',
        combos: [
            { skillId: 'wigolo', reason: '给Agent免费联网能力', phase: 'before' },
            { skillId: 'omniroute', reason: '多个AI模型统一入口', phase: 'before' },
            { skillId: 'officecli', reason: '让Agent操作Office文档', phase: 'during' },
            { skillId: 'destructive-command-guard', reason: '禁止危险shell命令', phase: 'during' },
            { skillId: 'cognee', reason: 'Agent跨会话长期记忆', phase: 'during' },
        ],
        gaps: ['没有专门的多Agent协作编排工具'],
    },
];
// ── Matching logic ──
/** Split text into searchable tokens.
 *  - English: split by whitespace
 *  - Chinese: split by common delimiters, then extract meaningful 2-char segments
 */
function tokenize(text) {
    const tokens = [];
    const normalized = text.toLowerCase();
    // Split by common Chinese delimiters
    const delimiters = /[，。！？、；：""''（）【】《》\s,.;:!?()\[\]{}"'/\\|·]+/;
    const parts = normalized.split(delimiters).filter(Boolean);
    for (const part of parts) {
        if (/[a-z]/.test(part)) {
            // English words - keep as is
            tokens.push(part);
            // Also split camelCase
            tokens.push(...part.split(/(?=[A-Z])/).filter(Boolean));
        }
        // Chinese: extract all 2-char and 3-char n-grams
        const chars = [...part];
        for (let i = 0; i < chars.length - 1; i++) {
            tokens.push(chars.slice(i, i + 2).join(''));
            if (i < chars.length - 2) {
                tokens.push(chars.slice(i, i + 3).join(''));
            }
        }
        // Also keep single meaningful Chinese chars
        for (const ch of chars) {
            if (/[\u4e00-\u9fff]/.test(ch)) {
                tokens.push(ch);
            }
        }
    }
    return [...new Set(tokens)].filter(Boolean);
}
const categoryKeywords = {
    aesthetic: ['审美', '设计', '好看', '视觉', '样式', 'css', 'ui', 'frontend', '前端', '页面', 'landing', 'landing page'],
    a11y: ['无障碍', '可访问', 'a11y', 'accessibility', 'alt', '标签'],
    responsive: ['响应式', '移动', '手机', 'responsive', 'mobile', '屏幕'],
    interaction: ['交互', 'hover', '点击', '按钮', '表单', 'form', 'button', '交互动效'],
    'code-quality': ['代码', '质量', '审查', 'review', 'refactor', '重构', '依赖'],
    'pm-tools': ['产品', '管理', 'pm', '竞品', '分析', '路线图', 'roadmap', '需求', '优先级'],
    content: ['内容', '创作', '编辑', '写', '文章', '视频', '剪辑', '写作'],
    'data-analysis': ['数据', '分析', '指标', 'sql', '报表', '统计'],
    infrastructure: ['基础设施', '工具', '网关', '模型', '部署', '联网', '搜索', 'office', '文档'],
    knowledge: ['知识', '学习', '记忆', '蒸馏', '笔记'],
    application: ['应用', '求职', '视频', '剪辑', '自动化'],
    security: ['安全', '防护', '权限', '合规'],
};
function matchSkill(input, skill) {
    const tokens = tokenize(input);
    let score = 0;
    // Check bestFor
    for (const best of skill.bestFor) {
        const bestTokens = tokenize(best);
        for (const t of tokens) {
            if (bestTokens.some(bt => bt.includes(t) || t.includes(bt))) {
                score += 10;
            }
        }
    }
    // Check categories
    for (const cat of skill.categories) {
        const catTokens = categoryKeywords[cat] || [];
        for (const t of tokens) {
            if (catTokens.some(ct => ct.includes(t) || t.includes(ct))) {
                score += 5;
            }
        }
    }
    // Check description
    const descTokens = tokenize(skill.description);
    for (const t of tokens) {
        if (descTokens.some(dt => dt.includes(t) || t.includes(dt))) {
            score += 3;
        }
    }
    // Penalize notFor matches
    for (const not of skill.notFor) {
        const notTokens = tokenize(not);
        for (const t of tokens) {
            if (notTokens.some(nt => nt.includes(t) || t.includes(nt))) {
                score -= 20;
            }
        }
    }
    return Math.max(0, score);
}
function matchScenario(input) {
    const tokens = tokenize(input);
    const scores = scenarios.map(s => {
        const labelTokens = tokenize(s.label);
        const descTokens = tokenize(s.description);
        const comboText = s.combos.map(c => c.reason).join(' ');
        const allText = labelTokens.join(' ') + ' ' + descTokens.join(' ') + ' ' + comboText + ' ' + s.gaps.join(' ');
        let score = 0;
        for (const t of tokens) {
            if (allText.includes(t))
                score += 5;
            if (s.label.includes(t))
                score += 10;
        }
        return { scenario: s, score };
    });
    scores.sort((a, b) => b.score - a.score);
    return scores[0]?.score > 0 ? scores[0].scenario : null;
}
// ── MCP Server ──
const server = new Server({ name: 'skill-compass-mcp', version: '0.1.0' }, { capabilities: { tools: {} } });
server.setRequestHandler(ListToolsRequestSchema, async () => ({
    tools: [
        {
            name: 'find_skills',
            description: '搜索最适合你场景的 Skill。输入你想做的事，返回匹配度最高的 Skill 列表。',
            inputSchema: {
                type: 'object',
                properties: {
                    query: { type: 'string', description: '描述你要做的事情，如"做一个SaaS着陆页"或"分析竞品"等' },
                    limit: { type: 'number', description: '返回数量限制（默认5）', default: 5 },
                },
                required: ['query'],
            },
        },
        {
            name: 'suggest_combo',
            description: '针对一个完整任务，推荐 Skill 组合方案。返回推荐的 Skill、组合方式、以及当前没有 Skill 覆盖的空白。',
            inputSchema: {
                type: 'object',
                properties: {
                    task: { type: 'string', description: '描述你的完整任务，如"我要用Claude Code做一个SaaS产品的着陆页"' },
                },
                required: ['task'],
            },
        },
        {
            name: 'list_skills',
            description: '列出所有 Skill，可按分类筛选。',
            inputSchema: {
                type: 'object',
                properties: {
                    category: {
                        type: 'string',
                        description: '分类筛选（可选）：aesthetic / a11y / pm-tools / content / infrastructure / knowledge / application / security',
                    },
                },
            },
        },
        {
            name: 'identify_gaps',
            description: '分析你的场景中缺少哪些 Skill 覆盖。如果你在做一个事但找不到合适的 Skill，告诉它，返回空白分析。',
            inputSchema: {
                type: 'object',
                properties: {
                    task: { type: 'string', description: '描述你想做的事但没找到合适的 Skill' },
                },
                required: ['task'],
            },
        },
    ],
}));
server.setRequestHandler(CallToolRequestSchema, async (request) => {
    const { name: toolName, arguments: args } = request.params;
    switch (toolName) {
        case 'find_skills': {
            const query = String(args?.query || '');
            const limit = Math.min(Number(args?.limit) || 5, 20);
            const scored = db.skills
                .map(s => ({ skill: s, score: matchSkill(query, s) }))
                .filter(s => s.score > 0)
                .sort((a, b) => b.score - a.score)
                .slice(0, limit);
            if (scored.length === 0) {
                return {
                    content: [{ type: 'text', text: `没有找到匹配 "${query}" 的 Skill。这可能是一个还没有 Skill 覆盖的新场景。建议你描述更具体的任务来试试 suggest_combo 或 identify_gaps。` }],
                };
            }
            const lines = [`# 搜索：${query}\n`, `找到 ${scored.length} 个匹配的 Skill：\n`];
            for (const { skill, score } of scored) {
                lines.push(`## ${skill.name}（匹配度 ${score}）`);
                lines.push(`- ${skill.description}`);
                lines.push(`- 分类：${skill.categories.join('、')}`);
                lines.push(`- 平台：${skill.platform}`);
                lines.push(`- 最适合：${skill.bestFor.slice(0, 2).join('；')}`);
                lines.push(`- 仓库：${skill.repo}`);
                lines.push('');
            }
            return { content: [{ type: 'text', text: lines.join('\n') }] };
        }
        case 'suggest_combo': {
            const task = String(args?.task || '');
            // Check scenarios
            const matchedScenario = matchScenario(task);
            // Also find individual skill matches
            const skills = db.skills
                .map(s => ({ skill: s, score: matchSkill(task, s) }))
                .filter(s => s.score > 10)
                .sort((a, b) => b.score - a.score)
                .slice(0, 10);
            const lines = [`# 任务："${task}"\n`];
            if (matchedScenario) {
                lines.push(`## 推荐方案：${matchedScenario.label}`);
                lines.push(`> ${matchedScenario.description}\n`);
                lines.push('### 推荐的 Skill 组合：');
                lines.push('');
                for (const combo of matchedScenario.combos) {
                    const skill = db.skills.find(s => s.id === combo.skillId);
                    const name = skill?.name || combo.skillId;
                    const phaseIcon = combo.phase === 'before' ? '准备阶段' : combo.phase === 'during' ? '执行阶段' : '检查阶段';
                    lines.push(`- **${name}**（${phaseIcon}）`);
                    lines.push(`  → ${combo.reason}`);
                }
                if (matchedScenario.gaps.length > 0) {
                    lines.push('');
                    lines.push('### 当前没有 Skill 覆盖的空白：');
                    for (const gap of matchedScenario.gaps) {
                        lines.push(`- ⚠️ ${gap}`);
                    }
                }
            }
            else {
                lines.push('没有匹配到预设场景，基于 Skill 数据库分析：\n');
            }
            // Show individual matches that aren't already in the scenario
            if (skills.length > 0) {
                const usedIds = new Set(matchedScenario?.combos.map(c => c.skillId) || []);
                const extras = skills.filter(s => !usedIds.has(s.skill.id));
                if (extras.length > 0) {
                    lines.push('');
                    lines.push('### 其他可能相关的 Skill：');
                    for (const { skill, score } of extras.slice(0, 5)) {
                        lines.push(`- **${skill.name}**（匹配度 ${score}）：${skill.description}`);
                    }
                }
            }
            return { content: [{ type: 'text', text: lines.join('\n') }] };
        }
        case 'list_skills': {
            const category = args?.category;
            let skills = db.skills;
            if (category) {
                skills = skills.filter(s => s.categories.includes(category));
            }
            const lines = [];
            if (category) {
                const catLabel = db.categories[category] || category;
                lines.push(`# Skill 列表：${catLabel}（${skills.length} 个）\n`);
            }
            else {
                lines.push(`# Skill 列表：共 ${skills.length} 个\n`);
            }
            for (const skill of skills) {
                lines.push(`### ${skill.name}`);
                lines.push(`- ${skill.description}`);
                lines.push(`- 平台：${skill.platform}`);
                lines.push(`- 仓库：${skill.repo}`);
                lines.push('');
            }
            return { content: [{ type: 'text', text: lines.join('\n') }] };
        }
        case 'identify_gaps': {
            const task = String(args?.task || '');
            const matchedScenario = matchScenario(task);
            const matchedSkills = db.skills
                .map(s => ({ skill: s, score: matchSkill(task, s) }))
                .filter(s => s.score > 5);
            const lines = [`# 空白分析："${task}"\n`];
            if (matchedSkills.length === 0) {
                lines.push('⚠️ **这个场景目前完全没有 Skill 覆盖。**');
                lines.push('');
                lines.push('这是一个全新的空白领域。如果要开发一个新 Skill 来填补，建议方向：');
                lines.push(`- 基于 "${task}" 的核心需求设计 Skill 功能`);
                lines.push('- 参考 skills-index.json 中类似分类的 Skill 结构');
                lines.push('- 发布后提交 PR 到 Skill Compass 数据库');
            }
            else {
                lines.push('已有部分覆盖的 Skill：');
                for (const { skill, score } of matchedSkills.slice(0, 5)) {
                    lines.push(`- ✅ ${skill.name}（匹配度 ${score}）：${skill.description}`);
                }
                if (matchedScenario?.gaps.length) {
                    lines.push('');
                    lines.push('仍缺少的：');
                    for (const gap of matchedScenario.gaps) {
                        lines.push(`- ⚠️ ${gap}`);
                    }
                }
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
    console.error(`Skill Compass MCP Server running (${db.skills.length} skills indexed)`);
}
main().catch((err) => {
    console.error('Fatal:', err);
    process.exit(1);
});
