import React from 'react';
import MainScreen from './MainScreen';
import OnlineQrCode from './OnlineQrCode';
import OfflineBarcode from './OfflineBarcode';
import { createStackNavigator } from '@react-navigation/stack';
import OfflineView from './OfflineView';
const Stack = createStackNavigator();

export default function OfflineStackNavigator(){
    return (
        <Stack.Navigator screenOptions={{
            headerShown: false
          }}>
            <Stack.Screen
                name="OfflineScan"
                component={OfflineBarcode}
                options={{
                    headerTintColor: 'white',
                    headerStyle: { backgroundColor: '#0175c4' },
                }}
            />
            {/* <Stack.Screen
                name="Offline"
                component={OfflineView}
                options={{
                    headerTintColor: 'white',
                    headerStyle: { backgroundColor: '#0175c4' },
                }}
            />
            <Stack.Screen
                name="OfflineScan"
                component={OfflineBarcode}
                options={{
                    headerTintColor: 'white',
                    headerStyle: { backgroundColor: '#0175c4' },
                }}
            /> */}
        </Stack.Navigator>
    );
}