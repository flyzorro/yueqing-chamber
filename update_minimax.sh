#!/bin/bash

# 首先设置基础配置
openclaw config set "models.providers.minimax.baseUrl" "https://api.minimax.chat/v1"
openclaw config set "models.providers.minimax.apiKey" "sk-cp-G1NfwXCdxhUzNUIf3rKOi6ASpoWuIA20y4BCfIFzh_z-dHfhKa1EyjSia-7uGxPW6bixT9_Lm6VGeENJJfgaSBu79TabIfRX2fZ8jRgY80jERMuAPoFSRr4"
openclaw config set "models.providers.minimax.api" "openai-completions"

# 现在需要设置models数组，这比较复杂，可能需要直接编辑JSON文件
echo "由于OpenClaw config set对数组支持有限，建议直接编辑配置文件"
echo "当前配置文件: ~/.openclaw/openclaw.json"