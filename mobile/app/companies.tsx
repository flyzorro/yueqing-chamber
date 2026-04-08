import { useRouter } from 'expo-router';
import { useCallback, useEffect, useRef, useState } from 'react';
import {
  ActivityIndicator,
  FlatList,
  Pressable,
  RefreshControl,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { API } from './utils/api';

type Block =
  | { type: 'heading'; level: 1 | 2 | 3; text: string }
  | { type: 'paragraph'; text: string }
  | { type: 'image'; url: string; caption?: string }
  | { type: 'video'; url: string; poster?: string }
  | { type: 'gallery'; images: { url: string; caption?: string }[] }
  | { type: 'divider' };

export interface Company {
  id: string;
  name: string;
  industry?: string | null;
  contactName?: string | null;
  contactPhone?: string | null;
  summary?: string | Block[] | null;
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

function parseSummaryText(summary: string | Block[] | null | undefined): string | null {
  if (!summary) return null;

  // If already an array of blocks, extract text from first paragraph
  if (Array.isArray(summary)) {
    const paragraphBlock = summary.find((block) => block.type === 'paragraph');
    if (paragraphBlock && 'text' in paragraphBlock) {
      return paragraphBlock.text.slice(0, 100) + (paragraphBlock.text.length > 100 ? '...' : '');
    }
    return null;
  }

  // If string, try to parse as JSON
  if (typeof summary === 'string') {
    try {
      const parsed = JSON.parse(summary) as Block[];
      if (Array.isArray(parsed)) {
        const paragraphBlock = parsed.find((block) => block.type === 'paragraph');
        if (paragraphBlock && 'text' in paragraphBlock) {
          return paragraphBlock.text.slice(0, 100) + (paragraphBlock.text.length > 100 ? '...' : '');
        }
      }
    } catch {
      // Not JSON, return as-is (truncated)
      return summary.length > 100 ? summary.slice(0, 100) + '...' : summary;
    }
  }

  return null;
}

export default function CompaniesScreen() {
  const router = useRouter();
  const [companies, setCompanies] = useState<Company[]>([]);
  const [industries, setIndustries] = useState<string[]>([]);
  const [selectedIndustry, setSelectedIndustry] = useState<string>('all');
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState('');
  const [searchText, setSearchText] = useState('');
  const [searchKeyword, setSearchKeyword] = useState('');
  const [totalCount, setTotalCount] = useState(0);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

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

  const fetchCompanies = useCallback(async (options?: { refresh?: boolean; industry?: string; keyword?: string }) => {
    const refresh = options?.refresh ?? false;
    const industry = options?.industry || selectedIndustry;
    const keyword = options?.keyword ?? searchKeyword;

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

      if (keyword) {
        params.set('keyword', keyword);
      }

      const response = await fetch(`${API.COMPANIES}?${params.toString()}`);
      const json = (await response.json()) as CompaniesResponse;

      if (!response.ok || !json.success) {
        throw new Error(json.error || '加载企业名单失败');
      }

      setCompanies(json.data || []);
      setTotalCount(json.pagination?.total ?? json.data.length);
    } catch (fetchError) {
      const message = fetchError instanceof Error ? fetchError.message : '加载企业名单失败';
      setError(message);
      setCompanies([]);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [selectedIndustry, searchKeyword]);

  useEffect(() => {
    void fetchIndustries();
  }, [fetchIndustries]);

  useEffect(() => {
    void fetchCompanies();
  }, [fetchCompanies]);

  const handleIndustrySelect = useCallback((industry: string) => {
    setSelectedIndustry(industry);
  }, []);

  const handleSearchChange = useCallback((text: string) => {
    setSearchText(text);
    if (debounceRef.current) {
      clearTimeout(debounceRef.current);
    }
    debounceRef.current = setTimeout(() => {
      setSearchKeyword(text);
      setTotalCount(0);
    }, 300);
  }, []);

  const clearSearch = useCallback(() => {
    setSearchText('');
    setSearchKeyword('');
    setTotalCount(0);
    if (debounceRef.current) {
      clearTimeout(debounceRef.current);
      debounceRef.current = null;
    }
  }, []);

  const onRefresh = () => {
    setRefreshing(true);
    void fetchCompanies({ refresh: true });
  };

  const onRetry = () => {
    void fetchCompanies();
  };

  const renderItem = ({ item }: { item: Company }) => {
    const summaryText = parseSummaryText(item.summary);

    return (
      <Pressable style={({ pressed }) => [styles.card, pressed && styles.cardPressed]} onPress={() => router.push(`/company-detail?id=${item.id}`)}>
        <Text style={styles.name}>{item.name}</Text>
        {item.industry ? <Text style={styles.industry}>{item.industry}</Text> : null}
        {(item.contactName || item.contactPhone) ? (
          <Text style={styles.contact}>
            联系人：{item.contactName || '暂无'}
            {item.contactPhone ? ` · ${item.contactPhone}` : ''}
          </Text>
        ) : null}
        {summaryText ? <Text style={styles.summary}>{summaryText}</Text> : null}
      </Pressable>
    );
  };

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
        <Text style={styles.stateTitle}>未找到相关企业</Text>
        <Text style={styles.stateDescription} accessibilityLabel={searchKeyword ? `未找到包含${searchKeyword}的企业` : undefined}>
          {searchKeyword
            ? `未找到包含「${searchKeyword}」的企业\n试试缩短关键词，或清除搜索恢复完整列表`
            : selectedIndustry !== 'all'
              ? `当前筛选条件：${selectedIndustry}\n试试选择「全部」或其他行业`
              : '企业名单更新后会展示在这里'}
        </Text>
        {searchKeyword ? (
          <Pressable style={styles.primaryButton} onPress={clearSearch}>
            <Text style={styles.primaryButtonText}>清除搜索</Text>
          </Pressable>
        ) : selectedIndustry !== 'all' ? (
          <Pressable style={styles.primaryButton} onPress={() => handleIndustrySelect('all')}>
            <Text style={styles.primaryButtonText}>查看全部企业</Text>
          </Pressable>
        ) : null}
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
      accessibilityLabel={`筛选: 全部${selectedIndustry === 'all' ? '，已选中' : ''}`}
      accessibilityState={{ selected: selectedIndustry === 'all' }}
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
      accessibilityLabel={`筛选: ${industry}${selectedIndustry === industry ? '，已选中' : ''}`}
      accessibilityState={{ selected: selectedIndustry === industry }}
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
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={styles.filtersContent}
    >
      {allFilterItem}
      {industryFilterItems}
    </ScrollView>
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>企业名单</Text>
        <Text style={styles.subtitle}>按行业分类展示商会企业名录</Text>
      </View>

      <View style={styles.searchBarContainer}>
        <TextInput
          style={styles.searchInput}
          placeholder="搜索企业名称或行业"
          placeholderTextColor="#86909C"
          value={searchText}
          onChangeText={handleSearchChange}
          accessibilityLabel="搜索企业名称或行业"
          accessibilityHint="输入后自动搜索"
          returnKeyType="search"
        />
        {searchText.length > 0 && (
          <Pressable
            onPress={clearSearch}
            accessibilityLabel="清除搜索"
            accessibilityRole="button"
            style={styles.searchClearButton}
          >
            <Text style={styles.searchClearText}>×</Text>
          </Pressable>
        )}
      </View>
      {searchKeyword.length > 0 && totalCount > 0 && !loading && (
        <Text style={styles.resultCount} accessibilityLiveRegion="polite">
          找到 {totalCount} 家企业
        </Text>
      )}

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
          keyboardShouldPersistTaps="handled"
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
  searchBarContainer: {
    marginHorizontal: 16,
    marginBottom: 4,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E5E6EB',
    paddingHorizontal: 12,
  },
  searchInput: {
    flex: 1,
    height: 40,
    fontSize: 14,
    color: '#1F2329',
  },
  searchClearButton: {
    padding: 4,
  },
  searchClearText: {
    fontSize: 20,
    color: '#86909C',
    lineHeight: 22,
  },
  resultCount: {
    fontSize: 13,
    color: '#4E5969',
    marginHorizontal: 16,
    marginBottom: 8,
  },
  filtersContainer: {
    paddingVertical: 12,
  },
  filtersContent: {
    flexDirection: 'row',
    gap: 8,
    paddingHorizontal: 16,
  },
  filterChip: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 999,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E5E6EB',
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
  cardPressed: {
    opacity: 0.7,
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
