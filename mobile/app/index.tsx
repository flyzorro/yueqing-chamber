import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

export default function HomeScreen() {
  const router = useRouter();

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView>
        <View style={styles.header}>
          <Text style={styles.title}>乐清商会</Text>
          <Text style={styles.subtitle}>团结互助 · 共谋发展</Text>
        </View>

        {/* 商会介绍 */}
        <View style={styles.introSection}>
          <Text style={styles.sectionTitle}>商会简介</Text>
          <Text style={styles.introText}>
            乐清商会成立于2010年，是由乐清籍企业家自愿组成的非营利性社会团体。
            商会秉承"团结互助、共谋发展"的宗旨，为会员企业提供商务交流、资源共享、
            政企对接等服务，助力会员企业做大做强。
          </Text>
          <View style={styles.stats}>
            <View style={styles.statItem}>
              <Text style={styles.statNumber}>500+</Text>
              <Text style={styles.statLabel}>会员企业</Text>
            </View>
            <View style={styles.statItem}>
              <Text style={styles.statNumber}>50+</Text>
              <Text style={styles.statLabel}>年度活动</Text>
            </View>
            <View style={styles.statItem}>
              <Text style={styles.statNumber}>15</Text>
              <Text style={styles.statLabel}>成立年份</Text>
            </View>
          </View>
        </View>

        {/* 快捷入口 */}
        <View style={styles.menuSection}>
          <Text style={styles.sectionTitle}>快捷入口</Text>
          <View style={styles.menu}>
            <TouchableOpacity style={styles.menuItem} onPress={() => router.push('/members')}>
              <Ionicons name="people" size={36} color="#007AFF" />
              <Text style={styles.menuText}>会员中心</Text>
              <Text style={styles.menuDesc}>会员名录管理</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.menuItem} onPress={() => router.push('/companies')}>
              <Ionicons name="business" size={36} color="#007AFF" />
              <Text style={styles.menuText}>企业名单</Text>
              <Text style={styles.menuDesc}>独立企业名录</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.menuItem} onPress={() => router.push('/activities')}>
              <Ionicons name="calendar" size={36} color="#007AFF" />
              <Text style={styles.menuText}>活动管理</Text>
              <Text style={styles.menuDesc}>商会活动报名</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.menuItem} onPress={() => router.push('/services')}>
              <Ionicons name="briefcase" size={36} color="#007AFF" />
              <Text style={styles.menuText}>商会服务</Text>
              <Text style={styles.menuDesc}>企业服务对接</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.menuItem} onPress={() => router.push('/profile')}>
              <Ionicons name="person" size={36} color="#007AFF" />
              <Text style={styles.menuText}>个人中心</Text>
              <Text style={styles.menuDesc}>账户设置管理</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* 最新动态 */}
        <View style={styles.newsSection}>
          <Text style={styles.sectionTitle}>最新动态</Text>
          <View style={styles.newsItem}>
            <Text style={styles.newsTitle}>2026年迎春年会报名开始</Text>
            <Text style={styles.newsDate}>2026-01-15</Text>
          </View>
          <View style={styles.newsItem}>
            <Text style={styles.newsTitle}>商务考察团赴深圳交流</Text>
            <Text style={styles.newsDate}>2026-01-10</Text>
          </View>
          <View style={styles.newsItem}>
            <Text style={styles.newsTitle}>新年座谈会圆满召开</Text>
            <Text style={styles.newsDate}>2026-01-05</Text>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F5F5F5' },
  header: {
    padding: 30,
    alignItems: 'center',
    backgroundColor: '#007AFF',
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
  },
  title: { fontSize: 32, fontWeight: 'bold', color: '#FFFFFF' },
  subtitle: { fontSize: 16, color: '#E0E0E0', marginTop: 8 },

  introSection: {
    backgroundColor: '#FFFFFF',
    margin: 15,
    padding: 20,
    borderRadius: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  sectionTitle: { fontSize: 18, fontWeight: 'bold', color: '#333', marginBottom: 12 },
  introText: { fontSize: 14, color: '#666', lineHeight: 22, marginBottom: 15 },
  stats: { flexDirection: 'row', justifyContent: 'space-around', marginTop: 10 },
  statItem: { alignItems: 'center' },
  statNumber: { fontSize: 24, fontWeight: 'bold', color: '#007AFF' },
  statLabel: { fontSize: 12, color: '#999', marginTop: 4 },

  menuSection: {
    margin: 15,
  },
  menu: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between' },
  menuItem: {
    width: '48%',
    backgroundColor: '#FFFFFF',
    padding: 20,
    marginBottom: 10,
    borderRadius: 15,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  menuText: { fontSize: 16, fontWeight: 'bold', color: '#333', marginTop: 8 },
  menuDesc: { fontSize: 12, color: '#999', marginTop: 4 },

  newsSection: {
    backgroundColor: '#FFFFFF',
    margin: 15,
    padding: 20,
    borderRadius: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  newsItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  newsTitle: { fontSize: 14, color: '#333', flex: 1 },
  newsDate: { fontSize: 12, color: '#999', marginLeft: 10 },
});