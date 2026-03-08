import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';

const services = [
  { id: '1', title: '法律咨询', description: '专业律师团队提供法律咨询服务', icon: 'document-text' },
  { id: '2', title: '财税服务', description: '税务筹划、财务咨询等专业服务', icon: 'cash' },
  { id: '3', title: '融资对接', description: '银行、投资机构融资对接服务', icon: 'business' },
  { id: '4', title: '人才招聘', description: '企业人才招聘与猎头服务', icon: 'people' },
  { id: '5', title: '商务考察', description: '国内外商务考察与交流活动', icon: 'airplane' },
  { id: '6', title: '培训学习', description: '企业管理、技能培训课程', icon: 'book' },
];

export default function ServicesScreen() {
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>商会服务</Text>
        <Text style={styles.subtitle}>为会员提供全方位服务支持</Text>
      </View>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.grid}>
          {services.map((service) => (
            <TouchableOpacity key={service.id} style={styles.serviceCard}>
              <Ionicons name={service.icon as any} size={32} color="#007AFF" />
              <Text style={styles.serviceTitle}>{service.title}</Text>
              <Text style={styles.serviceDescription}>{service.description}</Text>
            </TouchableOpacity>
          ))}
        </View>
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
  subtitle: {
    fontSize: 14,
    color: '#8E8E93',
    marginTop: 4,
  },
  scrollContent: {
    padding: 16,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  serviceCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    width: '48%',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  serviceTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#000000',
    marginBottom: 4,
    marginTop: 8,
  },
  serviceDescription: {
    fontSize: 12,
    color: '#8E8E93',
    textAlign: 'center',
  },
});