// API 配置
// 通过 Expo 公共环境变量注入，避免把环境选择写死在代码里
import AsyncStorage from '@react-native-async-storage/async-storage';

const API_BASE_URL = process.env.EXPO_PUBLIC_API_BASE_URL;

if (!API_BASE_URL) {
  throw new Error(
    'Missing EXPO_PUBLIC_API_BASE_URL. Copy mobile/.env.example to mobile/.env and set the backend URL.'
  );
}

export const API = {
  // 认证
  LOGIN: `${API_BASE_URL}/api/auth/login`,
  REGISTER: `${API_BASE_URL}/api/auth/register`,

  // 会员 / 企业
  MEMBERS: `${API_BASE_URL}/api/members`,
  COMPANIES: `${API_BASE_URL}/api/members`,

  // 活动
  ACTIVITIES: `${API_BASE_URL}/api/activities`,

  // 健康检查
  HEALTH: `${API_BASE_URL}/health`,
};

// 请求配置 - 支持相对路径和完整 URL
export const fetchApi = async (url: string, options: RequestInit = {}) => {
  const token = await AsyncStorage.getItem('yueqing_chamber_token');

  // 如果是相对路径，添加 base URL
  const fullUrl = url.startsWith('http') ? url : `${API_BASE_URL}${url}`;

  const headers = {
    'Content-Type': 'application/json',
    ...(token && { Authorization: `Bearer ${token}` }),
    ...options.headers,
  };

  const response = await fetch(fullUrl, {
    ...options,
    headers,
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || '请求失败');
  }

  return data;
};
