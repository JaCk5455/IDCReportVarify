import React from 'react';
import {View, 
    Text, 
    StyleSheet,
    ActivityIndicator
} from 'react-native';
import { Modal } from 'react-native-paper';
import { MaterialIcons } from '@expo/vector-icons'; 

export default function AlertDialog(props){
    return (
        <Modal
            animationType="slide"
            transparent={true}
            visible={props.visible}
        >
            <View style={styles.centeredView}>
                <View style={styles.modalView}>
                    <MaterialIcons name="cancel" size={24} color="red" />
                    <Text style={styles.modalText}>Not Verified</Text>
                    <Text style={styles.modalText}>{props.text}</Text>
                </View>
            </View>
        </Modal>
    );
}

const styles = StyleSheet.create({
    centeredView: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 22,
        backgroundColor: 'rgba(52, 52, 52, 0.4)'
        
    },
    modalView: {
        margin: 20,
        backgroundColor: 'white',
        borderRadius: 10,
        padding: 30,
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: {
          width: 0,
          height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 5,
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center'
    },
    modalText: {
        marginLeft: 20,
        
        fontSize: 16
    },
});