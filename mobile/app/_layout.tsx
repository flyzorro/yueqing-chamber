import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';

export default function RootLayout() {
  return (
    <>
      <StatusBar style="auto" />
      <Stack
        screenOptions={{
          headerShown: false,
          headerBackTitle: '返回',
        }}
      >
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen
          name="member-detail"
          options={{
            headerShown: true,
            title: '会员详情',
            headerBackTitle: '返回',
          }}
        />
        <Stack.Screen
          name="activity-detail"
          options={{
            headerShown: true,
            title: '活动详情',
            headerBackTitle: '返回',
          }}
        />
        <Stack.Screen
          name="companies"
          options={{
            headerShown: true,
            title: '企业名录',
            headerBackTitle: '返回',
          }}
        />
        <Stack.Screen
          name="company-detail"
          options={{
            headerShown: true,
            title: '企业详情',
            headerBackTitle: '返回',
          }}
        />
        <Stack.Screen name="login" options={{ headerShown: false }} />
      </Stack>
    </>
  );
}
