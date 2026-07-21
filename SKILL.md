---
name: skill-compass
description: 技能指南针 — 自动扫描你系统里已有 Skill，分析覆盖了什么、缺什么、推荐补什么。
---

# Skill Compass — 技能指南针

## 它是干什么的

**不用你报，它自己扫。**

MCP Server 版本会自动扫描你系统里所有已安装的 Skill（WorkBuddy、自建项目等），
然后分析：你的 Skill 覆盖了哪些能力、哪些场景能做、还缺什么、建议补什么。

## 怎么用

在任何支持 MCP 的客户端中直接调用工具：

### `scan_skills` — 自动扫描 + 分析

```
# 一句话，不需要任何参数
scan_skills
```

返回：
- 发现了多少个 Skill（按来源分类）
- 你的能力覆盖分析（12 个分类中覆盖了几个）
- 场景匹配度（前端/P M/数据分析/内容创作分别多少%）
- 缺口在哪

### `suggest_additions` — 推荐补充

```
# 基于当前缺口推荐
suggest_additions

# 或基于一个目标推荐
suggest_additions goal="做前端页面"
```

### `list_known` — 查看已知 Skill 库

```
list_known
list_known category=pm-tools
```

## 两版对比

| 版本 | 怎么获取你的 Skill 信息 | 适用场景 |
|------|-----------------------|---------|
| **MCP Server** | 自动扫描本地文件系统 | 你有安装目录可扫（WorkBuddy / 自建项目） |
| **SKILL.md** | 你说出你的 Skill | 在云端或无法访问文件系统的 Agent 中 |

## 设计原则

1. **不让你报** — 能自动扫就不让你手动输入
2. **客观分析** — 你实际有什么就分析什么，不预设
3. **看见空白** — 覆盖了什么、缺什么，一目了然
4. **可操作建议** — 缺口都有对应的推荐补充 Skill
