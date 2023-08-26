import React from 'react';
import MainScreen from './MainScreen';
import OnlineQrCode from './OnlineQrCode';
import OfflineBarcode from './OfflineBarcode';
import { createStackNavigator } from '@react-navigation/stack';
const Stack = createStackNavigator();

export default function OnlineStackNavigator(){
    return (
        <Stack.Navigator screenOptions={{
            headerShown: false
          }}>
            <Stack.Screen
                name="Home"
                component={MainScreen}
                options={{
                headerTintColor: 'white',
                headerStyle: { backgroundColor: '#0175c4' },
                }}
            />
            <Stack.Screen
                name="OnlineVerification"
                component={OnlineQrCode}
                options={{
                headerTintColor: 'white',
                headerStyle: { backgroundColor: '#0175c4' },
                }}
            />
            {/* <Stack.Screen
                name="OfflineQrScan"
                component={OfflineBarcode}
                options={{
                    headerTintColor: 'white',
                    headerStyle: { backgroundColor: '#0175c4' },
                }}
            /> */}
           
        </Stack.Navigator>
    );
}