import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';

export default function ProfileScreen() {
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <View style={styles.avatar}>
          <Text style={styles.avatarText}>张</Text>
        </View>
        <Text style={styles.name}>张三</Text>
        <Text style={styles.company}>ABC科技有限公司</Text>
      </View>

      <View style={styles.info}>
        <View style={styles.infoRow}>
          <Text style={styles.label}>职位</Text>
          <Text style={styles.value}>总经理</Text>
        </View>
        <View style={styles.infoRow}>
          <Text style={styles.label}>电话</Text>
          <Text style={styles.value}>13800138000</Text>
        </View>
        <View style={styles.infoRow}>
          <Text style={styles.label}>入会时间</Text>
          <Text style={styles.value}>2024-01-15</Text>
        </View>
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
        <TouchableOpacity style={[styles.menuItem, styles.logout]}>
          <Ionicons name="log-out" size={20} color="#FFF" style={styles.menuIcon} />
          <Text style={styles.logoutText}>退出登录</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F5F5F5' },
  header: { backgroundColor: '#007AFF', padding: 30, alignItems: 'center' },
  avatar: { width: 80, height: 80, borderRadius: 40, backgroundColor: '#FFFFFF', justifyContent: 'center', alignItems: 'center' },
  avatarText: { fontSize: 32, color: '#007AFF', fontWeight: 'bold' },
  name: { fontSize: 24, fontWeight: 'bold', color: '#FFFFFF', marginTop: 12 },
  company: { fontSize: 14, color: '#E0E0E0', marginTop: 4 },
  info: { backgroundColor: '#FFFFFF', margin: 10, borderRadius: 10, padding: 10 },
  infoRow: { flexDirection: 'row', justifyContent: 'space-between', padding: 12, borderBottomWidth: 1, borderBottomColor: '#F0F0F0' },
  label: { color: '#666666', fontSize: 14 },
  value: { color: '#333333', fontSize: 14 },
  menu: { margin: 10 },
  menuItem: { backgroundColor: '#FFFFFF', padding: 16, borderRadius: 10, marginBottom: 8, flexDirection: 'row', alignItems: 'center' },
  menuIcon: { marginRight: 12 },
  menuText: { fontSize: 16, color: '#333333' },
  logout: { backgroundColor: '#FF3B30', marginTop: 20 },
  logoutText: { fontSize: 16, color: '#FFFFFF', fontWeight: 'bold' },
});