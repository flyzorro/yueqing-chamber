import { useCallback, useEffect, useState } from 'react';
import {
  ActivityIndicator,
  FlatList,
  Pressable,
  RefreshControl,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { API } from './utils/api';

type CivilServantStatus = 'all' | 'active' | 'inactive';

interface CivilServant {
  id: string;
  name: string;
  department?: string | null;
  position?: string | null;
  phone?: string | null;
  email?: string | null;
  status?: string | null;
}

interface CivilServantsResponse {
  success: boolean;
  data: CivilServant[];
  filters?: {
    keyword?: string;
    status?: CivilServantStatus;
  };
  pagination?: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
  error?: string;
}

const PAGE_SIZE = 10;
const STATUS_OPTIONS: Array<{ label: string; value: CivilServantStatus }> = [
  { label: '全部', value: 'all' },
  { label: '在职', value: 'active' },
  { label: '非在职', value: 'inactive' },
];

export default function CivilServantsScreen() {
  const [civilServants, setCivilServants] = useState<CivilServant[]>([]);
  const [keywordInput, setKeywordInput] = useState('');
  const [keyword, setKeyword] = useState('');
  const [status, setStatus] = useState<CivilServantStatus>('all');
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState('');
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);

  const fetchCivilServants = useCallback(
    async (pageNum: number, options?: { refresh?: boolean }) => {
      const refresh = options?.refresh ?? false;

      if (pageNum === 1) {
        setError('');
        if (!refresh) {
          setLoading(true);
        }
      }

      try {
        const params = new URLSearchParams({
          page: String(pageNum),
          limit: String(PAGE_SIZE),
        });

        if (keyword.trim()) {
          params.set('keyword', keyword.trim());
        }

        if (status !== 'all') {
          params.set('status', status);
        }

        const response = await fetch(`${API.CIVIL_SERVANTS}?${params.toString()}`);
        const json = (await response.json()) as CivilServantsResponse;

        if (!response.ok || !json.success) {
          throw new Error(json.error || '加载公务员名单失败');
        }

        const nextCivilServants = json.data || [];
        setCivilServants((prev) => (pageNum === 1 ? nextCivilServants : [...prev, ...nextCivilServants]));
        setPage(pageNum);

        const totalPages = json.pagination?.totalPages ?? pageNum;
        setHasMore(pageNum < totalPages);
      } catch (fetchError) {
        const message = fetchError instanceof Error ? fetchError.message : '加载公务员名单失败';
        setError(message);
        if (pageNum === 1) {
          setCivilServants([]);
          setHasMore(false);
        }
      } finally {
        setLoading(false);
        setRefreshing(false);
      }
    },
    [keyword, status]
  );

  useEffect(() => {
    void fetchCivilServants(1);
  }, [fetchCivilServants, keyword, status]);

  const applySearch = () => {
    setKeyword(keywordInput.trim());
  };

  const onRefresh = () => {
    setRefreshing(true);
    void fetchCivilServants(1, { refresh: true });
  };

  const onRetry = () => {
    void fetchCivilServants(1);
  };

  const renderItem = ({ item }: { item: CivilServant }) => (
    <View style={styles.card}>
      <Text style={styles.name}>{item.name}</Text>
      {item.department ? <Text style={styles.department}>{item.department}</Text> : null}
      {item.position ? <Text style={styles.position}>{item.position}</Text> : null}
      {(item.phone || item.email) ? (
        <View style={styles.contactInfo}>
          {item.phone ? <Text style={styles.contact}>{item.phone}</Text> : null}
          {item.email ? <Text style={styles.contact}>{item.email}</Text> : null}
        </View>
      ) : null}
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
        <Text style={styles.stateTitle}>暂无公务员信息</Text>
        <Text style={styles.stateDescription}>公务员名单更新后会展示在这里</Text>
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>公务员名单</Text>
        <Text style={styles.subtitle}>商会联系的公务员名录</Text>
      </View>

      <View style={styles.toolbar}>
        <TextInput
          value={keywordInput}
          onChangeText={setKeywordInput}
          onSubmitEditing={applySearch}
          returnKeyType="search"
          placeholder="搜索姓名、部门或职位"
          placeholderTextColor="#999"
          style={styles.searchInput}
        />
        <Pressable style={styles.searchButton} onPress={applySearch}>
          <Text style={styles.searchButtonText}>搜索</Text>
        </Pressable>
      </View>

      <View style={styles.filtersRow}>
        {STATUS_OPTIONS.map((option) => {
          const selected = option.value === status;
          return (
            <Pressable
              key={option.value}
              style={[styles.filterChip, selected && styles.filterChipSelected]}
              onPress={() => setStatus(option.value)}
            >
              <Text style={[styles.filterChipText, selected && styles.filterChipTextSelected]}>
                {option.label}
              </Text>
            </Pressable>
          );
        })}
      </View>

      {loading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#1677FF" />
          <Text style={styles.loadingText}>正在加载公务员名单...</Text>
        </View>
      ) : (
        <FlatList
          data={civilServants}
          renderItem={renderItem}
          keyExtractor={(item) => item.id}
          contentContainerStyle={civilServants.length === 0 ? styles.listEmptyContent : styles.listContent}
          refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
          onEndReached={() => {
            if (hasMore) {
              void fetchCivilServants(page + 1);
            }
          }}
          onEndReachedThreshold={0.2}
          ListEmptyComponent={renderEmpty}
          ListFooterComponent={
            hasMore && civilServants.length > 0 ? (
              <View style={styles.footerLoading}>
                <ActivityIndicator color="#1677FF" />
              </View>
            ) : null
          }
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
  toolbar: {
    flexDirection: 'row',
    gap: 8,
    paddingHorizontal: 16,
    paddingTop: 8,
    paddingBottom: 8,
  },
  searchInput: {
    flex: 1,
    height: 44,
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    paddingHorizontal: 14,
    fontSize: 15,
    color: '#1F2329',
    borderWidth: 1,
    borderColor: '#E5E6EB',
  },
  searchButton: {
    height: 44,
    paddingHorizontal: 16,
    borderRadius: 12,
    backgroundColor: '#1677FF',
    alignItems: 'center',
    justifyContent: 'center',
  },
  searchButtonText: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '600',
  },
  filtersRow: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    paddingBottom: 12,
    gap: 8,
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
  name: {
    fontSize: 17,
    fontWeight: '700',
    color: '#1F2329',
  },
  department: {
    marginTop: 8,
    fontSize: 14,
    color: '#1677FF',
  },
  position: {
    marginTop: 4,
    fontSize: 13,
    color: '#4E5969',
  },
  contactInfo: {
    marginTop: 8,
    gap: 4,
  },
  contact: {
    fontSize: 13,
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
  footerLoading: {
    paddingVertical: 16,
  },
});
