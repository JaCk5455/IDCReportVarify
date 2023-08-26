import { StatusBar } from 'expo-status-bar';
import React from 'react';
import { Text, View, StyleSheet, Button } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import BottomTabs from './Screens/BottomTabs';

export default function App() {
  return (
    <NavigationContainer>
      <BottomTabs />
    </NavigationContainer>
  );
}

