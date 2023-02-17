import React, { Component } from 'react';
import { Text, TextInput, View, Pressable, StyleSheet } from 'react-native';

import * as EmailValidator from 'email-validator';

class Login extends Component {
    constructor(props) {
        super(props);

        this.state = {
            email: "",
            password: "",
            submitted: false,
            error: ""
        }

        this._onButtonPress = this._onButtonPress.bind(this);
    }

    _validateInputs() {
        // Check if fields are empty
        if(this.state.email === "" || this.state.password === "") {
            this.setState({error:"Either the email or password field is empty!"});
            return;
        } 
        
        // Validate email
        if(!EmailValidator.validate(this.state.email)) {
            this.setState({error:"Email was incorrect"});
            return;
        }

        // Validate password
        const re = new RegExp("^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,}$");
        if(re.test(this.state.password) === false) {
            this.setState({error:"Password was incorrect"});
            return;
        }

        // If all validation passes
        if(EmailValidator.validate(this.state.email) && re.test(this.state.password) === true) {
            this.setState({error:"Logging you in!"});
            return;
        }

        return;
    }

    _onButtonPress() {
        // reset submitted and error state
        this.setState({submitted:true});
        this.setState({error:""});

        // Validate form inputs
        this._validateInputs();

        return;
    }

    render() {
        return (
            <View style={styles.formContainer}>
                <TextInput style={styles.fieldContainer} placeholder='Email' onChangeText={value=>this.setState({email:value})} />
                <TextInput style={styles.fieldContainer} secureTextEntry={true} placeholder='Password' onChangeText={value=>this.setState({password:value})} />
                <Pressable style={styles.loginButton} onPress={this._onButtonPress}>
                    <Text>Login</Text>
                </Pressable>
                <View>
                    <Text style={this.state.error == "Logging you in!" ? styles.noErrorMessage : styles.errorMessage}>{this.state.error}</Text>
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
    },
    errorMessage: {
        color: 'red',
        marginTop: '20px'
    },
    noErrorMessage: {
        color: 'blue',
        marginTop: '20px'
    }
})

export default Login