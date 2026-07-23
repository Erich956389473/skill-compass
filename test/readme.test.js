/**
 * README 文档测试
 * 测试 README 文档的完整性和规范性
 */

const fs = require('fs');
const path = require('path');

describe('README 文档', () => {
  let readmeContent;

  beforeAll(() => {
    const readmePath = path.join(__dirname, '../README.md');
    readmeContent = fs.readFileSync(readmePath, 'utf-8');
  });

  describe('文档结构', () => {
    test('应该包含标题', () => {
      expect(readmeContent).toContain('# Skill Compass — 技能指南针');
    });

    test('应该包含项目描述', () => {
      expect(readmeContent).toContain('不用你报，它自己扫。');
    });

    test('应该包含功能特性章节', () => {
      expect(readmeContent).toContain('## ✨ 功能特性');
    });

    test('应该包含快速开始章节', () => {
      expect(readmeContent).toContain('## 🚀 快速开始');
    });

    test('应该包含工具列表章节', () => {
      expect(readmeContent).toContain('## 📖 工具列表');
    });

    test('应该包含使用场景章节', () => {
      expect(readmeContent).toContain('## 🎯 使用场景');
    });

    test('应该包含技术栈章节', () => {
      expect(readmeContent).toContain('## 📦 技术栈');
    });

    test('应该包含 License 章节', () => {
      expect(readmeContent).toContain('## 📄 License');
    });
  });

  describe('功能特性', () => {
    test('应该列出自动扫描功能', () => {
      expect(readmeContent).toContain('自动扫描');
    });

    test('应该列出 12 维分析功能', () => {
      expect(readmeContent).toContain('12 维分析');
    });

    test('应该列出缺口检测功能', () => {
      expect(readmeContent).toContain('缺口检测');
    });

    test('应该列出智能推荐功能', () => {
      expect(readmeContent).toContain('智能推荐');
    });

    test('应该列出中英双语支持', () => {
      expect(readmeContent).toContain('中英双语');
    });
  });

  describe('快速开始', () => {
    test('应该包含安装说明', () => {
      expect(readmeContent).toContain('### 安装');
    });

    test('应该包含 npm 安装命令', () => {
      expect(readmeContent).toContain('npm install -g skill-compass-mcp');
    });

    test('应该包含 npx 运行命令', () => {
      expect(readmeContent).toContain('npx skill-compass-mcp');
    });

    test('应该包含 MCP 配置说明', () => {
      expect(readmeContent).toContain('### MCP 配置');
    });

    test('应该包含配置示例', () => {
      expect(readmeContent).toContain('"mcpServers"');
    });
  });

  describe('工具列表', () => {
    test('应该列出 scan_skills 工具', () => {
      expect(readmeContent).toContain('scan_skills');
    });

    test('应该列出 suggest_additions 工具', () => {
      expect(readmeContent).toContain('suggest_additions');
    });

    test('应该列出 list_known 工具', () => {
      expect(readmeContent).toContain('list_known');
    });

    test('应该列出 clear_cache 工具', () => {
      expect(readmeContent).toContain('clear_cache');
    });

    test('应该列出 export_report 工具', () => {
      expect(readmeContent).toContain('export_report');
    });

    test('应该包含工具说明', () => {
      expect(readmeContent).toContain('扫描系统中的所有 Skill');
      expect(readmeContent).toContain('基于已有 Skill 推荐补充');
    });
  });

  describe('使用场景', () => {
    test('应该列出技能覆盖分析场景', () => {
      expect(readmeContent).toContain('技能覆盖分析');
    });

    test('应该列出获取补充建议场景', () => {
      expect(readmeContent).toContain('获取补充建议');
    });

    test('应该列出导出报告场景', () => {
      expect(readmeContent).toContain('导出报告');
    });
  });

  describe('技术栈', () => {
    test('应该列出编程语言', () => {
      expect(readmeContent).toContain('TypeScript');
    });

    test('应该列出协议', () => {
      expect(readmeContent).toContain('MCP');
    });

    test('应该列出包管理器', () => {
      expect(readmeContent).toContain('npm');
    });
  });

  describe('链接和徽章', () => {
    test('应该包含 GitHub 链接', () => {
      expect(readmeContent).toContain('https://github.com/Erich956389473/skill-compass');
    });

    test('应该包含 npm 链接', () => {
      expect(readmeContent).toContain('https://www.npmjs.com/package/skill-compass-mcp');
    });

    test('应该包含 License 徽章', () => {
      expect(readmeContent).toContain('License: MIT');
    });

    test('应该包含英文 README 链接', () => {
      expect(readmeContent).toContain('[English](./README_EN.md)');
    });
  });

  describe('文档质量', () => {
    test('应该包含代码示例', () => {
      expect(readmeContent).toContain('```bash');
      expect(readmeContent).toContain('```json');
    });

    test('应该包含作者信息', () => {
      expect(readmeContent).toContain('Erich Lee');
    });

    test('应该包含 GitHub 链接', () => {
      expect(readmeContent).toContain('https://github.com/Erich956389473');
    });
  });

  describe('乱码检测', () => {
    test('应该使用 UTF-8 编码', () => {
      // 检查是否包含中文字符
      const chineseRegex = /[一-鿿]/;
      expect(chineseRegex.test(readmeContent)).toBe(true);
    });

    test('不应该包含乱码字符', () => {
      const garbledPatterns = [
        /\\u[0-9a-fA-F]{4}/,
        /&#x[0-9a-fA-F]+;/,
        /%[0-9a-fA-F]{2}/,
        /�/,
      ];

      garbledPatterns.forEach(pattern => {
        expect(pattern.test(readmeContent)).toBe(false);
      });
    });

    test('应该包含正确的标点符号', () => {
      // 检查中文标点符号
      expect(readmeContent).toContain('—');  // 破折号
      expect(readmeContent).toContain('`');  // 反引号
    });
  });
});