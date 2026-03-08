#!/bin/bash
# Simple monitor for OpenClaw tool calls

LOG_DIR="$HOME/.openclaw/logs"
TOOL_LOG="$LOG_DIR/tool-details.log"

echo "Monitoring OpenClaw tool calls..."
echo "Log file: $TOOL_LOG"
echo "Press Ctrl+C to stop"
echo ""

# Create log file if it doesn't exist
touch "$TOOL_LOG"

# Tail the gateway log and filter for interesting events
tail -f "$LOG_DIR/gateway.log" | \
  grep --line-buffered -E "(executing|tool_call|function_call|command:|ActivityClaw)" | \
  while read line; do
    timestamp=$(echo "$line" | cut -d' ' -f1)
    message=$(echo "$line" | cut -d' ' -f2-)
    
    # Extract more details if available
    if echo "$line" | grep -q "exec"; then
      echo "[$timestamp] TOOL CALL: $message" | tee -a "$TOOL_LOG"
    elif echo "$line" | grep -q "ActivityClaw"; then
      echo "[$timestamp] ACTIVITY: $message" | tee -a "$TOOL_LOG"
    else
      echo "[$timestamp] INFO: $message" | tee -a "$TOOL_LOG"
    fi
  done