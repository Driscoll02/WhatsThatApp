import React, { Component } from 'react';
import { Text, TextInput, View, Pressable, Alert, StyleSheet } from 'react-native';

class Login extends Component {
    constructor(props) {
        super(props)

        this.state = {
            email: "",
            password: "",
            submitted: false
        }

        this._onButtonPress = this._onButtonPress.bind(this);
    }

    _onButtonPress() {
        this.setState({submitted: true})
        
        // Validate entered info
        

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
        color: 'white',
        backgroundColor: '#5A5A5A'
    },
    loginButton: {
        width: '35%',
        textAlign: 'center',
        padding: 10,
        borderRadius: '15%',
        backgroundColor: '#5A5A5A',
        fontWeight: 'bold'
    }
})

export default Login