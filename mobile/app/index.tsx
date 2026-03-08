import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function HomeScreen() {
  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.header}>
          <Text style={styles.title}>乐清商会</Text>
          <Text style={styles.subtitle}>欢迎回来</Text>
        </View>
        
        <View style={styles.card}>
          <Text style={styles.cardTitle}>商会动态</Text>
          <Text style={styles.cardContent}>查看最新商会新闻和活动通知</Text>
        </View>

        <View style={styles.card}>
          <Text style={styles.cardTitle}>快捷入口</Text>
          <View style={styles.quickLinks}>
            <TouchableOpacity style={styles.quickLink}>
              <Text style={styles.quickLinkText}>会员名录</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.quickLink}>
              <Text style={styles.quickLinkText}>活动报名</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.quickLink}>
              <Text style={styles.quickLinkText}>服务申请</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F2F2F7',
  },
  scrollContent: {
    padding: 16,
  },
  header: {
    marginBottom: 24,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#000000',
  },
  subtitle: {
    fontSize: 16,
    color: '#8E8E93',
    marginTop: 4,
  },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 8,
    color: '#000000',
  },
  cardContent: {
    fontSize: 14,
    color: '#8E8E93',
  },
  quickLinks: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 12,
  },
  quickLink: {
    backgroundColor: '#007AFF',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
    flex: 1,
    marginHorizontal: 4,
    alignItems: 'center',
  },
  quickLinkText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '500',
  },
});