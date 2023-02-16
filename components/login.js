import React, { Component } from 'react';
import { Text, TextInput, View, Pressable, Alert, StyleSheet } from 'react-native';

import * as EmailValidator from 'email-validator';

class Login extends Component {
    constructor(props) {
        super(props)

        this.state = {
            email: "",
            password: "",
            submitted: false,
            error: ''
        }

        this._onButtonPress = this._onButtonPress.bind(this);
    }

    _onButtonPress() {
        this.setState({submitted: true})
        
        // Validate entered info
        if(!EmailValidator.validate(this.state.email)) {
            this.setState({error:"Email was incorrect"})
            return;
        }

        return;
    }

    render() {
        return (
            <View style={styles.formContainer}>
                <TextInput style={styles.fieldContainer} placeholder='Email' onChangeText={value=>this.setState({email:value})} />
                <TextInput style={styles.fieldContainer} placeholder='Password' onChangeText={value=>this.setState({password:value})} />
                <Pressable style={styles.loginButton} onPress={this._onButtonPress}>
                    <Text>Login</Text>
                </Pressable>
                <View>
                    <Text>{this.state.error}</Text>
                </View>
            </View>
        )
    }
}

const styles = StyleSheet.create({
    formContainer: {
        backgroundColor: '#87FF8D',
        width: '80%',
        height: '50%',
        borderRadius: '5%',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
    },
    fieldContainer: {
        marginTop: 20,
        marginBottom: 20,
        border: 10,
        borderColor: 'black',
        color: 'black',
        backgroundColor: 'white'
    },
    loginButton: {
        width: '35%',
        textAlign: 'center',
        padding: 10,
        borderRadius: '15%',
        backgroundColor: 'white',
        fontWeight: 'bold'
    }
})

export default Login