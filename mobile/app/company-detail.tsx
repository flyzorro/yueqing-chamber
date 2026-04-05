import { useLocalSearchParams, useRouter, Stack } from 'expo-router';
import {
  ActivityIndicator,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { API } from '../utils/api';
import { useEffect, useState } from 'react';

interface CompanyDetailResponse {
  success: boolean;
  data: {
    id: string;
    name: string;
    industry?: string | null;
    contactName?: string | null;
    contactPhone?: string | null;
    summary?: string | null;
    address?: string | null;
    status?: string | null;
    createdat?: string;
    updatedat?: string;
  };
  error?: string;
}

export default function CompanyDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const [company, setCompany] = useState<CompanyDetailResponse['data'] | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!id) {
      setError('缺少企业 ID');
      setLoading(false);
      return;
    }

    const fetchCompany = async () => {
      try {
        const response = await fetch(`${API.COMPANIES}/${id}`);
        const json: CompanyDetailResponse = await response.json();

        if (response.ok && json.success) {
          setCompany(json.data);
        } else {
          setError(json.error || '获取企业详情失败');
        }
      } catch {
        setError('网络错误，请稍后重试');
      } finally {
        setLoading(false);
      }
    };

    void fetchCompany();
  }, [id]);

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <Stack.Screen options={{ title: '企业详情' }} />
        <View style={styles.centerContainer}>
          <ActivityIndicator size="large" color="#1677FF" />
          <Text style={styles.loadingText}>加载中...</Text>
        </View>
      </SafeAreaView>
    );
  }

  if (error || !company) {
    return (
      <SafeAreaView style={styles.container}>
        <Stack.Screen options={{ title: '企业详情' }} />
        <View style={styles.centerContainer}>
          <Text style={styles.errorText}>{error || '企业不存在'}</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <Stack.Screen options={{ title: company.name }} />
      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.header}>
          <Text style={styles.name}>{company.name}</Text>
          {company.industry && (
            <View style={styles.industryTag}>
              <Text style={styles.industryText}>{company.industry}</Text>
            </View>
          )}
        </View>

        {company.summary && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>企业简介</Text>
            <Text style={styles.summary}>{company.summary}</Text>
          </View>
        )}

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>联系方式</Text>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>联系人</Text>
            <Text style={styles.infoValue}>{company.contactName || '暂无'}</Text>
          </View>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>联系电话</Text>
            <Text style={styles.infoValue}>{company.contactPhone || '暂无'}</Text>
          </View>
          {company.address && (
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>地址</Text>
              <Text style={styles.infoValue}>{company.address}</Text>
            </View>
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F7FA',
  },
  centerContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  loadingText: {
    marginTop: 12,
    color: '#86909C',
    fontSize: 14,
  },
  errorText: {
    color: '#F53F3F',
    fontSize: 16,
  },
  content: {
    padding: 16,
  },
  header: {
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    padding: 20,
    marginBottom: 16,
  },
  name: {
    fontSize: 22,
    fontWeight: '700',
    color: '#1F2329',
    marginBottom: 12,
  },
  industryTag: {
    backgroundColor: '#E8F3FF',
    borderRadius: 6,
    paddingHorizontal: 10,
    paddingVertical: 4,
    alignSelf: 'flex-start',
  },
  industryText: {
    color: '#1677FF',
    fontSize: 13,
    fontWeight: '500',
  },
  section: {
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    padding: 16,
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 15,
    fontWeight: '600',
    color: '#1F2329',
    marginBottom: 12,
  },
  summary: {
    fontSize: 14,
    color: '#4E5969',
    lineHeight: 22,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#F2F3F5',
  },
  infoLabel: {
    fontSize: 14,
    color: '#86909C',
  },
  infoValue: {
    fontSize: 14,
    color: '#1F2329',
  },
});
