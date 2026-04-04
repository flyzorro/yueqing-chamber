import { useLocalSearchParams, useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Pressable, ScrollView, StyleSheet, Text, View, Image, FlatList, ActivityIndicator } from 'react-native';
import { useCallback, useEffect, useState } from 'react';
import { API } from './utils/api';
import { getAuthHeaders } from './utils/auth';

interface ActivityPhoto {
  id: string;
  activityId: string;
  imageUrl: string;
  caption: string | null;
  sortorder: number | null;
}

interface ActivityPhotosResponse {
  success: boolean;
  data: {
    activity: {
      id: string;
      title: string;
    };
    photos: ActivityPhoto[];
  };
  error?: string;
}

export default function ActivityDetailScreen() {
  const router = useRouter();
  const params = useLocalSearchParams<{
    id?: string;
    title?: string;
    date?: string;
    location?: string;
    currentParticipants?: string;
    maxParticipants?: string;
  }>();

  const [photos, setPhotos] = useState<ActivityPhoto[]>([]);
  const [loadingPhotos, setLoadingPhotos] = useState(false);

  const title = typeof params.title === 'string' ? params.title : '未命名活动';
  const date = typeof params.date === 'string' ? params.date : '日期待定';
  const location = typeof params.location === 'string' ? params.location : '地点待定';
  const current = typeof params.currentParticipants === 'string' ? params.currentParticipants : '0';
  const max = typeof params.maxParticipants === 'string' ? params.maxParticipants : '0';

  const fetchPhotos = useCallback(async () => {
    if (!params.id) return;

    setLoadingPhotos(true);
    try {
      const authHeaders = await getAuthHeaders();
      const response = await fetch(`${API.ACTIVITIES}/${params.id}/photos`, { headers: authHeaders });
      const json = (await response.json()) as ActivityPhotosResponse;

      if (response.ok && json.success) {
        setPhotos(json.data.photos || []);
      }
    } catch (error) {
      console.error('Fetch photos error:', error);
    } finally {
      setLoadingPhotos(false);
    }
  }, [params.id]);

  useEffect(() => {
    void fetchPhotos();
  }, [fetchPhotos]);

  const renderPhoto = ({ item }: { item: ActivityPhoto }) => (
    <View style={styles.photoCard}>
      <Image source={{ uri: item.imageUrl }} style={styles.photo} resizeMode="cover" />
      {item.caption ? <Text style={styles.caption}>{item.caption}</Text> : null}
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.content}>
        <Pressable style={styles.backButton} onPress={() => router.back()}>
          <Text style={styles.backButtonText}>返回</Text>
        </Pressable>

        <View style={styles.card}>
          <Text style={styles.title}>{title}</Text>
          <Text style={styles.meta}>活动 ID：{params.id || '未提供'}</Text>
          <Text style={styles.label}>时间</Text>
          <Text style={styles.value}>{date}</Text>
          <Text style={styles.label}>地点</Text>
          <Text style={styles.value}>{location}</Text>
          <Text style={styles.label}>报名人数</Text>
          <Text style={styles.value}>{current} / {max}</Text>
        </View>

        <View style={styles.gallerySection}>
          <Text style={styles.galleryTitle}>活动相册</Text>
          {loadingPhotos ? (
            <View style={styles.loadingContainer}>
              <ActivityIndicator size="small" color="#1677FF" />
              <Text style={styles.loadingText}>加载相册中...</Text>
            </View>
          ) : photos.length > 0 ? (
            <FlatList
              data={photos}
              renderItem={renderPhoto}
              keyExtractor={(item) => item.id}
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.galleryContent}
            />
          ) : (
            <View style={styles.emptyGallery}>
              <Text style={styles.emptyGalleryText}>暂无活动照片</Text>
            </View>
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F5F7FA' },
  content: { padding: 16, gap: 12, paddingBottom: 32 },
  backButton: {
    alignSelf: 'flex-start',
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 999,
    backgroundColor: '#FFFFFF',
  },
  backButtonText: { color: '#1677FF', fontWeight: '600' },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 20,
    gap: 8,
  },
  title: { fontSize: 24, fontWeight: '700', color: '#1F2329' },
  meta: { fontSize: 13, color: '#86909C' },
  label: { marginTop: 8, fontSize: 13, color: '#86909C' },
  value: { fontSize: 16, color: '#1F2329', lineHeight: 22 },
  gallerySection: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 20,
    gap: 12,
  },
  galleryTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1F2329',
  },
  loadingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingVertical: 24,
  },
  loadingText: {
    fontSize: 14,
    color: '#86909C',
  },
  galleryContent: {
    gap: 12,
  },
  photoCard: {
    marginRight: 12,
  },
  photo: {
    width: 280,
    height: 200,
    borderRadius: 12,
    backgroundColor: '#F0F0F0',
  },
  caption: {
    marginTop: 8,
    fontSize: 13,
    color: '#4E5969',
    maxWidth: 280,
  },
  emptyGallery: {
    paddingVertical: 32,
    alignItems: 'center',
  },
  emptyGalleryText: {
    fontSize: 14,
    color: '#86909C',
  },
});
