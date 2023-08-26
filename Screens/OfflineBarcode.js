import React from 'react';
import { Text, View, StyleSheet,Dimensions, Image,TouchableOpacity,ScrollView } from 'react-native';
import {widthPercentageToDP as wp, heightPercentageToDP as hp} from 'react-native-responsive-screen';
import { BarCodeScanner } from 'expo-barcode-scanner';
import BarcodeMask from 'react-native-barcode-mask';
import { Avatar,Button,Modal } from 'react-native-paper';
import { MaterialIcons } from '@expo/vector-icons'; 
import moment from 'moment';
import CryptoES from 'crypto-es';
import ProgressBar from '../Component/ProgressBar';
import * as Constants from '../Constants/Constants';
import AlertDialog from '../Component/AlertDialog';


const finderWidth = 280;

const finderHeight = 230;
const width = Dimensions.get('window').width;
const height = Dimensions.get('window').height;
const viewMinX = (width - finderWidth) / 2;
const viewMinY = (height - finderHeight) / 2;
const key = CryptoES.enc.Utf8.parse(Constants.SECRET_KEY);
const iv = CryptoES.enc.Utf8.parse(Constants.SECRET_KEY);


export default function OfflineBarcode({navigation}) {
    const [scanned, setScanned] = React.useState(false);
    const [hasPermission, setHasPermission] = React.useState(null);
    const [showProgressBar,setShowProgressBar] = React.useState(false);
    const [showAlertDialog,setshowAlertDialog] = React.useState(false);
    const [scanResult,setScanResult] = React.useState([]);
    const [modalVisible, setModalVisible] = React.useState(false);
    React.useEffect(() => {
        (async () => {
          const { status } = await BarCodeScanner.requestPermissionsAsync();
          setHasPermission(status === 'granted');
        })();

        

        

    }, []);

    const handleBarCodeScanned = ({ type, data,bounds:{origin} }) => {
        if (!scanned) {
            const {x, y} = origin;
            if (x >= viewMinX && y >= viewMinY && x <= (viewMinX + finderWidth / 2) && y <= (viewMinY + finderHeight / 2)) {
                setScanned(true);
                console.log(data);
                if(data != '' && data != null && data != undefined){
                  //const decrypt = CryptoES.AES.decrypt("y5rNQsp77aVC3WBDgHLQenHPnyzYCqpvH0tlGrv0F5Poc8PsRvAOSf6ehwsY8S9q1SbdpIRALiWcyzRtVyUUyg==", key,  
                    try{
                        const decrypt = CryptoES.AES.decrypt(data, key,  
                        {
                            keySize: 128,   
                            iv: iv,  
                            mode: CryptoES.mode.CBC,  
                            padding: CryptoES.pad.Pkcs7 
                        });
      
                        let decryptedData = decrypt.toString(CryptoES.enc.Utf8);
                        if(decryptedData.indexOf("^") > -1){
                          let decryptedArray = decryptedData.split("^");
                          if(decryptedArray.length > 0){
                            setScanResult(decryptedArray);
                            setModalVisible(true);
                          }
                          else{
                            //alert('Qr Code not found in our system.');
                            setshowAlertDialog(true);
                          }
                          
                        }
                        else{
                          //alert('Qr Code not found in our system.');
                          setshowAlertDialog(true);
                        }
                    }catch(e){
                        //alert('Qr Code not found in our system.');
                        setshowAlertDialog(true);
                    }
                  
                  
                }
                else{
                  //alert('Qr Code not found in our system.');
                  setshowAlertDialog(true);
                }
                                
            }
        }
    }
    

    if (hasPermission === null) {
        return <View style={{flex:1,justifyContent:'center',alignItems:'center'}}><Text>Requesting for camera permission</Text></View>;
    }
    if (hasPermission === false) {
        return <View style={{flex:1,justifyContent:'center',alignItems:'center'}}><Text>No access to camera</Text></View>;
    }
    const dismissModal = () => {
        console.log('ere');
        setModalVisible(false);
        setScanResult([]);
        setScanned(false);
    }
    const dismissAlertDialog = () => {
        setScanResult([]);
        setshowAlertDialog(false);
        setScanned(false);
        
    }
  
  return (
    <View
        style={{
            flex: 1,
            flexDirection: 'column',
            justifyContent: 'flex-end',
        }}
    >
        <BarCodeScanner
            type={BarCodeScanner.Constants.Type.back}
            onBarCodeScanned={scanned ? undefined : handleBarCodeScanned}
            barCodeTypes={[BarCodeScanner.Constants.BarCodeType.qr]}
            style={[StyleSheet.absoluteFill, styles.container]}
        >
            <BarcodeMask edgeColor={'#62B1F6'} showAnimatedLine={false}/>
            
        </BarCodeScanner>
        <ProgressBar visible={showProgressBar} text="Please wait" />
        {/* <AlertDialog visible={showAlertDialog} text="Are you sure you are scanning offline qr code?" /> */}
        <Modal visible={showAlertDialog} onDismiss={dismissAlertDialog} contentContainerStyle={styles.modalContainerStyle}>
            <View style={{height: height - hp('80%')}}>
                <View style={{justifyContent:'center',alignItems:'center',flex:1}}>
                    <MaterialIcons name="cancel" size={wp('15%')} color="red" />
                    <Text>Not Verified</Text>
                    <Text>Are you sure you are scanning offline qr code?</Text>
                    <TouchableOpacity onPress={dismissAlertDialog}>
                            <View
                                style={{backgroundColor:'#141c98',
                                        paddingHorizontal:wp('8%'),
                                        paddingVertical:wp('4%'),
                                        borderRadius:wp('10%'),
                                        marginTop:wp('5%')
                                }}
                            >
                                <Text style={{fontWeight:'bold',fontSize:20,color:'white'}}>Close</Text>
                            </View>
                    </TouchableOpacity>
                </View>
            </View>
        </Modal>
        <Modal visible={modalVisible} onDismiss={dismissModal} contentContainerStyle={styles.modalContainerStyle}>
            <View style={{height: height - hp('65%')}}>
                <ScrollView>
                    <View style={{flexDirection:'row',justifyContent:'center',}}>
                        <Text style={{fontWeight:'bold',fontSize:hp('3%')}}>Scan Result</Text>
                        
                    </View>
                    <View style={{position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, justifyContent: 'center', alignItems: 'center'}}>
                        <MaterialIcons name="check-circle" size={wp('35%')} color="#00ff0099"/>
                    </View>
                    <View style={{flexDirection:'row',justifyContent:'flex-start',borderBottomWidth:1,borderBottomColor:'#D3D3D3',paddingVertical:hp('1%')}}>
                        <Text>PIN: </Text>
                        <Text style={{fontWeight: 'bold'}}>
                            {scanResult.length ? scanResult[0] : '--'}
                        </Text>
                    </View>
                    <View style={{flexDirection:'row',justifyContent:'flex-start',borderBottomWidth:1,borderBottomColor:'#D3D3D3',paddingVertical:hp('1%')}}>
                        <Text>Name: </Text>
                        <Text style={{fontWeight: 'bold',justifyContent:'flex-start'}}>
                            {scanResult.length ? scanResult[1] : '--'}
                        </Text>
                    </View>
                    <View style={{flexDirection:'row',justifyContent:'flex-start',borderBottomWidth:1,borderBottomColor:'#D3D3D3',paddingVertical:hp('1%')}}>
                        <Text>Passport: </Text>
                        <Text style={{fontWeight: 'bold',justifyContent:'flex-start'}}>
                            {scanResult.length ? scanResult[2] : '--'}
                        </Text>
                    </View>
                    <View style={{flexDirection:'row',justifyContent:'flex-start',borderBottomWidth:1,borderBottomColor:'#D3D3D3',paddingVertical:hp('1%')}}>
                        <Text>Result: </Text>
                        <View style={[{paddingHorizontal:hp('1%'),paddingVertical:hp('1%')},
                                        scanResult.length && scanResult[3] == 'Detected' ? {backgroundColor:'red'} : {backgroundColor:'green'}
                                    ]}>
                            <Text style={[{fontWeight: 'bold',justifyContent:'flex-start',color:'white'}]}>
                                {scanResult.length ? scanResult[3]: '--'}
                            </Text>
                        </View>
                    </View>
                    
                    <View style={{flexDirection:'row',justifyContent:'center'}}>
                        <TouchableOpacity onPress={dismissModal}>
                            <View
                                style={{backgroundColor:'#141c98',
                                        paddingHorizontal:wp('8%'),
                                        paddingVertical:wp('4%'),
                                        borderRadius:wp('10%'),
                                        marginTop:wp('7%')
                                }}
                            >
                                <Text style={{fontWeight:'bold',fontSize:20,color:'white'}}>Close</Text>
                            </View>
                        </TouchableOpacity>
                    </View>
                </ScrollView>
            </View>
        </Modal>
            
        {scanned && <Button style={{backgroundColor:'#2694f2',paddingVertical:wp('1%')}} color="white" onPress={() => setScanned(false)} >Tap to Scan Again</Button>}
    </View>
  );

  
}

const opacity = 'rgba(0, 0, 0, .6)';
const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column'
  },
  layerTop: {
    flex: 2,
    backgroundColor: opacity
  },
  layerCenter: {
    flex: 1,
    flexDirection: 'row'
  },
  layerLeft: {
    flex: 1,
    backgroundColor: opacity
  },
  focused: {
    flex: 10
  },
  layerRight: {
    flex: 1,
    backgroundColor: opacity
  },
  layerBottom: {
    flex: 2,
    backgroundColor: opacity
  },
  modalContainerStyle: {backgroundColor: 'white', padding: 20,marginHorizontal:20,borderRadius:20},
  modal:{
        backgroundColor:"#00000099",
        /* backgroundColor:'white', */
        flex:1,
        alignItems: 'center',
        justifyContent: 'center',
    },
    modalContainer:{
        backgroundColor:"#f9fafb",
        /* backgroundColor:'white', */
        width:"80%",
        borderRadius:5
    },
    modalHeader:{
        
    },
    title:{
        fontWeight:"bold",
        fontSize:20,
        padding:15,
        color:"#000"
    },
    divider:{
        width:"100%",
        height:1,
        backgroundColor:"lightgray"
    },
    modalBody:{
        backgroundColor:"#fff",
        paddingVertical:20,
        paddingHorizontal:10
    },
    modalFooter:{
    },
    actions:{
        borderRadius:5,
        marginHorizontal:10,
        paddingVertical:10,
        paddingHorizontal:20
    },
    actionText:{
        color:"#fff"
    }
});
