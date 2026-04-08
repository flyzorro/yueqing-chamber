import { useState, useEffect } from 'react';
import { View, Text, FlatList, StyleSheet, ActivityIndicator, RefreshControl, Pressable } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { API } from './utils/api';
import { getAuthHeaders } from './utils/auth';

interface Member {
  id: string;
  name: string;
  company: string;
  position: string | null;
  phone: string;
}

interface Registration {
  id: string;
  member: Member;
  registeredAt: string;
}

export default function RegistrationsScreen() {
  const router = useRouter();
  const params = useLocalSearchParams<{
    activityId?: string;
    activityTitle?: string;
  }>();

  const [registrations, setRegistrations] = useState<Registration[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState('');

  const fetchRegistrations = async () => {
    if (!params.activityId) return;

    try {
      const headers = await getAuthHeaders();
      const response = await fetch(`${API.ACTIVITIES}/${params.activityId}/registrations`, {
        headers,
      });
      const json = await response.json();

      if (json.success) {
        setRegistrations(json.data);
        setError('');
      } else {
        setError(json.error || '加载失败');
      }
    } catch (error) {
      console.error('Failed to fetch registrations:', error);
      setError('加载报名者列表失败，请重试');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchRegistrations();
  }, []);

  const onRefresh = () => {
    setRefreshing(true);
    fetchRegistrations();
  };

  const renderItem = ({ item }: { item: Registration }) => (
    <View style={styles.memberCard}>
      <View style={styles.memberHeader}>
        <Ionicons name="person-circle" size={40} color="#007AFF" />
        <View style={styles.memberInfo}>
          <Text style={styles.memberName}>{item.member.name}</Text>
          <Text style={styles.memberCompany}>{item.member.company}</Text>
          {item.member.position ? (
            <Text style={styles.memberPosition}>{item.member.position}</Text>
          ) : null}
        </View>
      </View>
    </View>
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
          <Pressable style={styles.primaryButton} onPress={fetchRegistrations}>
            <Text style={styles.primaryButtonText}>重试</Text>
          </Pressable>
        </View>
      );
    }

    return (
      <View style={styles.stateContainer}>
        <Text style={styles.stateTitle}>暂无报名者</Text>
        <Text style={styles.stateDescription}>活动开始后，报名者将显示在此</Text>
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <FlatList
        data={registrations}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
        ListEmptyComponent={renderEmpty}
        contentContainerStyle={styles.listContent}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F5F5F5' },
  listContent: { paddingVertical: 8 },
  memberCard: {
    backgroundColor: 'white',
    marginHorizontal: 8,
    marginVertical: 4,
    padding: 16,
    borderRadius: 8,
  },
  memberHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  memberInfo: {
    flex: 1,
  },
  memberName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1F2329',
  },
  memberCompany: {
    fontSize: 14,
    color: '#666666',
    marginTop: 2,
  },
  memberPosition: {
    fontSize: 13,
    color: '#86909C',
    marginTop: 2,
  },
  stateContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 24,
    paddingVertical: 48,
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
  },
  primaryButton: {
    backgroundColor: '#007AFF',
    borderRadius: 12,
    paddingHorizontal: 18,
    paddingVertical: 10,
    marginTop: 16,
  },
  primaryButtonText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '600',
  },
});
