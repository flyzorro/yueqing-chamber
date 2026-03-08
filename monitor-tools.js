// Simple tool call monitor
const fs = require('fs');
const path = require('path');

const logFile = path.join(process.env.HOME, '.openclaw', 'tool-calls.log');

// Create log directory if it doesn't exist
const logDir = path.dirname(logFile);
if (!fs.existsSync(logDir)) {
  fs.mkdirSync(logDir, { recursive: true });
}

// Monkey-patch console.log to capture tool calls
const originalLog = console.log;
console.log = function(...args) {
  originalLog.apply(console, args);
  
  // Check if this is a tool call log
  const message = args.join(' ');
  if (message.includes('tool_call') || message.includes('function_call') || 
      message.includes('executing') || message.includes('command:')) {
    const logEntry = {
      timestamp: new Date().toISOString(),
      message: message,
      args: args
    };
    
    fs.appendFileSync(logFile, JSON.stringify(logEntry) + '\n');
  }
};

// Also capture console.info, console.warn, console.error
['info', 'warn', 'error'].forEach(method => {
  const original = console[method];
  console[method] = function(...args) {
    original.apply(console, args);
    
    const message = args.join(' ');
    if (message.includes('tool') || message.includes('exec') || message.includes('ActivityClaw')) {
      const logEntry = {
        timestamp: new Date().toISOString(),
        level: method,
        message: message,
        args: args
      };
      
      fs.appendFileSync(logFile, JSON.stringify(logEntry) + '\n');
    }
  };
});

console.log('Tool call monitor installed. Logging to:', logFile);