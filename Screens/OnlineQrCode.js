import React from 'react';
import { Text, View, StyleSheet,Dimensions, Image,TouchableOpacity,ScrollView } from 'react-native';
import {widthPercentageToDP as wp, heightPercentageToDP as hp} from 'react-native-responsive-screen';
import { BarCodeScanner } from 'expo-barcode-scanner';
import BarcodeMask from 'react-native-barcode-mask';
import { Avatar,Button,Modal } from 'react-native-paper';
import { MaterialIcons } from '@expo/vector-icons'; 
import moment from 'moment';
import ProgressBar from '../Component/ProgressBar';
import * as Constants from '../Constants/Constants';


const finderWidth = 280;

const finderHeight = 230;
const width = Dimensions.get('window').width;
const height = Dimensions.get('window').height;
const viewMinX = (width - finderWidth) / 2;
const viewMinY = (height - finderHeight) / 2;



export default function OnlineQrCode({navigation}) {
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
    
                let regex = /[?&]([^=#]+)=([^&#]*)/g,
                params = {},
                match;
                while (match = regex.exec(data)) {
                    params[match[1]] = match[2];
                }
                console.log(params);
                console.log('aaaa',params.VerificationId);
                if(params.VerificationId){
                    setShowProgressBar(true);
                    verifyPatientReportApi(params.VerificationId).then((response) => {
                        if(response){
                            if(response.statusCode == 200){
                                console.log(JSON.parse(response.payLoad));
                                setScanResult(JSON.parse(response.payLoad))
                                setModalVisible(true);
                            }else{
                                //alert('Qr code not found in our system.');
                                setshowAlertDialog(true);
                            }
                        }
                        setShowProgressBar(false);
                    }).catch((e) => {
                        console.log('error',e);
                        setShowProgressBar(false);
                    });
                }
                else{
                    //alert('Qr Code not found in our system.');
                    setshowAlertDialog(true);
                }
                
            }
        }
    }
    const verifyPatientReportApi = async (visitNo) =>{
        try{
            const response = await fetch('https://idcnow.co/OnlinePortalsServiceV2/api/PatientResults/VerifyPatientReport',{
                method:'POST',
                headers:{
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    'id': visitNo
                })
            });
    
            const data = await response.json();
            return data;
            
        }
        catch(e){
            console.log(e);
            return null;
        }
    };

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
        <Modal visible={showAlertDialog} onDismiss={dismissAlertDialog} contentContainerStyle={styles.modalContainerStyle}>
                <View style={{height: height - hp('80%')}}>
                    <View style={{justifyContent:'center',alignItems:'center',flex:1}}>
                        <MaterialIcons name="cancel" size={wp('15%')} color="red" />
                        <Text>Not Verified</Text>
                        <Text>Are you sure you are scanning online qr code?</Text>
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
                <View style={{height: height - hp('25%')}}>
                    <View style={{position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, justifyContent: 'center', alignItems: 'center'}}>
                        <MaterialIcons name="check-circle" size={wp('45%')} color="#00ff0099"/>
                    </View>
                    <ScrollView>
                        <View style={{flexDirection:'row',justifyContent:'center',}}>
                            <Text style={{fontWeight:'bold',fontSize:hp('3%')}}>Scan Result</Text>
                            
                        </View>
                        <View style={{flexDirection:'row',justifyContent:'center',}}>
                            <Avatar.Image 
                                source={{
                                    uri: ((scanResult.length) ? `data:image/png;base64,${scanResult[0].Pic}`  : (scanResult.length && scanResult[0].Gender == "M" ?  Constants.USER_IMAGE.MALE : Constants.USER_IMAGE.FEMALE))
                                }}
                                size={hp('13%')}
                            />
                        </View>
                        <View style={{flexDirection:'row',justifyContent:'flex-start',borderBottomWidth:1,borderBottomColor:'#D3D3D3',paddingVertical:hp('1%')}}>
                            <Text>MRN/PIN: </Text>
                            <Text style={{fontWeight: 'bold'}}>
                                {scanResult.length ? scanResult[0].RegNo : '--'} / {scanResult.length ? scanResult[0].PIN : '--'}
                            </Text>
                        </View>
                        <View style={{flexDirection:'row',justifyContent:'flex-start',borderBottomWidth:1,borderBottomColor:'#D3D3D3',paddingVertical:hp('1%')}}>
                            <Text>Name: </Text>
                            <Text style={{fontWeight: 'bold',justifyContent:'flex-start'}}>
                                {scanResult.length ? scanResult[0].Name : '--'}
                            </Text>
                        </View>
                        <View style={{flexDirection:'row',justifyContent:'flex-start',borderBottomWidth:1,borderBottomColor:'#D3D3D3',paddingVertical:hp('1%')}}>
                            <Text>Age/Gender: </Text>
                            <Text style={{fontWeight: 'bold',justifyContent:'flex-start'}}>
                                {scanResult.length ? scanResult[0].Age : '--'} / {scanResult.length ? scanResult[0].Gender : '--'} 
                            </Text>
                        </View>
                        <View style={{flexDirection:'row',justifyContent:'flex-start',borderBottomWidth:1,borderBottomColor:'#D3D3D3',paddingVertical:hp('1%')}}>
                            <Text>CNIC: </Text>
                            <Text style={{fontWeight: 'bold',justifyContent:'flex-start'}}>
                                {scanResult.length ? scanResult[0].CNIC : '--'}
                            </Text>
                        </View>
                        <View style={{flexDirection:'row',justifyContent:'flex-start',borderBottomWidth:1,borderBottomColor:'#D3D3D3',paddingVertical:hp('1%')}}>
                            <Text>Passport: </Text>
                            <Text style={{fontWeight: 'bold',justifyContent:'flex-start'}}>
                                {scanResult.length ? scanResult[0].Passport : '--'}
                            </Text>
                        </View>
                        <View style={{flexDirection:'row',justifyContent:'flex-start',borderBottomWidth:1,borderBottomColor:'#D3D3D3',paddingVertical:hp('1%')}}>
                            <Text>Flight Date: </Text>
                            <Text style={{fontWeight: 'bold',justifyContent:'flex-start'}}>
                                {scanResult.length ? moment(scanResult[0].FlightDate).format('DD-MMM-YYYY') : '--'}
                            </Text>
                        </View>
                        <View style={{flexDirection:'row',justifyContent:'flex-start',borderBottomWidth:1,borderBottomColor:'#D3D3D3',paddingVertical:hp('1%')}}>
                            <Text>Flight #: </Text>
                            <Text style={{fontWeight: 'bold',justifyContent:'flex-start'}}>
                                {scanResult.length ? scanResult[0].FlightNo : '--'}
                            </Text>
                        </View>
                        <View style={{flexDirection:'row',justifyContent:'flex-start',borderBottomWidth:1,borderBottomColor:'#D3D3D3',paddingVertical:hp('1%')}}>
                            <Text>Ticket/Booking Ref #: </Text>
                            <Text style={{fontWeight: 'bold',justifyContent:'flex-start'}}>
                                {scanResult.length ? scanResult[0].BookingReferenceNo : '--'}
                            </Text>
                        </View>
                        <View style={{flexDirection:'row',justifyContent:'flex-start',borderBottomWidth:1,borderBottomColor:'#D3D3D3',paddingVertical:hp('1%')}}>
                            <Text>Airport: </Text>
                            <Text style={{fontWeight: 'bold',justifyContent:'flex-start'}}>
                                {scanResult.length ? scanResult[0].Airport : '--'}
                            </Text>
                        </View>
                        <View style={{flexDirection:'row',justifyContent:'flex-start',alignItems:'center',borderBottomWidth:1,borderBottomColor:'#D3D3D3',paddingVertical:hp('1%')}}>
                            <Text>Result: </Text>
                            <View style={[{paddingHorizontal:hp('1%'),paddingVertical:hp('1%')},
                                            scanResult.length && scanResult[0].Result == 'Detected' ? {backgroundColor:'red'} : {backgroundColor:'green'}
                                        ]}>
                                <Text style={[{fontWeight: 'bold',justifyContent:'flex-start',color:'white'}]}>
                                    {scanResult.length ? scanResult[0].Result : '--'}
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
                                            marginTop:wp('5%')
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
