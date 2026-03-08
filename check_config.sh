#!/bin/bash
echo "=== OpenClaw目录结构 ==="
find ~/.openclaw -type f -name "*.json" -o -name "*.yaml" -o -name "*.yml" | grep -v node_modules | head -30
echo ""
echo "=== 主配置可能位置 ==="
ls -la ~/.openclaw/config* 2>/dev/null || echo "没有找到config文件"
ls -la ~/.openclaw/agents/ 2>/dev/null || echo "没有agents目录"