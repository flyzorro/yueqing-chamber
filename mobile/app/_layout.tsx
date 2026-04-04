import { StatusBar } from 'expo-status-bar';
import TabsLayout from './(tabs)/_layout';

export default function RootLayout() {
  return (
    <>
      <StatusBar style="auto" />
      <TabsLayout />
    </>
  );
}
