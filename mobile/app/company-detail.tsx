import { useLocalSearchParams, Stack } from 'expo-router';
import {
  ActivityIndicator,
  Animated,
  Dimensions,
  FlatList,
  Image,
  Linking,
  Modal,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { API } from './utils/api';
import { useCallback, useEffect, useRef, useState } from 'react';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

const SEGMENTS = ['企业介绍', '产品介绍', '联系方式'] as const;

type Block =
  | { type: 'heading'; level: 1 | 2 | 3; text: string }
  | { type: 'paragraph'; text: string }
  | { type: 'image'; url: string; caption?: string }
  | { type: 'video'; url: string; poster?: string }
  | { type: 'gallery'; images: { url: string; caption?: string }[] }
  | { type: 'divider' };

function isSafeUrl(url: string): boolean {
  try {
    const parsed = new URL(url);
    return parsed.protocol === 'http:' || parsed.protocol === 'https:';
  } catch {
    return false;
  }
}

function renderBlock(block: Block, index: number): React.ReactElement | null {
  switch (block.type) {
    case 'heading': {
      const fontSize = block.level === 1 ? 22 : block.level === 2 ? 18 : 16;
      const fontWeight = block.level === 1 ? '700' : '600';
      const marginTop = block.level === 1 ? 16 : block.level === 2 ? 14 : 12;
      return (
        <Text key={index} style={[styles.blockHeading, { fontSize, fontWeight, marginTop }]}>
          {block.text}
        </Text>
      );
    }
    case 'paragraph':
      return (
        <Text key={index} style={styles.blockParagraph}>
          {block.text}
        </Text>
      );
    case 'image':
      if (!isSafeUrl(block.url)) return <View key={index} />;
      return (
        <View key={index} style={styles.blockImageContainer}>
          <Image
            source={{ uri: block.url }}
            style={styles.blockImage}
            resizeMode="cover"
          />
          {block.caption && (
            <Text style={styles.blockCaption}>{block.caption}</Text>
          )}
        </View>
      );
    case 'video': {
      if (!isSafeUrl(block.url)) return <View key={index} />;
      return (
        <TouchableOpacity
          key={index}
          style={styles.blockVideoContainer}
          onPress={() => Linking.openURL(block.url)}
        >
          <Image
            source={{ uri: block.poster || block.url }}
            style={styles.blockVideoPoster}
            resizeMode="cover"
          />
          <View style={styles.blockVideoPlayIcon}>
            <Text style={styles.blockVideoPlayText}>▶</Text>
          </View>
        </TouchableOpacity>
      );
    }
    case 'gallery':
      return (
        <FlatList
          key={index}
          data={block.images}
          horizontal
          showsHorizontalScrollIndicator={false}
          windowSize={3}
          keyExtractor={(item, i) => `${item.url}-${i}`}
          renderItem={({ item }) => (
            <View style={styles.galleryItem}>
              {isSafeUrl(item.url) ? (
                <Image
                  source={{ uri: item.url }}
                  style={styles.galleryImage}
                  resizeMode="cover"
                />
              ) : null}
              {item.caption && (
                <Text style={styles.blockCaption}>{item.caption}</Text>
              )}
            </View>
          )}
          style={styles.blockGallery}
        />
      );
    case 'divider':
      return <View key={index} style={styles.blockDivider} />;
    default:
      return null;
  }
}

interface ProductItem {
  id: string;
  name: string;
  description: string | null;
  imageUrl: string | null;
}

interface ProductListResponse {
  success: boolean;
  data: ProductItem[];
  error: string | null;
}

interface CompanyDetailResponse {
  success: boolean;
  data: {
    id: string;
    name: string;
    industry?: string | null;
    contactName?: string | null;
    contactPhone?: string | null;
    summary?: Block[] | null;
    address?: string | null;
    status?: string | null;
  };
  error?: string;
}

export default function CompanyDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const [company, setCompany] = useState<CompanyDetailResponse['data'] | null>(null);
  const [companyLoading, setCompanyLoading] = useState(true);
  const [companyError, setCompanyError] = useState('');

  const [selectedIndex, setSelectedIndex] = useState(0);
  const indicatorAnim = useRef(new Animated.Value(0)).current;
  const segmentWidth = SCREEN_WIDTH - 32;

  const [products, setProducts] = useState<ProductItem[]>([]);
  const [productsLoading, setProductsLoading] = useState(false);
  const [productsError, setProductsError] = useState('');
  const [hasFetchedProducts, setHasFetchedProducts] = useState(false);
  const [productModalVisible, setProductModalVisible] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<ProductItem | null>(null);

  // Fetch company data
  useEffect(() => {
    if (!id) {
      setCompanyError('缺少企业 ID');
      setCompanyLoading(false);
      return;
    }

    const fetchCompany = async () => {
      try {
        const response = await fetch(`${API.COMPANIES}/${id}`);
        const json: CompanyDetailResponse = await response.json();

        if (response.ok && json.success) {
          setCompany(json.data);
        } else {
          setCompanyError(json.error || '获取企业详情失败');
        }
      } catch {
        setCompanyError('网络错误，请稍后重试');
      } finally {
        setCompanyLoading(false);
      }
    };

    void fetchCompany();
  }, [id]);

  // Fetch products when tab switches to 产品介绍
  const fetchProducts = useCallback(async () => {
    if (!id || hasFetchedProducts) return;
    setHasFetchedProducts(true);
    setProductsLoading(true);
    setProductsError('');
    try {
      const response = await fetch(API.COMPANY_PRODUCTS(id));
      const json: ProductListResponse = await response.json();
      if (response.ok && json.success) {
        setProducts(json.data);
      } else if (response.status === 404) {
        setProductsError('企业不存在');
      } else {
        setProductsError('获取产品列表失败');
      }
    } catch {
      setProductsError('网络错误，请稍后重试');
    } finally {
      setProductsLoading(false);
    }
  }, [id, hasFetchedProducts]);

  useEffect(() => {
    if (selectedIndex === 1) {
      fetchProducts();
    }
  }, [selectedIndex, fetchProducts]);

  const handleRetry = () => {
    setHasFetchedProducts(false);
    setProducts([]);
    fetchProducts();
  };

  const handleSegmentPress = (index: number) => {
    Animated.spring(indicatorAnim, {
      toValue: index,
      useNativeDriver: false,
      friction: 8,
      tension: 100,
    }).start();
    setSelectedIndex(index);
  };

  const handleProductPress = (product: ProductItem) => {
    setSelectedProduct(product);
    setProductModalVisible(true);
  };

  const renderSummaryContent = () => {
    const blocks = company?.summary;
    if (!blocks || blocks.length === 0) {
      return <Text style={styles.emptyText}>暂无详细介绍</Text>;
    }
    return blocks.map((block, i) => renderBlock(block, i));
  };

  const renderTabContent = () => {
    switch (selectedIndex) {
      case 0: // 企业介绍
        return <View style={styles.tabContent}>{renderSummaryContent()}</View>;

      case 1: // 产品介绍
        if (productsLoading) {
          return (
            <View style={styles.centerContent}>
              <ActivityIndicator size="large" color="#1677FF" />
              <Text style={styles.loadingText}>加载中...</Text>
            </View>
          );
        }
        if (productsError) {
          return (
            <View style={styles.centerContent}>
              <Text style={styles.errorText}>{productsError}</Text>
              <Pressable style={styles.retryButton} onPress={handleRetry}>
                <Text style={styles.retryButtonText}>重试</Text>
              </Pressable>
            </View>
          );
        }
        if (products.length === 0) {
          return (
            <View style={styles.centerContent}>
              <Text style={styles.emptyText}>暂无产品信息</Text>
            </View>
          );
        }
        return (
          <FlatList
            data={products}
            keyExtractor={(item) => item.id}
            scrollEnabled={false}
            renderItem={({ item }) => (
              <TouchableOpacity
                style={styles.productCard}
                onPress={() => handleProductPress(item)}
                activeOpacity={0.7}
              >
                {item.imageUrl && (
                  <Image source={{ uri: item.imageUrl }} style={styles.productImage} resizeMode="cover" />
                )}
                <View style={styles.productInfo}>
                  <Text style={styles.productName}>{item.name}</Text>
                  {item.description && (
                    <Text style={styles.productDescription} numberOfLines={2}>
                      {item.description}
                    </Text>
                  )}
                </View>
              </TouchableOpacity>
            )}
            ItemSeparatorComponent={ProductSeparator}
          />
        );

      case 2: // 联系方式
        return (
          <View style={styles.tabContent}>
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>联系人</Text>
              <Text style={styles.infoValue}>{company?.contactName || '暂无'}</Text>
            </View>
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>联系电话</Text>
              <Text style={styles.infoValue}>{company?.contactPhone || '暂无'}</Text>
            </View>
            {company?.address && (
              <View style={styles.infoRow}>
                <Text style={styles.infoLabel}>地址</Text>
                <Text style={[styles.infoValue, { flex: 1, textAlign: 'right' }]}>{company.address}</Text>
              </View>
            )}
          </View>
        );

      default:
        return null;
    }
  };

  if (companyLoading) {
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

  if (companyError || !company) {
    return (
      <SafeAreaView style={styles.container}>
        <Stack.Screen options={{ title: '企业详情' }} />
        <View style={styles.centerContainer}>
          <Text style={styles.errorText}>{companyError || '企业不存在'}</Text>
        </View>
      </SafeAreaView>
    );
  }

  const indicatorLeft = indicatorAnim.interpolate({
    inputRange: [0, 1, 2],
    outputRange: [0, segmentWidth / 3, (segmentWidth / 3) * 2],
  });

  return (
    <SafeAreaView style={styles.container}>
      <Stack.Screen options={{ title: company.name }} />
      <ScrollView contentContainerStyle={styles.content}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.name}>{company.name}</Text>
          {company.industry && (
            <View style={styles.industryTag}>
              <Text style={styles.industryText}>{company.industry}</Text>
            </View>
          )}
        </View>

        {/* SegmentedControl */}
        <View style={styles.segmentContainer}>
          <Animated.View style={[styles.indicator, { left: indicatorLeft, width: segmentWidth / 3 }]} />
          {SEGMENTS.map((label, i) => (
            <Pressable
              key={label}
              style={styles.segment}
              onPress={() => handleSegmentPress(i)}
              accessibilityRole="button"
            >
              <Text style={[styles.segmentText, i === selectedIndex && styles.segmentTextActive]}>
                {label}
                {i === 1 && products.length > 0 ? `(${products.length})` : ''}
              </Text>
            </Pressable>
          ))}
        </View>

        {/* Tab content */}
        <View style={styles.tabWrapper}>{renderTabContent()}</View>
      </ScrollView>

      {/* Product Detail Modal */}
      <Modal
        visible={productModalVisible}
        animationType="slide"
        presentationStyle="pageSheet"
        onRequestClose={() => setProductModalVisible(false)}
      >
        <SafeAreaView style={styles.modalContainer}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>{selectedProduct?.name}</Text>
            <TouchableOpacity
              style={styles.modalCloseButton}
              onPress={() => setProductModalVisible(false)}
              accessibilityLabel="关闭"
              accessibilityRole="button"
            >
              <Text style={styles.modalCloseText}>✕</Text>
            </TouchableOpacity>
          </View>
          <ScrollView style={styles.modalBody}>
            {selectedProduct?.imageUrl && (
              <Image
                source={{ uri: selectedProduct.imageUrl }}
                style={styles.modalImage}
                resizeMode="cover"
              />
            )}
            <Text style={styles.modalDescription}>
              {selectedProduct?.description || '暂无产品描述'}
            </Text>
          </ScrollView>
        </SafeAreaView>
      </Modal>
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
    marginBottom: 12,
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
  segmentContainer: {
    flexDirection: 'row',
    backgroundColor: '#F2F3F5',
    borderRadius: 8,
    padding: 2,
    position: 'relative',
    marginBottom: 16,
  },
  indicator: {
    position: 'absolute',
    top: 2,
    bottom: 2,
    backgroundColor: '#FFFFFF',
    borderRadius: 6,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  segment: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 8,
    zIndex: 1,
  },
  segmentText: {
    fontSize: 14,
    color: '#86909C',
    fontWeight: '400',
  },
  segmentTextActive: {
    color: '#1F2329',
    fontWeight: '600',
  },
  tabWrapper: {
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    padding: 16,
    minHeight: 200,
  },
  tabContent: {
    minHeight: 200,
  },
  centerContent: {
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 200,
    paddingVertical: 40,
  },
  emptyText: {
    color: '#86909C',
    fontSize: 14,
    textAlign: 'center',
  },
  retryButton: {
    marginTop: 12,
    backgroundColor: '#1677FF',
    borderRadius: 12,
    paddingHorizontal: 24,
    paddingVertical: 10,
  },
  retryButtonText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '600',
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
    color: '#6B7280',
  },
  infoValue: {
    fontSize: 14,
    color: '#1F2329',
  },
  productCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOpacity: 0.04,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 2 },
    elevation: 1,
  },
  productImage: {
    width: '100%',
    height: 160,
    backgroundColor: '#F2F3F5',
  },
  productInfo: {
    padding: 12,
  },
  productName: {
    fontSize: 15,
    fontWeight: '600',
    color: '#1F2329',
    marginBottom: 4,
  },
  productDescription: {
    fontSize: 13,
    color: '#6B7280',
    lineHeight: 20,
  },
  // Block renderer styles
  blockHeading: {
    fontSize: 22,
    fontWeight: '700',
    color: '#1F2329',
    marginTop: 16,
  },
  blockParagraph: {
    fontSize: 14,
    color: '#4E5969',
    lineHeight: 22,
    marginBottom: 10,
  },
  blockImageContainer: {
    marginBottom: 8,
  },
  blockImage: {
    width: '100%',
    borderRadius: 8,
    height: 200,
    backgroundColor: '#F2F3F5',
  },
  blockCaption: {
    fontSize: 12,
    color: '#86909C',
    textAlign: 'center',
    marginTop: 6,
  },
  blockVideoContainer: {
    position: 'relative',
    marginBottom: 8,
    borderRadius: 8,
    overflow: 'hidden',
  },
  blockVideoPoster: {
    width: '100%',
    height: 200,
    backgroundColor: '#1F2329',
  },
  blockVideoPlayIcon: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: [{ translateX: -20 }, { translateY: -20 }],
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(0,0,0,0.6)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  blockVideoPlayText: {
    color: '#FFFFFF',
    fontSize: 16,
  },
  blockGallery: {
    marginBottom: 8,
  },
  galleryItem: {
    marginRight: 8,
  },
  galleryImage: {
    width: 120,
    height: 120,
    borderRadius: 8,
    backgroundColor: '#F2F3F5',
  },
  blockDivider: {
    height: 1,
    backgroundColor: '#F2F3F5',
    marginVertical: 12,
  },
  // Product Modal styles
  modalContainer: {
    flex: 1,
    backgroundColor: '#F5F7FA',
  },
  modalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: '#F2F3F5',
  },
  modalTitle: {
    fontSize: 17,
    fontWeight: '600',
    color: '#1F2329',
    flex: 1,
  },
  modalCloseButton: {
    width: 30,
    height: 30,
    alignItems: 'center',
    justifyContent: 'center',
  },
  modalCloseText: {
    fontSize: 18,
    color: '#86909C',
  },
  modalBody: {
    flex: 1,
  },
  modalImage: {
    width: '100%',
    height: 300,
    backgroundColor: '#F2F3F5',
  },
  modalDescription: {
    fontSize: 15,
    color: '#4E5969',
    lineHeight: 24,
    padding: 16,
  },
});

const ProductSeparator = () => <View style={{ height: 12 }} />;
