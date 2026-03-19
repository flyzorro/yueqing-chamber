import { useCallback, useEffect, useState } from 'react';
import {
  ActivityIndicator,
  FlatList,
  Pressable,
  RefreshControl,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { API } from './utils/api';

export interface Company {
  id: string;
  name: string;
  industry?: string | null;
  contactName?: string | null;
  contactPhone?: string | null;
  summary?: string | null;
  status?: string | null;
}

interface CompaniesResponse {
  success: boolean;
  data: Company[];
  error?: string;
}

export const COMPANY_PAGE_SIZE = 20;

export default function CompaniesScreen() {
  const [companies, setCompanies] = useState<Company[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState('');

  const fetchCompanies = useCallback(async (options?: { refresh?: boolean }) => {
    const refresh = options?.refresh ?? false;

    setError('');
    if (!refresh) {
      setLoading(true);
    }

    try {
      const params = new URLSearchParams({
        page: '1',
        limit: String(COMPANY_PAGE_SIZE),
      });

      const response = await fetch(`${API.COMPANIES}?${params.toString()}`);
      const json = (await response.json()) as CompaniesResponse;

      if (!response.ok || !json.success) {
        throw new Error(json.error || '加载企业名单失败');
      }

      setCompanies(json.data || []);
    } catch (fetchError) {
      const message = fetchError instanceof Error ? fetchError.message : '加载企业名单失败';
      setError(message);
      setCompanies([]);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    void fetchCompanies();
  }, [fetchCompanies]);

  const onRefresh = () => {
    setRefreshing(true);
    void fetchCompanies({ refresh: true });
  };

  const onRetry = () => {
    void fetchCompanies();
  };

  const renderItem = ({ item }: { item: Company }) => (
    <View style={styles.card}>
      <Text style={styles.name}>{item.name}</Text>
      {item.industry ? <Text style={styles.industry}>{item.industry}</Text> : null}
      {(item.contactName || item.contactPhone) ? (
        <Text style={styles.contact}>
          联系人：{item.contactName || '暂无'}
          {item.contactPhone ? ` · ${item.contactPhone}` : ''}
        </Text>
      ) : null}
      {item.summary ? <Text style={styles.summary}>{item.summary}</Text> : null}
    </View>
  );

  const renderEmpty = () => {
    if (loading) {
      return null;
    }

    if (error) {
      return (
        <View style={styles.stateContainer}>
          <Text style={styles.stateTitle}>加载失败</Text>
          <Text style={styles.stateDescription}>{error}</Text>
          <Pressable style={styles.primaryButton} onPress={onRetry}>
            <Text style={styles.primaryButtonText}>重试</Text>
          </Pressable>
        </View>
      );
    }

    return (
      <View style={styles.stateContainer}>
        <Text style={styles.stateTitle}>暂无企业信息</Text>
        <Text style={styles.stateDescription}>企业名单更新后会展示在这里</Text>
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>企业名单</Text>
        <Text style={styles.subtitle}>独立展示商会企业名录，方便快速浏览基础信息</Text>
      </View>

      {loading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#1677FF" />
          <Text style={styles.loadingText}>正在加载企业名单...</Text>
        </View>
      ) : (
        <FlatList
          data={companies}
          renderItem={renderItem}
          keyExtractor={(item) => item.id}
          contentContainerStyle={companies.length === 0 ? styles.listEmptyContent : styles.listContent}
          refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
          ListEmptyComponent={renderEmpty}
        />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F7FA',
  },
  header: {
    paddingHorizontal: 16,
    paddingTop: 12,
    paddingBottom: 8,
    gap: 6,
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    color: '#1F2329',
  },
  subtitle: {
    fontSize: 14,
    lineHeight: 20,
    color: '#4E5969',
  },
  loadingContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 12,
  },
  loadingText: {
    color: '#4E5969',
    fontSize: 14,
  },
  listContent: {
    paddingHorizontal: 16,
    paddingBottom: 20,
  },
  listEmptyContent: {
    flexGrow: 1,
    paddingHorizontal: 16,
    paddingBottom: 20,
  },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOpacity: 0.04,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 2 },
    elevation: 1,
  },
  name: {
    fontSize: 17,
    fontWeight: '700',
    color: '#1F2329',
  },
  industry: {
    marginTop: 8,
    fontSize: 14,
    color: '#1677FF',
  },
  contact: {
    marginTop: 8,
    fontSize: 13,
    color: '#4E5969',
  },
  summary: {
    marginTop: 8,
    fontSize: 13,
    lineHeight: 19,
    color: '#86909C',
  },
  stateContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 24,
  },
  stateTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1F2329',
    marginBottom: 8,
  },
  stateDescription: {
    fontSize: 14,
    color: '#4E5969',
    textAlign: 'center',
    lineHeight: 20,
    marginBottom: 16,
  },
  primaryButton: {
    backgroundColor: '#1677FF',
    borderRadius: 12,
    paddingHorizontal: 18,
    paddingVertical: 10,
  },
  primaryButtonText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '600',
  },
});
