# Skill Compass — 技能指南针

[EN](#english) | [CN](#chinese)

---

## <span id="chinese">中文</span>

**不用你报，它自己扫。**

Skill Compass 会自动扫描你系统里所有已安装的 Agent Skill，分析覆盖了什么、缺什么、推荐补什么。

### 快速开始

```bash
# 安装
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

### 工具

| 工具 | 作用 |
|------|------|
| `scan_skills` | 自动扫描你系统里的所有 Skill，分析覆盖情况和缺口 |
| `suggest_additions` | 基于你已有的 Skill 或你想做的事，推荐补充 |
| `list_known` | 查看 Skill 知识库中收录的已知 Skill |
| `clear_cache` | 清除扫描缓存，强制下次扫描重新执行 |
| `export_report` | 导出扫描报告到文件 |

### 配置

创建 `skill-compass.config.json` 文件：

```json
{
  "scanDirs": ["skills", ".agents", "~/.agents"],
  "excludeDirs": ["node_modules", ".git"],
  "cacheEnabled": true,
  "cacheTTL": 300000,
  "outputFormat": "text",
  "language": "zh"
}
```

### 它能扫哪些目录

| 目录 | 来源 |
|------|------|
| `~/.workbuddy/skills/` | WorkBuddy |
| `~/.claude/skills/` | Claude Code |
| `~/.codex/skills/` | Codex CLI |
| `~/.cursor/skills/` | Cursor |
| `~/.agents/` | 通用 Agent 技能目录 |
| `./skills/` | 当前项目 |
| `./.agents/` | 当前项目 |

### 反应示例

```
> scan_skills

找到 7 个 Skill

能力覆盖：
✅ 审美与视觉 — awesome-design-md
⚠️ 可访问性 — 无覆盖
⚠️ 产品管理 — 无覆盖

场景匹配度：
❌ 前端页面生成 — 25%
❌ 产品管理工作 — 0%
❌ 数据分析 — 0%
```

---

## <span id="english">English</span>

**No manual input needed. It scans your machine.**

Skill Compass automatically discovers all Agent Skills installed on your system,
analyzes what's covered, what's missing, and what to add.

### Quick Start

```bash
npm install -g skill-compass-mcp

# or run directly
npx skill-compass-mcp
```

### MCP Config

Add to your MCP client config:

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

### Tools

| Tool | Description |
|------|-------------|
| `scan_skills` | Auto-scan all skills on your system, analyze coverage and gaps |
| `suggest_additions` | Recommend skills to add based on your current setup or goals |
| `list_known` | Browse the known skills knowledge base |

### Scan Targets

| Directory | Source |
|-----------|--------|
| `~/.workbuddy/skills/` | WorkBuddy |
| `~/.claude/skills/` | Claude Code |
| `~/.codex/skills/` | Codex CLI |
| `~/.cursor/skills/` | Cursor |
| `~/.agents/` | Generic agent skills |
| `./skills/` | Current project |
| `./.agents/` | Current project |

### Example Output

```
> scan_skills

Found 7 skills

Coverage:
✅ Aesthetic — awesome-design-md
⚠️ Accessibility — not covered
⚠️ PM tools — not covered

Scenario Match:
❌ Frontend UI — 25%
❌ Product Management — 0%
❌ Data Analysis — 0%
```

### License

MIT
