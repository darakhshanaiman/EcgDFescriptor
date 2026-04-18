import { Drawer } from 'expo-router/drawer';
import { Sidebar } from '../../components/Sidebar';
import { View, StyleSheet } from 'react-native';
import { useTheme } from '../../lib/contexts/ThemeContext';

export default function AppLayout() {
  const { colors } = useTheme();

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <Drawer
        drawerContent={() => <Sidebar />}
        screenOptions={{
          headerShown: false,
          headerStyle: {
            backgroundColor: colors.surface,
            borderBottomWidth: 0,
            elevation: 0,
            shadowOpacity: 0,
          },
          headerTintColor: colors.text,
          drawerStyle: {
            backgroundColor: colors.surface,
            width: 280,
          },
          drawerType: 'front',
        }}
      >
        <Drawer.Screen
          name="index"
          options={{
            title: 'Homepage',
          }}
        />
        <Drawer.Screen
          name="analyze"
          options={{
            title: 'Analyze ECG',
          }}
        />
        <Drawer.Screen
          name="chat/index"
          options={{
            title: 'Chat History',
          }}
        />
        <Drawer.Screen
          name="insights"
          options={{
            title: 'Medical Insights',
          }}
        />
        <Drawer.Screen
          name="profile"
          options={{
            title: 'Edit Profile',
          }}
        />
        <Drawer.Screen
          name="settings"
          options={{
            title: 'Settings',
          }}
        />
        <Drawer.Screen
          name="notifications"
          options={{
            drawerItemStyle: { display: 'none' },
            title: 'Notifications'
          }}
        />
        <Drawer.Screen
          name="language"
          options={{
            drawerItemStyle: { display: 'none' },
            title: 'Language'
          }}
        />
        <Drawer.Screen
          name="theme"
          options={{
            drawerItemStyle: { display: 'none' },
            title: 'Theme'
          }}
        />
        <Drawer.Screen
          name="privacy"
          options={{
            drawerItemStyle: { display: 'none' },
            title: 'Privacy Policy'
          }}
        />
        <Drawer.Screen
          name="security"
          options={{
            drawerItemStyle: { display: 'none' },
            title: 'Security'
          }}
        />
        <Drawer.Screen
          name="contact"
          options={{
            drawerItemStyle: { display: 'none' },
            title: 'Contact Us'
          }}
        />
      </Drawer>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
