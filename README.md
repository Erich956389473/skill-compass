# Skill Compass — 技能指南针

**在海量 Agent Skill 中找到最适合你场景的组合。**

## 背景

2026 年，Agent Skill 生态已经爆发：
- hallmark 14k ⭐（反AI设计）
- archify 6k ⭐（架构图生成）
- cangjie-skill 4k ⭐（知识蒸馏）
- pm-skills 24k ⭐（PM操作系统）
- wigolo 2.7k ⭐（Agent联网）
- fe-inspector、code-review-graph、OfficeCLI、video-use、ai-job-search……

**但选择太多了。** 同类型的功能有十几个 Skill，哪个适合你？哪些该组合用？还缺什么？

Skill Compass 不教你怎么用 Skill，它帮你找到方向。

## 怎么用

在任何支持 SKILL.md 的 Agent 中告诉它你想做什么：

```
我要做一个 SaaS 着陆页，用 Claude Code
```

它会返回：

```
推荐 Skill 组合：
1. hallmark → 防AI模板味（着陆页需要）
2. fe-inspector → 检查可访问性和响应式（SEO友好）
组合建议：hallmark 生成时用 → fe-inspector 生成后检查
缺什么：没有专门的文案质量检查 Skill
```

## 覆盖的 Skill（14个，持续增加）

| Skill | 领域 | 星数 | 适合 |
|-------|------|:----:|------|
| fe-inspector-mcp | 前端质量 | — | 全面检查AI生成页面 |
| hallmark | 前端审美 | 14k | 反AI模板味 |
| pm-adaptive-skills | PM工具 | — | 中国PM自适应分析 |
| pm-skills | PM工具 | 24k | 海外PM全流程 |
| archify | 内容创作 | 6k | 生成架构图 |
| cangjie-skill | 知识管理 | 4k | 知识蒸馏成技能 |
| wigolo | 基础设施 | 2.7k | Agent免费联网 |
| OfficeCLI | 基础设施 | 20k | Agent操作Office文档 |
| code-review-graph | 代码质量 | 23k | AI代码审查 |
| graphify | 代码质量 | 87k | 知识图谱构建 |
| video-use | 应用层 | 17k | Agent视频剪辑 |
| ai-job-search | 应用层 | 22k | AI求职自动化 |
| OmniRoute | 基础设施 | 22k | 模型聚合网关 |
| cognee | 基础设施 | 28k | Agent长期记忆 |

## 项目结构

```
skill-compass/
├── SKILL.md              # 核心推荐逻辑（Agent读这个）
├── skills-index.json     # Skill 元数据库（14个Skill的详细数据）
└── README.md
```
