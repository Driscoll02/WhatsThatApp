import React, { Component } from 'react';
import { Text, TextInput, View, Pressable, StyleSheet } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

import * as EmailValidator from 'email-validator';

class Login extends Component {
    constructor(props) {
        super(props);

        this.state = {
            email: "",
            password: "",
            submitted: false,
            error: ""
        };

        this._onButtonPress = this._onButtonPress.bind(this);
    }

    _validateInputs() {
        // Check if fields are empty
        if(this.state.email === "" || this.state.password === "") {
            this.setState({error:"Either the email or password field is empty!"});
            this.setState({submitted:false});
            return;
        } 
        
        // Validate email
        if(!EmailValidator.validate(this.state.email)) {
            this.setState({error:"Email was incorrect"});
            this.setState({submitted:false});
            return;
        }

        // Validate password
        const re = new RegExp("^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,}$");
        if(re.test(this.state.password) === false) {
            this.setState({error:"Password was incorrect"});
            this.setState({submitted:false});
            return;
        }

        // If all validation passes
        if(EmailValidator.validate(this.state.email) && re.test(this.state.password) === true) {
            this._loginUser();

            return;
        }

        return;
    }

    _loginUser() {
        let toSend = {
            email: this.state.email,
            password: this.state.password
        };

        return fetch("http://localhost:3333/api/1.0.0/login", {
            method: 'POST',
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(toSend)
        })
        .then((response) => {
            if(response.status === 200) {
                this.setState({error:"Login successful!"});
                return response.json();
            };
            if(response.status === 400) {
                this.setState({error:"Invalid email or password."});
                throw "Invalid email or password.";
            };
            if(response.status === 500) {
                this.setState({error:"Something went wrong on our end. Please try again."});
                throw "Something went wrong on our end. Please try again.";
            };
        })
        .then(async (resJson) => {
            console.log(resJson);

            try {
                await AsyncStorage.setItem("whatsthat_user_id", resJson.id)
                await AsyncStorage.setItem("whatsthat_session_token", resJson.token)

                this.props.navigation.navigate('Chats');
            } catch {
                throw "Something went wrong."
            }
        })
        .catch((error) => {
            console.log(error);
        })
    }

    _onButtonPress() {
        // reset submitted and error state
        this.setState({submitted:true});
        this.setState({error:""});

        // Validate form inputs
        this._validateInputs();

        return;
    }

    // Reset state when user navigates back to screen
    componentDidMount() {
        this.unsubscribe = this.props.navigation.addListener("focus", () => {
            this.checkLoggedIn();
        })

        const refreshState = this.props.navigation.addListener("focus", () => {
            this.setState({email:"", password:"", submitted:false, error:""});
        })

        return refreshState;
    } 

    componentWillUnmount() {
        this.unsubscribe();
    }

    checkLoggedIn = async () => {
        const userToken = await AsyncStorage.getItem("whatsthat_session_token");
        if (userToken != null) {
            this.props.navigation.navigate('AuthCheck');
        }
    }

    render() {
        return (
            <View style={styles.screenContainer}>
                <Text style={styles.titleTextContainer}>WhatsThat?</Text>
                <View style={styles.formContainer}>
                    <View style={styles.formFieldsContainer}>
                        <Text style={{marginBottom: 20, color: 'black', fontSize: '1.8em'}}>Enter your login:</Text>
                        <TextInput style={styles.fieldContainer} placeholder='Email' value={this.state.email} onChangeText={value=>this.setState({email:value})} />
                        <TextInput style={styles.fieldContainer} secureTextEntry={true} placeholder='Password' value={this.state.password} onChangeText={value=>this.setState({password:value})} />
                        <Pressable style={styles.loginButton} onPress={this._onButtonPress}>
                            <Text>Login</Text>
                        </Pressable>
                    </View>
                    <View style={styles.formExtrasContainer}>
                        <Text style={this.state.error == "Login successful!" ? styles.noErrorMessage : styles.errorMessage}>{this.state.error}</Text>
                        <Text style={styles.signUpText}>Don't have an account? <Text style={{color: 'blue'}} onPress={() => this.props.navigation.navigate('SignUp')}>Click here!</Text></Text>
                    </View>
                </View>
            </View>
        )
    }
}

const styles = StyleSheet.create({
    screenContainer: {
        width: '100%',
        height: '100%',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#349E39'
    },
    titleTextContainer: {
        backgroundColor: '#149966', 
        padding: 10, 
        marginBottom: 30, 
        borderRadius: 10, 
        color: 'white', 
        fontSize: '2.5em'
    },
    formContainer: {
        backgroundColor: '#87FF8D',
        width: '80%',
        height: '50%',
        borderRadius: 20,
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        position: 'relative'
    },
    formFieldsContainer: {
        justifyContent: 'center',
        alignItems: 'center',
        flex: 7
    },
    fieldContainer: {
        marginTop: 20,
        marginBottom: 20,
        padding: 10,
        borderRadius: 10,
        color: 'black',
        backgroundColor: 'white'
    },
    loginButton: {
        width: '35%',
        textAlign: 'center',
        margin: 5,
        padding: 10,
        borderRadius: 10,
        backgroundColor: 'white',
        fontWeight: 'bold'
    },
    formExtrasContainer: {
        flex: 3,
        textAlign: 'center',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center'
    },
    errorMessage: {
        color: 'red',
        alignSelf: 'flex-start',
        alignItems: 'center',
        width: '100%'
    },
    noErrorMessage: {
        color: 'blue',
        alignSelf: 'flex-start',
        textAlign: 'center',
        width: '100%'
    },
    signUpText: {
        justifyContent: 'flex-end',
        marginBottom: 15
    }
})

export default Login