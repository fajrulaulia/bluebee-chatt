import React, { Component } from 'react';
import {
    TextInput,
    StyleSheet,
    Text,
    View
} from 'react-native';

export const Textfield = (props) => {
    return (<View>
        <Text style={styles.title}>{props.placeholder}</Text>
        <TextInput
            style={styles.inputField}
            placeholder={props.placeholder}
            returnKeyType='next'
            onChangeText={props.onChange}
            value={props.value}
            keyboardType={props.keyboardType}
            autoCorrect={false} />
    </View>)

}

export const Passwordfield = (props) => {
    return <View>
        <Text style={styles.title}>{props.placeholder}</Text>
        <TextInput
            style={styles.inputField}
            placeholder={props.placeholder}
            secureTextEntry
            onChangeText={props.onChange}
            value={props.value}
            ref={(input) => this.passwordInput = input} />
    </View>
}


const styles = StyleSheet.create({
    inputField: {
        borderBottomWidth: 2,
        color: '#000',
        padding: 0,
        marginBottom: 20
    },
    title: {
        color: '#999'
    }
})

