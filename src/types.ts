// ── Skill 知识库类型 ──

export interface SkillEntry {
  id: string;
  name: string;
  description: string;
  categories: string[];
  bestFor: string[];
  notFor: string[];
  platform: string;
  repo: string;
  strength: string;
  weakness: string;
}

export interface SkillDB {
  version: string;
  categories: Record<string, string>;
  skills: SkillEntry[];
}

// ── 扫描结果类型 ──

export interface DetectedSkill {
  name: string;
  source: 'workbuddy' | 'self-made' | 'git-repo';
  path: string;
  knownId?: string;
  categories: string[];
  description: string;
}

// ── 覆盖分析类型 ──

export interface ScenarioMatch {
  id: string;
  label: string;
  needs: string[];
  covered: string[];
  missing: string[];
  coverage: number;
}

export interface CoverageAnalysis {
  coveredCats: string[];
  missingCats: string[];
  details: Record<string, { name: string; description: string }[]>;
  scenarioResults: ScenarioMatch[];
}

// ── 配置类型 ──

export interface SkillCompassConfig {
  scanDirs?: string[];
  excludeDirs?: string[];
  cacheEnabled?: boolean;
  cacheTTL?: number;
  outputFormat?: 'text' | 'json' | 'markdown';
  language?: 'zh' | 'en';
}

// ── 缓存类型 ──

export interface CacheEntry<T> {
  data: T;
  timestamp: number;
  ttl: number;
}

export interface ScanCache {
  skills: DetectedSkill[];
  analysis: CoverageAnalysis;
  timestamp: number;
}

// ── 导出类型 ──

export interface ExportOptions {
  format: 'text' | 'json' | 'markdown';
  outputPath?: string;
  includeAnalysis?: boolean;
  includeSuggestions?: boolean;
}

// ── 分类标签 ──

export const categoryLabels: Record<string, string> = {
  aesthetic: '审美与视觉',
  a11y: '可访问性',
  responsive: '响应式',
  interaction: '交互',
  'code-quality': '代码质量',
  'pm-tools': '产品管理',
  content: '内容创作',
  'data-analysis': '数据分析',
  infrastructure: '基础设施',
  knowledge: '知识管理',
  application: '应用层',
  security: '安全',
};

// ── 分类关键词 ──

export const catKeywords: [string, string[]][] = [
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

// ── 场景匹配 ──

export const scenarioMatches: ScenarioMatch[] = [
  { id: 'frontend-ui', label: '前端页面生成', needs: ['aesthetic', 'a11y', 'responsive', 'interaction'], covered: [], missing: [], coverage: 0 },
  { id: 'pm-work', label: '产品管理工作', needs: ['pm-tools'], covered: [], missing: [], coverage: 0 },
  { id: 'data-analysis', label: '数据分析', needs: ['data-analysis'], covered: [], missing: [], coverage: 0 },
  { id: 'content-creation', label: '内容创作', needs: ['content', 'knowledge'], covered: [], missing: [], coverage: 0 },
];
