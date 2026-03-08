import { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { getUser, clearAuthData, User } from '../utils/auth';

export default function ProfileScreen() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadUser();
  }, []);

  const loadUser = async () => {
    try {
      const userData = await getUser();
      setUser(userData);
    } catch (error) {
      console.error('Load user error:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    Alert.alert('确认', '确定要退出登录吗？', [
      { text: '取消', style: 'cancel' },
      { 
        text: '确定', 
        onPress: async () => {
          try {
            await clearAuthData();
            setUser(null);
            router.replace('/login');
          } catch (error) {
            console.error('Logout error:', error);
          }
        }
      }
    ]);
  };

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <Text style={styles.loadingText}>加载中...</Text>
      </SafeAreaView>
    );
  }

  if (!user) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.notLoggedIn}>
          <Ionicons name="person-circle-outline" size={80} color="#CCC" />
          <Text style={styles.notLoggedInText}>未登录</Text>
          <TouchableOpacity style={styles.loginButton} onPress={() => router.push('/login')}>
            <Text style={styles.loginButtonText}>登录 / 注册</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <View style={styles.avatar}>
          <Text style={styles.avatarText}>{user.name.charAt(0)}</Text>
        </View>
        <Text style={styles.name}>{user.name}</Text>
        <Text style={styles.company}>{user.phone}</Text>
      </View>

      <View style={styles.menu}>
        <TouchableOpacity style={styles.menuItem}>
          <Ionicons name="notifications" size={20} color="#333" style={styles.menuIcon} />
          <Text style={styles.menuText}>通知设置</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.menuItem}>
          <Ionicons name="lock-closed" size={20} color="#333" style={styles.menuIcon} />
          <Text style={styles.menuText}>隐私设置</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.menuItem}>
          <Ionicons name="information-circle" size={20} color="#333" style={styles.menuIcon} />
          <Text style={styles.menuText}>关于我们</Text>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.menuItem, styles.logout]} onPress={handleLogout}>
          <Ionicons name="log-out" size={20} color="#FFF" style={styles.menuIcon} />
          <Text style={styles.logoutText}>退出登录</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F5F5F5' },
  loadingText: { textAlign: 'center', marginTop: 50, color: '#999', fontSize: 16 },
  notLoggedIn: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  notLoggedInText: { marginTop: 20, fontSize: 18, color: '#999' },
  loginButton: { marginTop: 30, backgroundColor: '#007AFF', paddingHorizontal: 40, paddingVertical: 15, borderRadius: 25 },
  loginButtonText: { color: '#FFF', fontSize: 16, fontWeight: 'bold' },
  header: { backgroundColor: '#007AFF', padding: 30, alignItems: 'center' },
  avatar: { width: 80, height: 80, borderRadius: 40, backgroundColor: '#FFFFFF', justifyContent: 'center', alignItems: 'center' },
  avatarText: { fontSize: 32, color: '#007AFF', fontWeight: 'bold' },
  name: { fontSize: 24, fontWeight: 'bold', color: '#FFFFFF', marginTop: 12 },
  company: { fontSize: 14, color: '#E0E0E0', marginTop: 4 },
  menu: { margin: 10 },
  menuItem: { backgroundColor: '#FFFFFF', padding: 16, borderRadius: 10, marginBottom: 8, flexDirection: 'row', alignItems: 'center' },
  menuIcon: { marginRight: 12 },
  menuText: { fontSize: 16, color: '#333333' },
  logout: { backgroundColor: '#FF3B30', marginTop: 20 },
  logoutText: { fontSize: 16, color: '#FFFFFF', fontWeight: 'bold' },
});