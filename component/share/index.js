import React, { Component } from 'react';
import { Share, Button, TouchableOpacity, StyleSheet, View, Image, Text } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';

export default class ShareComponent extends Component {
    onShare = async () => {
        try {
            const result = await Share.share({
                title: 'ice.surf1025',
                message: `http://ice.surf1025.com:8000/surf1025 `,
            }, {
                    dialogTitle: 'http://ice.surf1025.com:8000/surf1025'
                });

            if (result.action === Share.sharedAction) {
                if (result.activityType) {
                    // shared with activity type of result.activityType
                } else {
                    // shared
                }
            } else if (result.action === Share.dismissedAction) {
                // dismissed
            }
        } catch (error) {
            alert(error.message);
        }
    };

    render() {
        return (

            <TouchableOpacity activeOpacity={0.7} onPress={this.onShare} style={styles.main} >
                <MaterialCommunityIcons
                    name="share-variant"
                    size={25}
                    color="#7f8183"
                />
                <Text style={styles.text}>SHARE THE SURF FM 102.5 APP</Text>
            </TouchableOpacity>

        )
    }
}

const styles = StyleSheet.create({
    main: {
        justifyContent: 'space-evenly',
        alignItems: 'center',
        flexDirection: 'row',
        backgroundColor: '#eaf0f5',
        width: '80%',
        // height: "6%",
        paddingVertical: 5,
        borderRadius: 5

    },
    button: {
        alignItems: 'flex-start',
        height: 25,
        width: 25
    },
    text: {
        alignItems: 'flex-end',
        color: '#7f8183',
        fontWeight: '500'
    },


})
