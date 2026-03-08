import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const mockActivities = [
  { id: '1', title: '2024年度商会年会', date: '2024-12-28', location: '乐清大酒店', status: '报名中' },
  { id: '2', title: '企业家交流沙龙', date: '2024-12-15', location: '商会会议室', status: '即将开始' },
  { id: '3', title: '商务考察活动', date: '2024-12-20', location: '杭州', status: '报名中' },
];

export default function ActivitiesScreen() {
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>活动管理</Text>
      </View>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        {mockActivities.map((activity) => (
          <View key={activity.id} style={styles.activityCard}>
            <View style={styles.activityHeader}>
              <Text style={styles.activityTitle}>{activity.title}</Text>
              <View style={[
                styles.statusBadge,
                activity.status === '报名中' ? styles.statusActive : styles.statusUpcoming
              ]}>
                <Text style={styles.statusText}>{activity.status}</Text>
              </View>
            </View>
            <View style={styles.activityDetails}>
              <Text style={styles.detailText}>📅 {activity.date}</Text>
              <Text style={styles.detailText}>📍 {activity.location}</Text>
            </View>
            <TouchableOpacity style={styles.button}>
              <Text style={styles.buttonText}>查看详情</Text>
            </TouchableOpacity>
          </View>
        ))}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F2F2F7',
  },
  header: {
    padding: 16,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E5EA',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#000000',
  },
  scrollContent: {
    padding: 16,
  },
  activityCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  activityHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  activityTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#000000',
    flex: 1,
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
  },
  statusActive: {
    backgroundColor: '#34C759',
  },
  statusUpcoming: {
    backgroundColor: '#FF9500',
  },
  statusText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '500',
  },
  activityDetails: {
    marginBottom: 12,
  },
  detailText: {
    fontSize: 14,
    color: '#8E8E93',
    marginBottom: 4,
  },
  button: {
    backgroundColor: '#007AFF',
    paddingVertical: 10,
    borderRadius: 8,
    alignItems: 'center',
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '500',
  },
});