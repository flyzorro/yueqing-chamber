import { useRouter } from 'expo-router';
import { useCallback, useEffect, useState } from 'react';
import {
  ActivityIndicator,
  FlatList,
  Pressable,
  RefreshControl,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { API, fetchApi } from './utils/api';
import AsyncStorage from '@react-native-async-storage/async-storage';

export interface Information {
  id: string;
  title: string;
  content: string;
  category: string;
  contactname: string | null;
  contactphone: string | null;
  publisherid: string;
  createdAt: string;
  updatedAt: string;
}

interface InformationResponse {
  success: boolean;
  data: Information[];
  filters?: {
    category?: string;
    keyword?: string;
  };
  pagination?: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
  error?: string;
}

const CATEGORY_LABELS: Record<string, string> = {
  product: '产品',
  technology: '技术',
  market: '市场',
  finance: '金融',
  talent: '人才',
  policy: '政策',
  other: '其他',
};

const INFO_PAGE_SIZE = 20;

export default function InformationScreen() {
  const router = useRouter();
  const [informations, setInformations] = useState<Information[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const fetchInformations = useCallback(async (options?: { refresh?: boolean; category?: string }) => {
    const refresh = options?.refresh ?? false;
    const category = options?.category || selectedCategory;

    setError('');
    if (!refresh) {
      setLoading(true);
    }

    try {
      const params = new URLSearchParams({
        page: '1',
        limit: String(INFO_PAGE_SIZE),
      });

      if (category && category !== 'all') {
        params.set('category', category);
      }

      const response = await fetch(`${API.INFORMATION}?${params.toString()}`);
      const json = (await response.json()) as InformationResponse;

      if (!response.ok || !json.success) {
        throw new Error(json.error || '加载信息列表失败');
      }

      setInformations(json.data || []);
    } catch (fetchError) {
      const message = fetchError instanceof Error ? fetchError.message : '加载信息列表失败';
      setError(message);
      setInformations([]);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [selectedCategory]);

  const checkLoginStatus = useCallback(async () => {
    try {
      const token = await AsyncStorage.getItem('yueqing_chamber_token');
      setIsLoggedIn(!!token);
    } catch {
      setIsLoggedIn(false);
    }
  }, []);

  useEffect(() => {
    void checkLoginStatus();
  }, [checkLoginStatus]);

  useEffect(() => {
    void fetchInformations();
  }, [fetchInformations]);

  const handleCategorySelect = useCallback((category: string) => {
    setSelectedCategory(category);
  }, []);

  const onRefresh = () => {
    setRefreshing(true);
    void fetchInformations({ refresh: true });
  };

  const onRetry = () => {
    void fetchInformations();
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('zh-CN', { year: 'numeric', month: '2-digit', day: '2-digit' });
  };

  const renderItem = ({ item }: { item: Information }) => {
    const categoryLabel = CATEGORY_LABELS[item.category] || item.category;

    return (
      <Pressable
        style={({ pressed }) => [styles.card, pressed && styles.cardPressed]}
        onPress={() => router.push(`/information-detail?id=${item.id}`)}
      >
        <View style={styles.cardHeader}>
          <Text style={styles.category}>{categoryLabel}</Text>
          <Text style={styles.date}>{formatDate(item.createdAt)}</Text>
        </View>
        <Text style={styles.cardTitle} numberOfLines={2}>
          {item.title}
        </Text>
        <Text style={styles.content} numberOfLines={3}>
          {item.content}
        </Text>
        {(item.contactname || item.contactphone) && (
          <View style={styles.contactRow}>
            {item.contactname && <Text style={styles.contact}>联系人：{item.contactname}</Text>}
            {item.contactphone && <Text style={styles.contact}>电话：{item.contactphone}</Text>}
          </View>
        )}
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
        <Text style={styles.stateTitle}>暂无信息</Text>
        <Text style={styles.stateDescription}>
          {selectedCategory !== 'all'
            ? `当前筛选条件：${CATEGORY_LABELS[selectedCategory]}\n试试选择「全部」或其他分类`
            : '信息更新后会展示在这里'}
        </Text>
        {selectedCategory !== 'all' && (
          <Pressable style={styles.primaryButton} onPress={() => handleCategorySelect('all')}>
            <Text style={styles.primaryButtonText}>查看全部</Text>
          </Pressable>
        )}
      </View>
    );
  };

  const categories = Object.keys(CATEGORY_LABELS);

  const allFilterItem = (
    <Pressable
      key="all"
      style={[styles.filterChip, selectedCategory === 'all' && styles.filterChipSelected]}
      onPress={() => handleCategorySelect('all')}
    >
      <Text style={[styles.filterChipText, selectedCategory === 'all' && styles.filterChipTextSelected]}>
        全部
      </Text>
    </Pressable>
  );

  const categoryFilterItems = categories.map((category) => (
    <Pressable
      key={category}
      style={[styles.filterChip, selectedCategory === category && styles.filterChipSelected]}
      onPress={() => handleCategorySelect(category)}
    >
      <Text
        style={[styles.filterChipText, selectedCategory === category && styles.filterChipTextSelected]}
      >
        {CATEGORY_LABELS[category]}
      </Text>
    </Pressable>
  ));

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <View style={styles.headerRow}>
          <View style={styles.headerLeft}>
            <Pressable
              onPress={() => router.back()}
              style={styles.backButton}
              accessibilityRole="button"
              accessibilityLabel="返回上一页"
              accessibilityHint="返回到上一个页面"
              hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
            >
              <Text style={styles.backButtonText}>‹ 返回</Text>
            </Pressable>
            <Text style={styles.title}>信息发布</Text>
          </View>
          {isLoggedIn && (
            <Pressable
              style={styles.createButton}
              onPress={() => router.push('/create-information')}
            >
              <Text style={styles.createButtonText}>发布</Text>
            </Pressable>
          )}
        </View>
        <Text style={styles.subtitle}>商机、供需与商会通知信息</Text>
      </View>

      <View style={styles.filtersContainer}>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.filtersContent}
        >
          {allFilterItem}
          {categoryFilterItems}
        </ScrollView>
      </View>

      {loading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#1677FF" />
          <Text style={styles.loadingText}>正在加载...</Text>
        </View>
      ) : (
        <FlatList
          data={informations}
          renderItem={renderItem}
          keyExtractor={(item) => item.id}
          contentContainerStyle={informations.length === 0 ? styles.listEmptyContent : styles.listContent}
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
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  backButton: {
    padding: 4,
  },
  backButtonText: {
    fontSize: 16,
    color: '#1677FF',
    fontWeight: '500',
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
  createButton: {
    backgroundColor: '#1677FF',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
  },
  createButtonText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '600',
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
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  category: {
    fontSize: 12,
    color: '#1677FF',
    backgroundColor: '#E8F3FF',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
    overflow: 'hidden',
  },
  date: {
    fontSize: 12,
    color: '#86909C',
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1F2329',
    marginBottom: 8,
  },
  content: {
    fontSize: 14,
    color: '#4E5969',
    lineHeight: 20,
    marginBottom: 8,
  },
  contactRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    marginTop: 8,
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: '#F0F0F0',
  },
  contact: {
    fontSize: 12,
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
