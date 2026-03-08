import * as SecureStore from 'expo-secure-store';

export interface User {
  id: string;
  phone: string;
  name: string;
  avatar?: string;
}

const TOKEN_KEY = 'yueqing_chamber_token';
const USER_KEY = 'yueqing_chamber_user';

/**
 * 保存登录信息（使用加密存储）
 */
export async function saveAuthData(token: string, user: User): Promise<void> {
  try {
    await SecureStore.setItemAsync(TOKEN_KEY, token);
    await SecureStore.setItemAsync(USER_KEY, JSON.stringify(user));
  } catch (error) {
    console.error('Save auth data error:', error);
    throw error;
  }
}

/**
 * 获取 Token
 */
export async function getToken(): Promise<string | null> {
  try {
    return await SecureStore.getItemAsync(TOKEN_KEY);
  } catch (error) {
    console.error('Get token error:', error);
    return null;
  }
}

/**
 * 获取用户信息
 */
export async function getUser(): Promise<User | null> {
  try {
    const userJson = await SecureStore.getItemAsync(USER_KEY);
    return userJson ? JSON.parse(userJson) : null;
  } catch (error) {
    console.error('Get user error:', error);
    return null;
  }
}

/**
 * 检查是否已登录
 */
export async function isLoggedIn(): Promise<boolean> {
  const token = await getToken();
  return token !== null;
}

/**
 * 清除登录信息（登出）
 */
export async function clearAuthData(): Promise<void> {
  try {
    await SecureStore.deleteItemAsync(TOKEN_KEY);
    await SecureStore.deleteItemAsync(USER_KEY);
  } catch (error) {
    console.error('Clear auth data error:', error);
    throw error;
  }
}

/**
 * 获取认证 Headers
 */
export async function getAuthHeaders(): Promise<Record<string, string>> {
  const token = await getToken();
  return {
    'Content-Type': 'application/json',
    ...(token ? { 'Authorization': `Bearer ${token}` } : {})
  };
}
