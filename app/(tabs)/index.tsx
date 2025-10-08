// import EditScreenInfo from '@/components/EditScreenInfo';
import { Text, View } from '@/components/Themed';
import React, { useEffect, useContext } from 'react';
import { ActivityIndicator, StyleSheet } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { UserContext } from '../userContext';
import 'react-native-get-random-values'; // needed for UUID in React Native
import { v4 as uuidv4 } from 'uuid';
// import * as ScreenOrientation from "expo-screen-orientation";

import { domisStyle } from '../domisStyles.js';

const UNIQUE_ID_KEY = 'userUniqueId';

export default function TabOneScreen() {
  const { uniqueId, setUniqueId } = useContext(UserContext);
  const [loading, setLoading] = React.useState(true);

  useEffect(() => {
    async function loadOrCreateUniqueId() {
      try {
        const storedId = await AsyncStorage.getItem(UNIQUE_ID_KEY);
        if (storedId) {
          setUniqueId(storedId);
        } else {
          const newId = uuidv4();
          await AsyncStorage.setItem(UNIQUE_ID_KEY, newId);
          setUniqueId(newId);
        }
      } catch (e) {
        console.error('Failed to load or create uniqueId', e);
      } finally {
        setLoading(false);
      }
    }
    loadOrCreateUniqueId();
  }, []);

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" />
      </View>
    );
  }
  return (
    <View style={domisStyle.container}>
      <Text style={domisStyle.title}>Welcome to DomisMusic</Text>
      {uniqueId && <Text style={styles.userIdText}>userId: {uniqueId}</Text>}
      <View style={domisStyle.separator} lightColor="#eee" darkColor="rgba(255,255,255,0.1)" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 20 },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  uniqueIdText: { marginTop: 10, fontWeight: 'bold' },
  userIdText: {
    fontSize: 12,
    color: '#666',
    marginTop: 8,
  },
});
