import { useLocalSearchParams, useRouter } from 'expo-router';
import { useCallback, useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { API, fetchApi } from './utils/api';
import { Ionicons } from '@expo/vector-icons';

interface Information {
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
  data: Information;
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

export default function InformationDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const [info, setInfo] = useState<Information | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [currentUser, setCurrentUser] = useState<{ userId: string; phone: string } | null>(null);

  const fetchInfo = useCallback(async () => {
    if (!id) return;

    setError('');
    setLoading(true);

    try {
      const response = await fetch(`${API.INFORMATION}/${id}`);
      const json = (await response.json()) as InformationResponse;

      if (!response.ok || !json.success) {
        throw new Error(json.error || '加载信息详情失败');
      }

      setInfo(json.data);
    } catch (fetchError) {
      const message = fetchError instanceof Error ? fetchError.message : '加载信息详情失败';
      setError(message);
      setInfo(null);
    } finally {
      setLoading(false);
    }
  }, [id]);

  const loadCurrentUser = useCallback(async () => {
    try {
      const [token, userStr] = await Promise.all([
        AsyncStorage.getItem('yueqing_chamber_token'),
        AsyncStorage.getItem('yueqing_chamber_user'),
      ]);

      if (token && userStr) {
        const user = JSON.parse(userStr);
        setCurrentUser({ userId: user.id, phone: user.phone });
      }
    } catch {
      setCurrentUser(null);
    }
  }, []);

  useEffect(() => {
    void loadCurrentUser();
    void fetchInfo();
  }, [fetchInfo, loadCurrentUser]);

  const handleDelete = useCallback(async () => {
    if (!id) return;

    Alert.alert('确认删除', '确定要删除这条信息吗？此操作不可恢复。', [
      { text: '取消', style: 'cancel' },
      {
        text: '删除',
        style: 'destructive',
        onPress: async () => {
          try {
            await fetchApi(`${API.INFORMATION}/${id}`, { method: 'DELETE' });
            Alert.alert('成功', '信息已删除', [
              { text: '确定', onPress: () => router.back() },
            ]);
          } catch (deleteError) {
            console.error('Delete error:', deleteError);
            Alert.alert('错误', deleteError instanceof Error ? deleteError.message : '删除失败');
          }
        },
      },
    ]);
  }, [id, router]);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('zh-CN', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const canDelete = currentUser?.phone && ['13800138000', '13900139000'].includes(currentUser.phone);

  const renderContent = () => {
    if (loading) {
      return (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#1677FF" />
          <Text style={styles.loadingText}>正在加载...</Text>
        </View>
      );
    }

    if (error || !info) {
      return (
        <View style={styles.stateContainer}>
          <Ionicons name="alert-circle-outline" size={48} color="#86909C" />
          <Text style={styles.stateTitle}>加载失败</Text>
          <Text style={styles.stateDescription}>{error || '信息不存在'}</Text>
          <Pressable style={styles.primaryButton} onPress={fetchInfo}>
            <Text style={styles.primaryButtonText}>重试</Text>
          </Pressable>
        </View>
      );
    }

    const categoryLabel = CATEGORY_LABELS[info.category] || info.category;

    return (
      <ScrollView style={styles.content} contentContainerStyle={styles.contentPadding}>
        <View style={styles.header}>
          <Text style={styles.category}>{categoryLabel}</Text>
          <Text style={styles.date}>{formatDate(info.createdAt)}</Text>
        </View>

        <Text style={styles.title}>{info.title}</Text>

        <View style={styles.divider} />

        <Text style={styles.contentText}>{info.content}</Text>

        {(info.contactname || info.contactphone) && (
          <View style={styles.contactSection}>
            <Text style={styles.contactTitle}>联系信息</Text>
            {info.contactname && (
              <View style={styles.contactRow}>
                <Ionicons name="person-outline" size={16} color="#86909C" />
                <Text style={styles.contactText}>{info.contactname}</Text>
              </View>
            )}
            {info.contactphone && (
              <View style={styles.contactRow}>
                <Ionicons name="call-outline" size={16} color="#86909C" />
                <Text style={styles.contactText}>{info.contactphone}</Text>
              </View>
            )}
          </View>
        )}

        {canDelete && (
          <Pressable style={styles.deleteButton} onPress={handleDelete}>
            <Ionicons name="trash-outline" size={20} color="#FF3B30" />
            <Text style={styles.deleteButtonText}>删除信息</Text>
          </Pressable>
        )}
      </ScrollView>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.navHeader}>
        <Pressable onPress={() => router.back()} style={styles.backButton}>
          <Ionicons name="chevron-back" size={24} color="#1F2329" />
        </Pressable>
        <Text style={styles.navTitle}>信息详情</Text>
        <View style={styles.placeholder} />
      </View>

      {renderContent()}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F7FA',
  },
  navHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E6EB',
  },
  backButton: {
    padding: 4,
  },
  navTitle: {
    fontSize: 17,
    fontWeight: '600',
    color: '#1F2329',
  },
  placeholder: {
    width: 32,
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
  stateContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 24,
    gap: 12,
  },
  stateTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1F2329',
  },
  stateDescription: {
    fontSize: 14,
    color: '#4E5969',
    textAlign: 'center',
  },
  primaryButton: {
    backgroundColor: '#1677FF',
    borderRadius: 12,
    paddingHorizontal: 24,
    paddingVertical: 10,
    marginTop: 8,
  },
  primaryButtonText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '600',
  },
  content: {
    flex: 1,
  },
  contentPadding: {
    padding: 16,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
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
  title: {
    fontSize: 20,
    fontWeight: '700',
    color: '#1F2329',
    marginBottom: 16,
    lineHeight: 28,
  },
  divider: {
    height: 1,
    backgroundColor: '#E5E6EB',
    marginBottom: 16,
  },
  contentText: {
    fontSize: 15,
    color: '#1F2329',
    lineHeight: 24,
    marginBottom: 24,
  },
  contactSection: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
  },
  contactTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1F2329',
    marginBottom: 12,
  },
  contactRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginTop: 8,
  },
  contactText: {
    fontSize: 14,
    color: '#4E5969',
  },
  deleteButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: '#FFF2F0',
    borderRadius: 12,
    padding: 14,
    marginTop: 16,
    borderWidth: 1,
    borderColor: '#FFCCC7',
  },
  deleteButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#FF3B30',
  },
});
