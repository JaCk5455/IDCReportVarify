import React from 'react';
import { Text, View,StatusBar,SafeAreaView, TouchableOpacity, Image } from 'react-native';
import {widthPercentageToDP as wp, heightPercentageToDP as hp} from 'react-native-responsive-screen';
import { Avatar } from 'react-native-paper';
import { MaterialCommunityIcons } from '@expo/vector-icons';  
import { Buffer } from "buffer"
import CryptoES from 'crypto-es';
import * as Crypto from 'expo-crypto';
import CryptoJS  from 'react-native-crypto-js'

export default function MainScreen({navigation}){
    
    return (
        <SafeAreaView style={{flex:1}}>
           
            <View style={{
                    flex: 2,
                    flexDirection:'column',
                    justifyContent:'center',
                    alignItems:'center'}}
            >
                <Text style={{fontWeight:'bold',color:'black',fontSize:wp('6%')}}>Scan QR Code</Text>
                <Text style={{fontWeight:'bold',color:'black',fontSize:wp('4%')}}>Online / Offline Verify IDC PCR report for travelers.</Text>

                <Image
                    style={{marginTop:wp('3%')}}
                    source={require('../assets/idc_logo.png')}
                />
            </View>
            <View style={{
                    flex: 3,
                    flexDirection:'column',
                    justifyContent:'flex-start',
                    alignItems:'center'
            }}>
                <MaterialCommunityIcons name="qrcode-scan" size={wp('40%')} color="black" />
                <TouchableOpacity onPress={()=> navigation.navigate('OnlineVerification')}>
                    <View
                        style={{backgroundColor:'#141c98',
                                paddingHorizontal:wp('8%'),
                                paddingVertical:wp('4%'),
                                borderRadius:wp('10%'),
                                marginTop:wp('5%')
                        }}
                    >
                        <Text style={{fontWeight:'bold',fontSize:wp('5%'),color:'white'}}>Scan Online</Text>
                    </View>
                </TouchableOpacity>
                <TouchableOpacity onPress={()=> navigation.navigate('Offline Verification')}>
                    <View
                        style={{backgroundColor:'#141c98',
                                paddingHorizontal:wp('8%'),
                                paddingVertical:wp('4%'),
                                borderRadius:wp('10%'),
                                marginTop:wp('5%')
                        }}
                    >
                        <Text style={{fontWeight:'bold',fontSize:wp('5%'),color:'white'}}>Scan Offline</Text>
                    </View>
                </TouchableOpacity>
            </View>
        </SafeAreaView>
    );
}