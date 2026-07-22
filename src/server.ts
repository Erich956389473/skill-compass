import { Server } from '@modelcontextprotocol/sdk/server/index.js';
import { CallToolRequestSchema, ListToolsRequestSchema } from '@modelcontextprotocol/sdk/types.js';
import { readFileSync, existsSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';
import type { SkillDB, SkillCompassConfig } from './types.js';
import { scanUserSkills } from './scanner.js';
import { analyzeCoverage, generateScanReport, generateSuggestionReport, generateKnowledgeBaseList } from './analyzer.js';
import { getScanCache, setScanCache, clearCache } from './cache.js';
import { exportReport, exportSuggestions, exportKnowledgeBase } from './exporter.js';

// ── 加载知识库 ──

function loadDatabase(): SkillDB {
  const __filename = fileURLToPath(import.meta.url);
  const __dirname = dirname(__filename);

  const candidates = [
    join(__dirname, '..', 'skills-index.json'),
    join(__dirname, '..', '..', 'skills-index.json'),
  ];

  for (const c of candidates) {
    if (existsSync(c)) {
      return JSON.parse(readFileSync(c, 'utf-8'));
    }
  }

  return { version: '0', categories: {}, skills: [] };
}

// ── 加载配置 ──

function loadConfig(): SkillCompassConfig {
  const configPath = join(process.cwd(), 'skill-compass.config.json');
  if (existsSync(configPath)) {
    try {
      return JSON.parse(readFileSync(configPath, 'utf-8'));
    } catch {
      console.error('配置文件解析失败，使用默认配置');
    }
  }
  return {};
}

// ── 创建服务器 ──

export function createServer() {
  const db = loadDatabase();
  const config = loadConfig();

  const server = new Server(
    { name: 'skill-compass-mcp', version: '0.2.0' },
    { capabilities: { tools: {} } }
  );

  // ── 工具列表 ──

  server.setRequestHandler(ListToolsRequestSchema, async () => ({
    tools: [
      {
        name: 'scan_skills',
        description: '自动扫描你系统里已经安装的所有 Agent Skill（WorkBuddy、自建项目、GitHub 仓库），然后分析覆盖情况和缺口。',
        inputSchema: {
          type: 'object',
          properties: {
            useCache: { type: 'boolean', description: '是否使用缓存（默认 true）' },
            exportFormat: { type: 'string', enum: ['text', 'json', 'markdown'], description: '导出格式（可选）' },
            exportPath: { type: 'string', description: '导出路径（可选）' },
          },
        },
      },
      {
        name: 'suggest_additions',
        description: '基于你已有的 Skill 和你想做的事，推荐补充哪些 Skill。',
        inputSchema: {
          type: 'object',
          properties: {
            goal: { type: 'string', description: '你想做的事，比如"做前端页面"、"分析竞品"、"做数据分析"、留空则基于当前缺口推荐' },
            exportFormat: { type: 'string', enum: ['text', 'json', 'markdown'], description: '导出格式（可选）' },
            exportPath: { type: 'string', description: '导出路径（可选）' },
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
            exportFormat: { type: 'string', enum: ['text', 'json', 'markdown'], description: '导出格式（可选）' },
            exportPath: { type: 'string', description: '导出路径（可选）' },
          },
        },
      },
      {
        name: 'clear_cache',
        description: '清除扫描缓存，强制下次扫描重新执行。',
        inputSchema: { type: 'object', properties: {} },
      },
      {
        name: 'export_report',
        description: '导出扫描报告到文件。',
        inputSchema: {
          type: 'object',
          properties: {
            format: { type: 'string', enum: ['text', 'json', 'markdown'], description: '导出格式' },
            outputPath: { type: 'string', description: '输出路径' },
          },
          required: ['format', 'outputPath'],
        },
      },
    ],
  }));

  // ── 工具调用 ──

  server.setRequestHandler(CallToolRequestSchema, async (request) => {
    const { name: toolName, arguments: args } = request.params;

    try {
      switch (toolName) {
        case 'scan_skills': {
          const useCache = args?.useCache !== false;
          const exportFormat = args?.exportFormat as string;
          const exportPath = args?.exportPath as string;

          // 检查缓存
          let skills;
          let analysis;

          if (useCache) {
            const cached = getScanCache(config);
            if (cached) {
              skills = cached.skills;
              analysis = cached.analysis;
            }
          }

          if (!skills || !analysis) {
            skills = scanUserSkills(db, config);
            analysis = analyzeCoverage(skills, db, config);
            setScanCache(skills, analysis, config);
          }

          // 生成报告
          const report = generateScanReport(skills, analysis, db);

          // 导出（如果指定）
          if (exportFormat && exportPath) {
            exportReport(skills, analysis, db, { format: exportFormat as any, outputPath: exportPath });
          }

          return { content: [{ type: 'text', text: report }] };
        }

        case 'suggest_additions': {
          const goal = (args?.goal as string) || '';
          const exportFormat = args?.exportFormat as string;
          const exportPath = args?.exportPath as string;

          const skills = scanUserSkills(db, config);
          const analysis = analyzeCoverage(skills, db, config);

          const report = generateSuggestionReport(goal, skills, analysis, db);

          // 导出（如果指定）
          if (exportFormat && exportPath) {
            exportSuggestions(goal, skills, analysis, db, { format: exportFormat as any, outputPath: exportPath });
          }

          return { content: [{ type: 'text', text: report }] };
        }

        case 'list_known': {
          const category = (args?.category as string) || '';
          const exportFormat = args?.exportFormat as string;
          const exportPath = args?.exportPath as string;

          const report = generateKnowledgeBaseList(category, db);

          // 导出（如果指定）
          if (exportFormat && exportPath) {
            exportKnowledgeBase(category, db, { format: exportFormat as any, outputPath: exportPath });
          }

          return { content: [{ type: 'text', text: report }] };
        }

        case 'clear_cache': {
          clearCache();
          return { content: [{ type: 'text', text: '✅ 缓存已清除' }] };
        }

        case 'export_report': {
          const format = args?.format as string;
          const outputPath = args?.outputPath as string;

          const skills = scanUserSkills(db, config);
          const analysis = analyzeCoverage(skills, db, config);

          exportReport(skills, analysis, db, { format: format as any, outputPath });

          return { content: [{ type: 'text', text: `✅ 报告已导出到: ${outputPath}` }] };
        }

        default:
          throw new Error(`Unknown tool: ${toolName}`);
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : String(error);
      return {
        content: [{ type: 'text', text: `❌ 错误: ${errorMessage}` }],
        isError: true,
      };
    }
  });

  return server;
}
