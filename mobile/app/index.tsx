import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';

export default function HomeScreen() {
  const router = useRouter();

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>乐清商会</Text>
        <Text style={styles.subtitle}>欢迎回来</Text>
      </View>

      <View style={styles.menu}>
        <TouchableOpacity style={styles.menuItem} onPress={() => router.push('/members')}>
          <Text style={styles.menuIcon}>👥</Text>
          <Text style={styles.menuText}>会员中心</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.menuItem} onPress={() => router.push('/activities')}>
          <Text style={styles.menuIcon}>📅</Text>
          <Text style={styles.menuText}>活动管理</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.menuItem} onPress={() => router.push('/services')}>
          <Text style={styles.menuIcon}>🤝</Text>
          <Text style={styles.menuText}>商会服务</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.menuItem} onPress={() => router.push('/profile')}>
          <Text style={styles.menuIcon}>👤</Text>
          <Text style={styles.menuText}>个人中心</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.info}>
        <Text style={styles.infoText}>会员数: 5</Text>
        <Text style={styles.infoText}>活动数: 3</Text>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FFFFFF' },
  header: { padding: 20, alignItems: 'center', backgroundColor: '#007AFF' },
  title: { fontSize: 28, fontWeight: 'bold', color: '#FFFFFF' },
  subtitle: { fontSize: 16, color: '#E0E0E0', marginTop: 4 },
  menu: { flexDirection: 'row', flexWrap: 'wrap', padding: 10, justifyContent: 'space-around' },
  menuItem: { width: '45%', backgroundColor: '#F5F5F5', padding: 20, margin: 5, borderRadius: 10, alignItems: 'center' },
  menuIcon: { fontSize: 32 },
  menuText: { fontSize: 14, marginTop: 8, color: '#333333' },
  info: { padding: 20, alignItems: 'center' },
  infoText: { fontSize: 14, color: '#666666', marginVertical: 2 },
});