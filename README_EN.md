English | [中文](./README.md)

---

# Skill Compass

> Automatically scan all Agent Skills in your system, analyze what's covered and what's missing

[![GitHub](https://img.shields.io/badge/GitHub-100000?style=for-the-badge&logo=github&logoColor=white)](https://github.com/Erich956389473/skill-compass)
[![npm](https://img.shields.io/badge/npm-CB3837?style=for-the-badge&logo=npm&logoColor=white)](https://www.npmjs.com/package/skill-compass-mcp)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

## ✨ Features

- **Auto Scan** — Scan all installed Agent Skills in your system
- **12-Dimension Analysis** — Multi-dimensional capability analysis
- **Gap Detection** — Discover missing skill types
- **Smart Recommendations** — Suggest skills based on scenarios
- **Bilingual Support** — Chinese and English interface
- **MCP Protocol** — Standard MCP server, compatible with mainstream Agents
- **Cache Mechanism** — Smart caching for better performance
- **Report Export** — Export reports in JSON/Markdown format

## 🚀 Quick Start

### Installation

```bash
# Global install
npm install -g skill-compass-mcp

# Or run directly
npx skill-compass-mcp
```

### MCP Configuration

Add to your MCP client configuration:

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

### Claude Code Configuration

Add to your Claude Code configuration:

```json
{
  "mcpServers": {
    "skill-compass": {
      "command": "skill-compass",
      "args": []
    }
  }
}
```

## 📖 Tools

### Scan Tools

| Tool | Description | Parameters |
|------|-------------|------------|
| `scan_skills` | Scan all Skills in the system, analyze coverage | `force?: boolean` - Force rescan |
| `suggest_additions` | Suggest additions based on existing Skills | `scenario?: string` - Usage scenario |
| `list_known` | View known Skills in the knowledge base | `category?: string` - Skill category |

### Management Tools

| Tool | Description | Parameters |
|------|-------------|------------|
| `clear_cache` | Clear scan cache | None |
| `export_report` | Export scan report | `format?: 'json' \| 'markdown'` - Report format |

## 🎯 Usage Scenarios

### Scenario 1: Skill Coverage Analysis

```json
{
  "tool": "scan_skills",
  "arguments": {}
}
```

Output:
- ✅ Found 15 installed Skills
- 📊 Coverage: 75%
- ⚠️ Missing: testing, deployment, monitoring

### Scenario 2: Get Recommendations

```json
{
  "tool": "suggest_additions",
  "arguments": {
    "scenario": "web-development"
  }
}
```

### Scenario 3: Export Report

```json
{
  "tool": "export_report",
  "arguments": {
    "format": "markdown"
  }
}
```

## 🔧 Configuration

### Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `SKILL_COMPASS_CACHE_DIR` | Cache directory | `~/.skill-compass` |
| `SKILL_COMPASS_LANGUAGE` | Interface language | `en` |
| `SKILL_COMPASS_LOG_LEVEL` | Log level | `info` |

## 📊 12-Dimension Analysis Model

| Dimension | Description | Example Skills |
|-----------|-------------|----------------|
| Programming | Code writing ability | eslint-mcp, prettier-mcp |
| Testing | Testing ability | jest-mcp, playwright-mcp |
| Documentation | Doc generation | jsdoc-mcp, swagger-mcp |
| Deployment | Deployment ability | docker-mcp, k8s-mcp |
| Monitoring | Monitoring ability | prometheus-mcp, grafana-mcp |
| Security | Security checks | snyk-mcp, sonarqube-mcp |
| Performance | Performance optimization | lighthouse-mcp, web-vitals-mcp |
| Database | Database operations | postgres-mcp, mongodb-mcp |
| API | API integration | rest-mcp, graphql-mcp |
| Messaging | Notifications | slack-mcp, email-mcp |
| Search | Search ability | elasticsearch-mcp, algolia-mcp |
| Storage | File storage | s3-mcp, minio-mcp |

## 🛠️ Development

### Requirements

- Node.js >= 18.0.0
- npm >= 8.0.0

### Commands

```bash
# Clone repository
git clone https://github.com/Erich956389473/skill-compass.git
cd skill-compass

# Install dependencies
npm install

# Build TypeScript
npm run build

# Run tests
npm test

# Development mode
npm run dev
```

### Project Structure

```
skill-compass/
├── src/                    # Source code
│   ├── index.ts           # Entry file
│   ├── scanner.ts         # Skill scanner
│   ├── analyzer.ts        # 12-dimension analyzer
│   ├── cache.ts           # Cache management
│   ├── exporter.ts        # Report export
│   ├── server.ts          # MCP server
│   └── types.ts           # Type definitions
├── test/                   # Test files
├── dist/                   # Build output
├── package.json
└── README.md
```

## 📦 Tech Stack

- **Language:** TypeScript 5.7
- **Protocol:** MCP (Model Context Protocol)
- **Runtime:** Node.js
- **Package Manager:** npm
- **Test Framework:** tsx + console.assert
- **Build Tool:** tsc (TypeScript Compiler)
- **License:** MIT

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Create a Pull Request

## 📝 Changelog

### v0.2.0 (2026-07-22)

- ✨ Added 12-dimension analysis model
- ✨ Added smart recommendations
- ✨ Added report export
- 🐛 Fixed cache issues
- 📝 Improved documentation

### v0.1.0 (2026-07-20)

- ✨ Initial release
- ✨ Basic scanning functionality
- ✨ MCP protocol support
- ✨ Bilingual interface

## ❓ FAQ

### Q: Why can't some Skills be detected?

A: Please ensure:
- The Skill is properly installed
- The Skill is in the system PATH
- You have file system access permissions

### Q: Where is the cache stored?

A: Cache is stored in `~/.skill-compass/cache.json` in your home directory.

### Q: Which MCP clients are supported?

A: All standard MCP clients are supported, including:
- Claude Code
- Cursor
- Continue
- Other MCP-compatible clients

## 📄 License

MIT License - see [LICENSE](LICENSE)

---

**Author:** Erich Lee | [GitHub](https://github.com/Erich956389473)
