// 必须先初始化 Sentry，然后再导入其他模块
import * as Sentry from '@sentry/node';
import { nodeProfilingIntegration } from '@sentry/profiling-node';

// 初始化 Sentry (v8+ API)
if (process.env.SENTRY_DSN) {
  Sentry.init({
    dsn: process.env.SENTRY_DSN,
    environment: process.env.NODE_ENV || 'production',
    integrations: [
      Sentry.httpIntegration(),
      Sentry.expressIntegration(),
      nodeProfilingIntegration(),
    ],
    tracesSampleRate: 1.0,
    profilesSampleRate: 1.0,
  });
}

import app from './app';
import { initTestData } from './initTestData';

const PORT = process.env.PORT || 3000;

// 启动服务器
app.listen(PORT, async () => {
  console.log(`服务器运行在 http://localhost:${PORT}`);
  
  // 初始化测试数据
  try {
    await initTestData();
    console.log('测试数据初始化完成');
  } catch (error) {
    console.error('测试数据初始化失败:', error);
  }
});

// 添加 Sentry 错误处理 (必须在所有路由之后)
Sentry.setupExpressErrorHandler(app);
