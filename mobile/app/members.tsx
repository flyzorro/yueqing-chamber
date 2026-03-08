import { useState, useEffect } from 'react';
import { View, Text, FlatList, StyleSheet, RefreshControl, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

interface Member {
  id: string;
  name: string;
  company: string;
  position?: string;
  status: string;
}

export default function MembersScreen() {
  const [members, setMembers] = useState<Member[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);

  const fetchMembers = async (pageNum: number, refresh = false) => {
    try {
      const response = await fetch(`http://localhost:3000/api/members?page=${pageNum}&limit=10`);
      const json = await response.json();
      
      if (json.success) {
        setMembers(refresh ? json.data : [...members, ...json.data]);
        setHasMore(json.data.length === 10);
      }
    } catch (error) {
      console.error('Failed to fetch members:', error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchMembers(1);
  }, []);

  const onRefresh = () => {
    setRefreshing(true);
    setPage(1);
    fetchMembers(1, true);
  };

  const onLoadMore = () => {
    if (hasMore && !loading) {
      const nextPage = page + 1;
      setPage(nextPage);
      fetchMembers(nextPage);
    }
  };

  const renderItem = ({ item }: { item: Member }) => (
    <View style={styles.card}>
      <Text style={styles.name}>{item.name}</Text>
      <Text style={styles.company}>{item.company}</Text>
      {item.position && <Text style={styles.position}>{item.position}</Text>}
      <Text style={[styles.status, { color: item.status === 'active' ? '#4CAF50' : '#999' }]}>
        {item.status === 'active' ? '活跃' : '非活跃'}
      </Text>
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
        data={members}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
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
  name: { fontSize: 18, fontWeight: 'bold' },
  company: { fontSize: 14, color: '#666', marginTop: 4 },
  position: { fontSize: 12, color: '#999', marginTop: 2 },
  status: { fontSize: 12, marginTop: 8 },
});