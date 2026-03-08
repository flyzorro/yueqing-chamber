import { useState, useEffect } from 'react';
import { View, Text, FlatList, StyleSheet, RefreshControl, ActivityIndicator, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { API } from './utils/api';

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
  const [activities, setActivities] = useState<Activity[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);

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
        setActivities(refresh ? newActivities : [...activities, ...newActivities]);
        setHasMore(json.data.length === 10);
      }
    } catch (error) {
      console.error('Failed to fetch activities:', error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const register = async (id: string) => {
    try {
      const response = await fetch(`${API.ACTIVITIES}/${id}/register`, { method: 'POST' });
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
  );

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <ActivityIndicator size="large" color="#007AFF" />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <FlatList
        data={activities}
        renderItem={renderItem}
        keyExtractor={(item) => item.uniqueId || item.id}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
        onEndReached={onLoadMore}
        onEndReachedThreshold={0.5}
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
});