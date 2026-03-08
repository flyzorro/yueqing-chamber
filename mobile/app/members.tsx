import { View, Text, StyleSheet, ScrollView, FlatList } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const mockMembers = [
  { id: '1', name: '张三', company: '某某科技有限公司', position: '董事长' },
  { id: '2', name: '李四', company: '某某贸易有限公司', position: '总经理' },
  { id: '3', name: '王五', company: '某某制造有限公司', position: 'CEO' },
  { id: '4', name: '赵六', company: '某某投资有限公司', position: '总裁' },
];

export default function MembersScreen() {
  const renderMember = ({ item }: { item: typeof mockMembers[0] }) => (
    <View style={styles.memberCard}>
      <View style={styles.avatar}>
        <Text style={styles.avatarText}>{item.name[0]}</Text>
      </View>
      <View style={styles.memberInfo}>
        <Text style={styles.memberName}>{item.name}</Text>
        <Text style={styles.memberCompany}>{item.company}</Text>
        <Text style={styles.memberPosition}>{item.position}</Text>
      </View>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>会员中心</Text>
        <Text style={styles.subtitle}>共 {mockMembers.length} 位会员</Text>
      </View>
      <FlatList
        data={mockMembers}
        renderItem={renderMember}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContent}
      />
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
  listContent: {
    padding: 16,
  },
  memberCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    flexDirection: 'row',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  avatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#007AFF',
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarText: {
    color: '#FFFFFF',
    fontSize: 20,
    fontWeight: 'bold',
  },
  memberInfo: {
    marginLeft: 16,
    flex: 1,
  },
  memberName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#000000',
  },
  memberCompany: {
    fontSize: 14,
    color: '#8E8E93',
    marginTop: 2,
  },
  memberPosition: {
    fontSize: 12,
    color: '#007AFF',
    marginTop: 2,
  },
});