[English](./README_EN.md) | 中文

---

# Skill Compass — 技能指南针

[EN](#en glish) | [CN](#chinese)

---

## <span id="ch inese">中文</span>

**不用你报，它自 己扫。**

Skill Compass 会自动扫描你 系统里所有已安装的 Agent Skill，分 析覆盖了什么、缺什么、推荐补什 么。

### 快速开始

```bash
# 安装
np m install -g skill-compass-mcp

# 或直接� �行
npx skill-compass-mcp
```

### MCP 配� �

在 MCP 客户端配置中添加：

```js on
{
  "mcpServers": {
    "skill-compass": { 
      "command": "npx",
      "args": ["skil l-compass-mcp"]
    }
  }
}
```

### 工具

 | 工具 | 作用 |
|------|------|
| `scan_s kills` | 自动扫描你系统里的所有 Sk ill，分析覆盖情况和缺口 |
| `sugges t_additions` | 基于你已有的 Skill 或� �想做的事，推荐补充 |
| `list_known`  | 查看 Skill 知识库中收录的已知 S kill |
| `clear_cache` | 清除扫描缓存� �强制下次扫描重新执行 |
| `export_r eport` | 导出扫描报告到文件 |

### � ��置

创建 `skill-compass.config.json` 文 件：

```json
{
  "scanDirs": ["skills", ". agents", "~/.agents"],
  "excludeDirs": ["nod e_modules", ".git"],
  "cacheEnabled": true,
   "cacheTTL": 300000,
  "outputFormat": "text ",
  "language": "zh"
}
```

### 它能扫哪 些目录

| 目录 | 来源 |
|------|------ |
| `~/.workbuddy/skills/` | WorkBuddy |
| `~ /.claude/skills/` | Claude Code |
| `~/.codex /skills/` | Codex CLI |
| `~/.cursor/skills/`  | Cursor |
| `~/.agents/` | 通用 Agent 技 能目录 |
| `./skills/` | 当前项目 |
|  `./.agents/` | 当前项目 |

### 反应示� ��

```
> scan_skills

找到 7 个 Skill

� �力覆盖：
✅ 审美与视觉 — awesome -design-md
⚠️ 可访问性 — 无覆盖
 ⚠️ 产品管理 — 无覆盖

场景匹� ��度：
❌ 前端页面生成 — 25%
❌ � ��品管理工作 — 0%
❌ 数据分析 —  0%
```

---

## <span id="english">English</ span>

**No manual input needed. It scans you r machine.**

Skill Compass automatically dis covers all Agent Skills installed on your sys tem,
analyzes what's covered, what's missing,  and what to add.

### Quick Start

```bash
n pm install -g skill-compass-mcp

# or run dir ectly
npx skill-compass-mcp
```

### MCP Conf ig

Add to your MCP client config:

```json
{ 
  "mcpServers": {
    "skill-compass": {
       "command": "npx",
      "args": ["skill-co mpass-mcp"]
    }
  }
}
```

### Tools

| Too l | Description |
|------|-------------|
| `s can_skills` | Auto-scan all skills on your sy stem, analyze coverage and gaps |
| `suggest_ additions` | Recommend skills to add based on  your current setup or goals |
| `list_known`  | Browse the known skills knowledge base |

 ### Scan Targets

| Directory | Source |
|--- --------|--------|
| `~/.workbuddy/skills/` |  WorkBuddy |
| `~/.claude/skills/` | Claude C ode |
| `~/.codex/skills/` | Codex CLI |
| `~ /.cursor/skills/` | Cursor |
| `~/.agents/` |  Generic agent skills |
| `./skills/` | Curre nt project |
| `./.agents/` | Current project  |

### Example Output

```
> scan_skills

Fo und 7 skills

Coverage:
✅ Aesthetic — awe some-design-md
⚠️ Accessibility — not c overed
⚠️ PM tools — not covered

Scena rio Match:
❌ Frontend UI — 25%
❌ Produc t Management — 0%
❌ Data Analysis — 0%
 ```

### License

MIT
 