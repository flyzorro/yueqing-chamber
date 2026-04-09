import { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, ActivityIndicator, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { fetchApi, API } from './utils/api';

const INFO_CATEGORIES = [
  { value: 'product', label: '产品' },
  { value: 'technology', label: '技术' },
  { value: 'market', label: '市场' },
  { value: 'finance', label: '金融' },
  { value: 'talent', label: '人才' },
  { value: 'policy', label: '政策' },
  { value: 'other', label: '其他' },
] as const;

type InfoCategory = typeof INFO_CATEGORIES[number]['value'];

export default function CreateInformationScreen() {
  const router = useRouter();
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [category, setCategory] = useState<InfoCategory>('other');
  const [contactname, setContactname] = useState('');
  const [contactphone, setContactphone] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    // 验证输入
    if (!title || title.trim().length < 1) {
      Alert.alert('提示', '标题不能为空');
      return;
    }

    if (!content || content.trim().length < 1) {
      Alert.alert('提示', '内容不能为空');
      return;
    }

    setLoading(true);

    try {
      await fetchApi(API.INFORMATION, {
        method: 'POST',
        body: JSON.stringify({
          title: title.trim(),
          content: content.trim(),
          category,
          contactname: contactname.trim() || undefined,
          contactphone: contactphone.trim() || undefined,
        }),
      });

      Alert.alert('成功', '信息发布成功', [
        { text: '确定', onPress: () => router.replace('/information') },
      ]);
    } catch (error) {
      console.error('Create information error:', error);
      Alert.alert('错误', error instanceof Error ? error.message : '发布失败，请稍后重试');
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollContent}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
            <Text style={styles.backButtonText}>✕</Text>
          </TouchableOpacity>
          <Text style={styles.title}>发布信息</Text>
        </View>

        <View style={styles.form}>
          <View style={styles.inputGroup}>
            <Text style={styles.label}>标题 *</Text>
            <TextInput
              style={styles.input}
              placeholder="请输入标题"
              value={title}
              onChangeText={setTitle}
              placeholderTextColor="#999"
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>分类 *</Text>
            <View style={styles.categoryContainer}>
              {INFO_CATEGORIES.map((cat) => (
                <TouchableOpacity
                  key={cat.value}
                  style={[
                    styles.categoryButton,
                    category === cat.value && styles.categoryButtonActive,
                  ]}
                  onPress={() => setCategory(cat.value)}
                >
                  <Text
                    style={[
                      styles.categoryButtonText,
                      category === cat.value && styles.categoryButtonTextActive,
                    ]}
                  >
                    {cat.label}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>内容 *</Text>
            <TextInput
              style={[styles.input, styles.textArea]}
              placeholder="请输入详细内容"
              value={content}
              onChangeText={setContent}
              placeholderTextColor="#999"
              multiline
              numberOfLines={6}
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>联系人</Text>
            <TextInput
              style={styles.input}
              placeholder="请输入联系人姓名（可选）"
              value={contactname}
              onChangeText={setContactname}
              placeholderTextColor="#999"
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>联系电话</Text>
            <TextInput
              style={styles.input}
              placeholder="请输入联系电话（可选）"
              value={contactphone}
              onChangeText={setContactphone}
              keyboardType="phone-pad"
              placeholderTextColor="#999"
            />
          </View>

          <TouchableOpacity
            style={[styles.button, loading && styles.buttonDisabled]}
            onPress={handleSubmit}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator color="#FFF" />
            ) : (
              <Text style={styles.buttonText}>发布</Text>
            )}
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F5F5F5' },
  scrollView: { flex: 1 },
  scrollContent: { flexGrow: 1 },
  header: {
    padding: 20,
    backgroundColor: '#007AFF',
    marginBottom: 20,
    flexDirection: 'row',
    alignItems: 'center',
  },
  backButton: {
    marginRight: 16,
    padding: 4,
  },
  backButtonText: {
    fontSize: 20,
    color: '#FFFFFF',
    fontWeight: 'bold',
  },
  title: { fontSize: 24, fontWeight: 'bold', color: '#FFFFFF' },
  form: { padding: 20 },
  inputGroup: { marginBottom: 20 },
  label: { fontSize: 14, color: '#333', marginBottom: 8, fontWeight: '500' },
  input: {
    backgroundColor: '#FFFFFF',
    padding: 15,
    borderRadius: 10,
    fontSize: 16,
    borderWidth: 1,
    borderColor: '#E0E0E0',
  },
  textArea: {
    height: 120,
    textAlignVertical: 'top',
  },
  categoryContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  categoryButton: {
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 8,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E0E0E0',
  },
  categoryButtonActive: {
    backgroundColor: '#007AFF',
    borderColor: '#007AFF',
  },
  categoryButtonText: {
    fontSize: 14,
    color: '#333',
  },
  categoryButtonTextActive: {
    color: '#FFFFFF',
    fontWeight: '500',
  },
  button: {
    backgroundColor: '#007AFF',
    padding: 16,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 10,
  },
  buttonDisabled: { opacity: 0.6 },
  buttonText: { color: '#FFFFFF', fontSize: 16, fontWeight: 'bold' },
});
