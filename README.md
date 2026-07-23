[English](./README_EN.md) | 中文

---

# Skill Compass — 技能指南针

> 不用你报，它自己扫。

[![GitHub](https://img.shields.io/badge/GitHub-100000?style=for-the-badge&logo=github&logoColor=white)](https://github.com/Erich956389473/skill-compass)
[![npm](https://img.shields.io/badge/npm-CB3837?style=for-the-badge&logo=npm&logoColor=white)](https://www.npmjs.com/package/skill-compass-mcp)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Build Status](https://img.shields.io/badge/build-passing-brightgreen)](https://github.com/Erich956389473/skill-compass/actions)

## ✨ 功能特性

- **自动扫描** — 扫描系统中所有已安装的 Agent Skill
- **12 维分析** — 多维度能力分析（编程、测试、文档、部署等）
- **缺口检测** — 发现缺失的技能类型
- **智能推荐** — 基于场景推荐补充技能
- **中英双语** — 支持中文和英文界面
- **MCP 协议** — 标准 MCP 服务器，兼容主流 Agent
- **缓存机制** — 智能缓存扫描结果，提升性能
- **报告导出** — 支持导出 JSON/Markdown 报告

## 🚀 快速开始

### 安装

```bash
# 全局安装
npm install -g skill-compass-mcp

# 或直接运行
npx skill-compass-mcp
```

### MCP 配置

在 MCP 客户端配置中添加：

```json
{
  "mcpServers": {
    "skill-compass": {
      "command": "npx",
      "args": ["skill-compass-mcp"]
    }
  }
}
```

### Claude Code 配置

在 Claude Code 配置文件中添加：

```json
{
  "mcpServers": {
    "skill-compass": {
      "command": "skill-compass-mcp",
      "args": []
    }
  }
}
```

## 📖 工具列表

### 扫描工具

| 工具 | 说明 | 参数 |
|------|------|------|
| `scan_skills` | 扫描系统中的所有 Skill，分析覆盖情况 | `force?: boolean` - 强制重新扫描 |
| `suggest_additions` | 基于已有 Skill 推荐补充 | `scenario?: string` - 使用场景 |
| `list_known` | 查看知识库中收录的已知 Skill | `category?: string` - 技能类别 |

### 管理工具

| 工具 | 说明 | 参数 |
|------|------|------|
| `clear_cache` | 清除扫描缓存 | 无 |
| `export_report` | 导出扫描报告 | `format?: 'json' \| 'markdown'` - 报告格式 |

## 🎯 使用场景

### 场景 1：技能覆盖分析

```bash
# 扫描当前系统中的所有 Skill
scan_skills

# 输出示例：
# ✅ 发现 15 个已安装的 Skill
# 📊 覆盖率: 75%
# ⚠️ 缺失: 测试、部署、监控
```

### 场景 2：获取补充建议

```bash
# 基于当前 Skill 推荐补充
suggest_additions --scenario "web-development"

# 输出建议：
# 1. 添加 playwright-mcp (端到端测试)
# 2. 添加 docker-mcp (容器部署)
# 3. 添加 github-mcp (代码管理)
```

### 场景 3：导出报告

```bash
# 导出 Markdown 报告
export_report --format markdown

# 导出 JSON 报告
export_report --format json
```

## 🔧 配置选项

### 环境变量

| 变量名 | 说明 | 默认值 |
|--------|------|--------|
| `SKILL_COMPASS_CACHE_DIR` | 缓存目录 | `~/.skill-compass` |
| `SKILL_COMPASS_LANGUAGE` | 界面语言 | `en` |
| `SKILL_COMPASS_LOG_LEVEL` | 日志级别 | `info` |

### 配置文件

配置文件位置：`~/.skill-compass/config.json`

```json
{
  "language": "zh",
  "cacheEnabled": true,
  "scanTimeout": 30000,
  "reportFormat": "markdown"
}
```

## 📊 12 维分析模型

Skill Compass 使用 12 维度分析 Agent 技能：

| 维度 | 说明 | 示例 Skill |
|------|------|------------|
| 编程 | 代码编写能力 | eslint-mcp, prettier-mcp |
| 测试 | 测试能力 | jest-mcp, playwright-mcp |
| 文档 | 文档生成 | jsdoc-mcp, swagger-mcp |
| 部署 | 部署能力 | docker-mcp, k8s-mcp |
| 监控 | 监控能力 | prometheus-mcp, grafana-mcp |
| 安全 | 安全检查 | snyk-mcp, sonarqube-mcp |
| 性能 | 性能优化 | lighthouse-mcp, web-vitals-mcp |
| 数据库 | 数据库操作 | postgres-mcp, mongodb-mcp |
| API | API 集成 | rest-mcp, graphql-mcp |
| 消息 | 消息通知 | slack-mcp, email-mcp |
| 搜索 | 搜索能力 | elasticsearch-mcp, algolia-mcp |
| 存储 | 文件存储 | s3-mcp, minio-mcp |

## 🛠️ 开发

### 环境要求

- Node.js >= 16.0.0
- npm >= 8.0.0

### 开发命令

```bash
# 克隆仓库
git clone https://github.com/Erich956389473/skill-compass.git
cd skill-compass

# 安装依赖
npm install

# 编译 TypeScript
npm run build

# 运行测试
npm test

# 监听模式
npm run dev
```

### 项目结构

```
skill-compass/
├── src/                    # 源代码
│   ├── index.ts           # 入口文件
│   ├── scanner.ts         # 技能扫描器
│   ├── analyzer.ts        # 12 维分析器
│   ├── recommender.ts     # 智能推荐
│   ├── cache.ts           # 缓存管理
│   └── i18n/              # 国际化
│       ├── index.ts
│       ├── en.ts
│       └── zh.ts
├── test/                   # 测试文件
├── dist/                   # 编译输出
├── package.json
└── README.md
```

## 📦 技术栈

- **语言:** TypeScript 5.0
- **协议:** MCP (Model Context Protocol)
- **运行时:** Node.js
- **包管理:** npm
- **测试框架:** Jest
- **构建工具:** tsup
- **License:** MIT

## 🤝 贡献指南

欢迎贡献代码！请遵循以下步骤：

1. Fork 本仓库
2. 创建功能分支 (`git checkout -b feature/AmazingFeature`)
3. 提交更改 (`git commit -m 'Add some AmazingFeature'`)
4. 推送到分支 (`git push origin feature/AmazingFeature`)
5. 创建 Pull Request

### 代码规范

- 使用 ESLint 进行代码检查
- 遵循 TypeScript Strict Mode
- 添加适当的注释
- 编写单元测试

## 📝 更新日志

### v0.2.0 (2024-01-01)

- ✨ 添加 12 维分析模型
- ✨ 添加智能推荐功能
- ✨ 添加报告导出功能
- 🐛 修复缓存问题
- 📝 完善中英文文档

### v0.1.0 (2024-01-01)

- ✨ 初始版本发布
- ✨ 基础扫描功能
- ✨ MCP 协议支持
- ✨ 中英双语界面

## ❓ 常见问题

### Q: 为什么扫描不到某些 Skill？

A: 请确保：
- Skill 已正确安装
- Skill 在系统 PATH 中
- 有文件系统访问权限

### Q: 如何添加自定义 Skill？

A: 目前暂不支持自定义 Skill，未来版本将添加配置文件支持。

### Q: 缓存存储在哪里？

A: 缓存存储在用户主目录下的 `.skill-compass/cache.json` 文件中。

### Q: 支持哪些 MCP 客户端？

A: 支持所有标准 MCP 客户端，包括：
- Claude Code
- Cursor
- Continue
- 其他 MCP 兼容客户端

## 📄 License

MIT License - 详见 [LICENSE](LICENSE)

---

**Author:** Erich Lee | [GitHub](https://github.com/Erich956389473)
