import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';

const services = [
  { id: '1', title: '法律服务', description: '专业律师团队提供法律咨询与合规支持', icon: 'document-text' },
  { id: '2', title: '金融服务', description: '银行、授信与融资资源对接服务', icon: 'card' },
  { id: '3', title: '财税服务', description: '税务筹划、财务咨询等专业服务', icon: 'cash' },
  { id: '4', title: '工商服务', description: '企业注册、变更办理与经营合规支持', icon: 'briefcase' },
  { id: '5', title: 'IT 技术', description: '数字化建设、软件系统与技术服务支持', icon: 'desktop' },
  { id: '6', title: '政务服务', description: '政策解读、政企沟通与事项协同支持', icon: 'business' },
  { id: '7', title: 'HR 服务', description: '招聘、组织发展与人力资源支持', icon: 'people' },
  { id: '8', title: '产品服务', description: '产品策划、能力包装与商业化支持', icon: 'cube' },
  { id: '9', title: '信息发布', description: '商机、供需与商会通知信息发布入口', icon: 'megaphone' },
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