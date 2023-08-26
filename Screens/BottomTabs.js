import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import OnlineStackNavigator from './OnlineStackNavigator';
import OfflineStackNavigator from './OfflineStackNavigator';
import OfflineBarcode from './OfflineBarcode';
import { AntDesign } from '@expo/vector-icons'; 
const Tab = createBottomTabNavigator();

export default function BottomTabs() {
  return (
    <Tab.Navigator>
      <Tab.Screen 
        name="Online Verification" 
        component={OnlineStackNavigator} 
        options={{
          tabBarLabel: 'Online Verification',
          tabBarIcon: ({ color }) => (
          <AntDesign name="qrcode" color={color} size={26} />
          ),
        }}
      />
      <Tab.Screen 
        name="Offline Verification" 
        component={OfflineBarcode} 
        options={{
          tabBarLabel: 'Offline Verification',
          tabBarIcon: ({ color }) => (
          <AntDesign name="qrcode" color={color} size={26} />
          ),
        }}
      />
    </Tab.Navigator>
  );
}