import React, { Component } from 'react';
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
} from 'react-native'

export const ButtonLime = (props) => {
    return <View>
        <TouchableOpacity style={styles.LimeButton}
            disabled={props.disabled}
            onPress={props.onPress}>
            <Text style={styles.LoginText}>
                {props.label}
            </Text>
        </TouchableOpacity>
    </View>
}

export const ButtonDefault = (props) => {
    return <View>
        <TouchableOpacity style={styles.DefaultButton}
            onPress={props.onPress}
            disabled={props.disabled}>
            <Text style={styles.LoginText}>
                {props.label}
            </Text>
        </TouchableOpacity>
    </View>
}

const styles = StyleSheet.create({
    LimeButton: {
        padding: 10,
        backgroundColor: '#33cc33',
        marginBottom: 10
    },
    LoginText: {
        textAlign: 'center',
    }
})

