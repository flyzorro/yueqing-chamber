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
  filters?: {
    keyword?: string;
    status?: string;
    industry?: string;
  };
  pagination?: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
  error?: string;
}

interface IndustriesResponse {
  success: boolean;
  data: string[];
  error?: string;
}

export const COMPANY_PAGE_SIZE = 20;

export default function CompaniesScreen() {
  const [companies, setCompanies] = useState<Company[]>([]);
  const [industries, setIndustries] = useState<string[]>([]);
  const [selectedIndustry, setSelectedIndustry] = useState<string>('all');
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState('');

  const fetchIndustries = useCallback(async () => {
    try {
      const response = await fetch(API.COMPANIES + '/industries');
      const json = (await response.json()) as IndustriesResponse;

      if (response.ok && json.success) {
        setIndustries(json.data);
      }
    } catch (err) {
      console.error('Failed to fetch industries:', err);
    }
  }, []);

  const fetchCompanies = useCallback(async (options?: { refresh?: boolean; industry?: string }) => {
    const refresh = options?.refresh ?? false;
    const industry = options?.industry || selectedIndustry;

    setError('');
    if (!refresh) {
      setLoading(true);
    }

    try {
      const params = new URLSearchParams({
        page: '1',
        limit: String(COMPANY_PAGE_SIZE),
      });

      if (industry && industry !== 'all') {
        params.set('industry', industry);
      }

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
  }, [selectedIndustry]);

  useEffect(() => {
    void fetchIndustries();
  }, [fetchIndustries]);

  useEffect(() => {
    void fetchCompanies();
  }, [fetchCompanies]);

  const handleIndustrySelect = useCallback((industry: string) => {
    setSelectedIndustry(industry);
  }, []);

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
        {selectedIndustry !== 'all' ? (
          <Text style={styles.stateDescription}>
            当前筛选条件：{selectedIndustry}
            {'\n'}试试选择"全部"或其他行业
          </Text>
        ) : (
          <Text style={styles.stateDescription}>企业名单更新后会展示在这里</Text>
        )}
      </View>
    );
  };

  const allFilterItem = (
    <Pressable
      key="all"
      style={[
        styles.filterChip,
        selectedIndustry === 'all' && styles.filterChipSelected,
      ]}
      onPress={() => handleIndustrySelect('all')}
    >
      <Text
        style={[
          styles.filterChipText,
          selectedIndustry === 'all' && styles.filterChipTextSelected,
        ]}
      >
        全部
      </Text>
    </Pressable>
  );

  const industryFilterItems = industries.map((industry) => (
    <Pressable
      key={industry}
      style={[
        styles.filterChip,
        selectedIndustry === industry && styles.filterChipSelected,
      ]}
      onPress={() => handleIndustrySelect(industry)}
    >
      <Text
        style={[
          styles.filterChipText,
          selectedIndustry === industry && styles.filterChipTextSelected,
        ]}
      >
        {industry}
      </Text>
    </Pressable>
  ));

  const renderFilters = () => (
    <View style={styles.filtersContent}>
      {allFilterItem}
      {industryFilterItems}
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>企业名单</Text>
        <Text style={styles.subtitle}>按行业分类展示商会企业名录</Text>
      </View>

      <View style={styles.filtersContainer}>
        {renderFilters()}
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
  filtersContainer: {
    paddingHorizontal: 16,
    paddingBottom: 12,
  },
  filtersContent: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  filterChip: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 999,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E5E6EB',
    marginRight: 8,
  },
  filterChipSelected: {
    backgroundColor: '#E8F3FF',
    borderColor: '#1677FF',
  },
  filterChipText: {
    fontSize: 14,
    color: '#4E5969',
  },
  filterChipTextSelected: {
    color: '#1677FF',
    fontWeight: '600',
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
