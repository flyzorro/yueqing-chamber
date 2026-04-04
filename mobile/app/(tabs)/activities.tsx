import { useState, useEffect } from 'react';
import { View, Text, FlatList, StyleSheet, RefreshControl, ActivityIndicator, TouchableOpacity, Pressable, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { API } from '../utils/api';
import { getAuthHeaders } from '../utils/auth';

interface Activity {
  id: string;
  uniqueId?: string;
  title: string;
  date: string;
  location: string;
  currentParticipants: number;
  maxParticipants: number;
}

export default function ActivitiesScreen() {
  const router = useRouter();
  const [activities, setActivities] = useState<Activity[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [error, setError] = useState('');

  const fetchActivities = async (pageNum: number, refresh = false) => {
    try {
      const response = await fetch(`${API.ACTIVITIES}?page=${pageNum}&limit=10`);
      const json = await response.json();

      if (json.success) {
        const currentPage = refresh ? 1 : pageNum;
        const newActivities = json.data.map((item: Activity, index: number) => ({
          ...item,
          uniqueId: `${item.id}_${currentPage}_${index}`
        }));
        setActivities(refresh ? newActivities : (prev) => [...prev, ...newActivities]);
        setHasMore(json.data.length === 10);
      }
    } catch (error) {
      console.error('Failed to fetch activities:', error);
      setError('加载活动列表失败，请重试');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const register = async (id: string) => {
    // Check if user is logged in
    const headers = await getAuthHeaders();
    if (!headers || !headers.Authorization) {
      Alert.alert('提示', '请先登录', [
        { text: '取消', style: 'cancel' },
        { text: '去登录', onPress: () => router.push('/login') },
      ]);
      return;
    }

    try {
      const authHeaders = await getAuthHeaders();
      const response = await fetch(`${API.ACTIVITIES}/${id}/register`, {
        method: 'POST',
        headers: authHeaders,
      });
      const json = await response.json();
      
      if (json.success) {
        alert('报名成功！');
        onRefresh();
      } else {
        alert(json.error || '报名失败');
      }
    } catch (error) {
      alert('报名失败');
    }
  };

  useEffect(() => {
    fetchActivities(1);
  }, []);

  const onRefresh = () => {
    setRefreshing(true);
    setPage(1);
    fetchActivities(1, true);
  };

  const onLoadMore = () => {
    if (hasMore && !loading) {
      const nextPage = page + 1;
      setPage(nextPage);
      fetchActivities(nextPage);
    }
  };

  const renderItem = ({ item }: { item: Activity }) => (
    <Pressable
      onPress={() => router.push({
        pathname: '/activity-detail',
        params: {
          id: item.id,
          title: item.title,
          date: item.date,
          location: item.location,
          currentParticipants: String(item.currentParticipants),
          maxParticipants: String(item.maxParticipants),
        },
      })}
      style={({ pressed }) => [{ opacity: pressed ? 0.7 : 1 }]}
    >
      <View style={styles.card}>
        <Text style={styles.title}>{item.title}</Text>
        <View style={styles.infoRow}>
          <Ionicons name="calendar" size={16} color="#666" />
          <Text style={styles.info}>{new Date(item.date).toLocaleDateString()}</Text>
        </View>
        <View style={styles.infoRow}>
          <Ionicons name="location" size={16} color="#666" />
          <Text style={styles.info}>{item.location}</Text>
        </View>
        <View style={styles.infoRow}>
          <Ionicons name="people" size={16} color="#666" />
          <Text style={styles.info}>{item.currentParticipants}/{item.maxParticipants}</Text>
        </View>
        <TouchableOpacity style={styles.button} onPress={() => register(item.id)}>
          <Text style={styles.buttonText}>报名</Text>
        </TouchableOpacity>
      </View>
    </Pressable>
  );

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <ActivityIndicator size="large" color="#007AFF" />
      </SafeAreaView>
    );
  }

  const renderEmpty = () => {
    if (error) {
      return (
        <View style={styles.stateContainer}>
          <Text style={styles.stateTitle}>加载失败</Text>
          <Text style={styles.stateDescription}>{error}</Text>
          <Pressable style={styles.primaryButton} onPress={onRefresh}>
            <Text style={styles.primaryButtonText}>重试</Text>
          </Pressable>
        </View>
      );
    }

    return (
      <View style={styles.stateContainer}>
        <Text style={styles.stateTitle}>暂无活动</Text>
        <Text style={styles.stateDescription}>暂无发布的活动</Text>
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <FlatList
        data={activities}
        renderItem={renderItem}
        keyExtractor={(item) => item.uniqueId || item.id}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
        onEndReached={onLoadMore}
        onEndReachedThreshold={0.5}
        ListEmptyComponent={renderEmpty}
        ListFooterComponent={hasMore ? <ActivityIndicator /> : null}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F5F5F5' },
  card: { backgroundColor: 'white', padding: 16, margin: 8, borderRadius: 8 },
  title: { fontSize: 18, fontWeight: 'bold' },
  infoRow: { flexDirection: 'row', alignItems: 'center', marginTop: 4 },
  info: { fontSize: 14, color: '#666', marginLeft: 6 },
  button: { backgroundColor: '#007AFF', padding: 12, borderRadius: 8, marginTop: 12 },
  buttonText: { color: 'white', textAlign: 'center', fontWeight: 'bold' },
  stateContainer: { flex: 1, alignItems: 'center', justifyContent: 'center', paddingHorizontal: 24 },
  stateTitle: { fontSize: 18, fontWeight: '700', color: '#1F2329', marginBottom: 8 },
  stateDescription: { fontSize: 14, color: '#4E5969', textAlign: 'center', lineHeight: 20, marginBottom: 16 },
  primaryButton: { backgroundColor: '#007AFF', borderRadius: 12, paddingHorizontal: 18, paddingVertical: 10 },
  primaryButtonText: { color: '#FFFFFF', fontSize: 14, fontWeight: '600' },
});
