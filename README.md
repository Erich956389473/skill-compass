[English](./README_EN.md) | 中文

---

# Skill Compass — 技能指南针

> 不用你报，它自己扫。

[![GitHub](https://img.shields.io/badge/GitHub-100000?style=for-the-badge&logo=github&logoColor=white)](https://github.com/Erich956389473/skill-compass)
[![npm](https://img.shields.io/badge/npm-CB3837?style=for-the-badge&logo=npm&logoColor=white)](https://www.npmjs.com/package/skill-compass-mcp)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

## ✨ 功能特性

- **自动扫描** — 扫描系统中所有已安装的 Agent Skill
- **12 维分析** — 多维度能力分析
- **缺口检测** — 发现缺失的技能
- **智能推荐** — 推荐补充技能
- **中英双语** — 支持中文和英文

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

## 📖 工具列表

| 工具 | 说明 |
|------|------|
| `scan_skills` | 扫描系统中的所有 Skill，分析覆盖情况 |
| `suggest_additions` | 基于已有 Skill 推荐补充 |
| `list_known` | 查看知识库中收录的已知 Skill |
| `clear_cache` | 清除扫描缓存 |
| `export_report` | 导出扫描报告 |

## 🎯 使用场景

- 了解当前 Agent 技能覆盖情况
- 发现缺失的技能类型
- 获取技能补充建议
- 生成技能报告

## 📦 技术栈

- **语言:** TypeScript
- **协议:** MCP (Model Context Platform)
- **包管理:** npm
- **License:** MIT

## 📄 License

MIT License - 详见 [LICENSE](LICENSE)

---

**Author:** Erich Lee | [GitHub](https://github.com/Erich956389473)
