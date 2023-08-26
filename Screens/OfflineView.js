import React from 'react';
import { Text, View,StatusBar,SafeAreaView, TouchableOpacity, Image } from 'react-native';
import {widthPercentageToDP as wp, heightPercentageToDP as hp} from 'react-native-responsive-screen';
import { Avatar } from 'react-native-paper';
import { MaterialCommunityIcons } from '@expo/vector-icons';  
import { Buffer } from "buffer"
import CryptoES from 'crypto-es';
import * as Crypto from 'expo-crypto';
import CryptoJS  from 'react-native-crypto-js'

export default function OfflineView({navigation}){
    
    React.useEffect(()=>{

        /* const key = CryptoES.enc.Utf8.parse('Idc#scanner12345');
        const iv = CryptoES.enc.Utf8.parse('Idc#scanner12345');

        console.log("s6hqCnmSqu0p4JLERlEtOQ9rJUt1qpYjYCulOdxx+TaTaYr9BInVNfim/UHlItIrdWRbhmNTGY4kaS2SStk5Gh8sbVTufefme6Vbu+3rlAe6yVeyV35Lg95lGgKpswoJpoDdEqqWdiKgYuv9F6PSng==".length);
        const decrypt = CryptoES.AES.decrypt("s6hqCnmSqu0p4JLERlEtOQ9rJUt1qpYjYCulOdxx+TYDLTJJ/acnarb7Y8hpNcmfD4+AnEhcnkmnpWWAlCL/CJPeCWYqbJQkci1buZVBgwc=", key,  
        {
            keySize: 128,   
            iv: iv,  
            mode: CryptoES.mode.CBC,  
            padding: CryptoES.pad.Pkcs7 
        });

        console.log('ES d',decrypt.toString(CryptoES.enc.Utf8)); */

    },[]);
    return (
        <SafeAreaView style={{flex:1}}>
           
            <View style={{
                    flex: 3,
                    flexDirection:'column',
                    justifyContent:'center',
                    alignItems:'center'}}
            >
                <Text style={{fontWeight:'bold',color:'black',fontSize:wp('6%')}}>Scan QR Code</Text>
                <Text style={{fontWeight:'bold',color:'black',fontSize:wp('4%')}}>Offline Verify your IDC PCR report.</Text>

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
                <TouchableOpacity onPress={()=> navigation.navigate('OfflineScan')}>
                    <MaterialCommunityIcons name="qrcode-scan" size={wp('40%')} color="black" />
                </TouchableOpacity>
                <TouchableOpacity onPress={()=> navigation.navigate('OfflineScan')}>
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