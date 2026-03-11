import { useCallback, useEffect, useMemo, useState } from 'react';
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

type MemberStatus = 'all' | 'active' | 'inactive';

interface Member {
  id: string;
  name: string;
  company: string;
  position?: string | null;
  status?: string | null;
}

interface MembersResponse {
  success: boolean;
  data: Member[];
  filters?: {
    keyword?: string;
    status?: MemberStatus;
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
const STATUS_OPTIONS: Array<{ label: string; value: MemberStatus }> = [
  { label: '全部', value: 'all' },
  { label: '活跃', value: 'active' },
  { label: '非活跃', value: 'inactive' },
];

export default function MembersScreen() {
  const [members, setMembers] = useState<Member[]>([]);
  const [keywordInput, setKeywordInput] = useState('');
  const [keyword, setKeyword] = useState('');
  const [status, setStatus] = useState<MemberStatus>('all');
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);
  const [error, setError] = useState('');
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);

  const queryString = useMemo(() => {
    const params = new URLSearchParams({
      page: '1',
      limit: String(PAGE_SIZE),
    });

    if (keyword.trim()) {
      params.set('keyword', keyword.trim());
    }

    if (status !== 'all') {
      params.set('status', status);
    }

    return params.toString();
  }, [keyword, status]);

  const fetchMembers = useCallback(
    async (pageNum: number, options?: { refresh?: boolean }) => {
      const refresh = options?.refresh ?? false;

      if (pageNum === 1) {
        setError('');
        if (!refresh) {
          setLoading(true);
        }
      } else {
        setLoadingMore(true);
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

        const response = await fetch(`${API.MEMBERS}?${params.toString()}`);
        const json = (await response.json()) as MembersResponse;

        if (!response.ok || !json.success) {
          throw new Error(json.error || '加载会员列表失败');
        }

        const nextMembers = json.data || [];
        setMembers((prev) => (pageNum === 1 ? nextMembers : [...prev, ...nextMembers]));
        setPage(pageNum);

        const totalPages = json.pagination?.totalPages ?? pageNum;
        setHasMore(pageNum < totalPages);
      } catch (fetchError) {
        const message = fetchError instanceof Error ? fetchError.message : '加载会员列表失败';
        setError(message);
        if (pageNum === 1) {
          setMembers([]);
          setHasMore(false);
        }
      } finally {
        setLoading(false);
        setRefreshing(false);
        setLoadingMore(false);
      }
    },
    [keyword, status]
  );

  useEffect(() => {
    void fetchMembers(1);
  }, [fetchMembers, queryString]);

  const applySearch = () => {
    setKeyword(keywordInput.trim());
  };

  const onRefresh = () => {
    setRefreshing(true);
    void fetchMembers(1, { refresh: true });
  };

  const onRetry = () => {
    void fetchMembers(1);
  };

  const onLoadMore = () => {
    if (loading || loadingMore || refreshing || !hasMore) {
      return;
    }

    void fetchMembers(page + 1);
  };

  const renderItem = ({ item }: { item: Member }) => {
    const isActive = item.status !== 'inactive';

    return (
      <View style={styles.card}>
        <View style={styles.cardHeader}>
          <Text style={styles.name}>{item.name}</Text>
          <View style={[styles.statusBadge, isActive ? styles.activeBadge : styles.inactiveBadge]}>
            <Text style={[styles.statusText, isActive ? styles.activeText : styles.inactiveText]}>
              {isActive ? '活跃' : '非活跃'}
            </Text>
          </View>
        </View>
        <Text style={styles.company}>{item.company}</Text>
        {item.position ? <Text style={styles.position}>{item.position}</Text> : null}
      </View>
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
        <Text style={styles.stateTitle}>暂无匹配会员</Text>
        <Text style={styles.stateDescription}>试试更换关键词或状态筛选</Text>
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.toolbar}>
        <TextInput
          value={keywordInput}
          onChangeText={setKeywordInput}
          onSubmitEditing={applySearch}
          returnKeyType="search"
          placeholder="搜索姓名或企业名"
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
          <Text style={styles.loadingText}>正在加载会员列表...</Text>
        </View>
      ) : (
        <FlatList
          data={members}
          renderItem={renderItem}
          keyExtractor={(item) => item.id}
          contentContainerStyle={members.length === 0 ? styles.listEmptyContent : styles.listContent}
          refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
          onEndReached={onLoadMore}
          onEndReachedThreshold={0.2}
          ListEmptyComponent={renderEmpty}
          ListFooterComponent={
            loadingMore ? (
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
  toolbar: {
    flexDirection: 'row',
    gap: 8,
    paddingHorizontal: 16,
    paddingTop: 12,
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
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 12,
  },
  name: {
    flex: 1,
    fontSize: 17,
    fontWeight: '700',
    color: '#1F2329',
  },
  company: {
    marginTop: 8,
    fontSize: 14,
    color: '#4E5969',
  },
  position: {
    marginTop: 4,
    fontSize: 13,
    color: '#86909C',
  },
  statusBadge: {
    borderRadius: 999,
    paddingHorizontal: 10,
    paddingVertical: 4,
  },
  activeBadge: {
    backgroundColor: '#E8FFEA',
  },
  inactiveBadge: {
    backgroundColor: '#F2F3F5',
  },
  statusText: {
    fontSize: 12,
    fontWeight: '600',
  },
  activeText: {
    color: '#16A34A',
  },
  inactiveText: {
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
