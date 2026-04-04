import { useLocalSearchParams, useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';

export default function MemberDetailScreen() {
  const router = useRouter();
  const params = useLocalSearchParams<{
    id?: string;
    name?: string;
    company?: string;
    position?: string;
    status?: string;
    district?: string;
    chamberTitle?: string;
  }>();

  const name = typeof params.name === 'string' ? params.name : '未命名会员';
  const company = typeof params.company === 'string' ? params.company : '暂无企业信息';
  const position = typeof params.position === 'string' ? params.position : '职位待补充';
  const status = params.status === 'inactive' ? '非活跃' : '活跃';
  const district = typeof params.district === 'string' && params.district ? params.district : null;
  const chamberTitle = typeof params.chamberTitle === 'string' && params.chamberTitle ? params.chamberTitle : null;

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.content}>
        <Pressable style={styles.backButton} onPress={() => router.back()}>
          <Text style={styles.backButtonText}>返回</Text>
        </Pressable>

        <View style={styles.card}>
          <Text style={styles.title}>{name}</Text>
          <Text style={styles.meta}>会员ID：{params.id || '未提供'}</Text>
          <Text style={styles.label}>企业</Text>
          <Text style={styles.value}>{company}</Text>
          <Text style={styles.label}>职位</Text>
          <Text style={styles.value}>{position}</Text>
          {chamberTitle ? (
            <>
              <Text style={styles.label}>商会职务</Text>
              <Text style={styles.value}>{chamberTitle}</Text>
            </>
          ) : null}
          {district ? (
            <>
              <Text style={styles.label}>片区</Text>
              <Text style={styles.value}>{district}</Text>
            </>
          ) : null}
          <Text style={styles.label}>状态</Text>
          <Text style={styles.value}>{status}</Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F5F7FA' },
  content: { padding: 16, gap: 12 },
  backButton: {
    alignSelf: 'flex-start',
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 999,
    backgroundColor: '#FFFFFF',
  },
  backButtonText: { color: '#1677FF', fontWeight: '600' },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 20,
    gap: 8,
  },
  title: { fontSize: 24, fontWeight: '700', color: '#1F2329' },
  meta: { fontSize: 13, color: '#86909C' },
  label: { marginTop: 8, fontSize: 13, color: '#86909C' },
  value: { fontSize: 16, color: '#1F2329', lineHeight: 22 },
});
