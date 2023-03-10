import React, { Component } from 'react';
import { Text, TextInput, View, Pressable, StyleSheet } from 'react-native';

import * as EmailValidator from 'email-validator';

class SignUp extends Component {
    constructor(props) {
        super(props);

        this.state = {
            first_name: "",
            last_name: "",
            email: "",
            password: "",
            submitted: false,
            error: ""
        };

        this._onButtonPress = this._onButtonPress.bind(this);
    }

    _validateInputs() {
        // Check if fields are empty
        if(this.state.first_name == "" || this.state.last_name == "" || this.state.email === "" || this.state.password === "") {
            this.setState({error:"All fields need to be completed"});
            this.setState({submitted:false});
            return;
        } 

        // Validate first name
        if(this.state.first_name == "" || this.state.first_name.length <= 2) {
            this.setState({error:"First name invalid"});
            this.setState({submitted:false});
            return;
        }

        // Validate last name
        if(this.state.last_name == "" || this.state.last_name.length <= 2) {
            this.setState({error:"Last name invalid"});
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
            this.setState({error:"Password not strong enough"});
            this.setState({submitted:false});
            return;
        }

        // If all validation passes
        if((this.state.first_name != "" && this.state.first_name.length > 2) && (this.state.last_name != "" && this.state.last_name.length > 2) && EmailValidator.validate(this.state.email) && re.test(this.state.password) === true) {
            this.setState({error:"Thanks for signing up!"});
            this.setState({submitted:true});

            this._createUser();

            return;
        }

        return;
    }

    _createUser() {
        let toSend = {
            first_name: this.state.first_name,
            last_name: this.state.last_name,
            email: this.state.email,
            password: this.state.password
        };

        return fetch("http://localhost:3333/api/1.0.0/user", {
            method: 'POST',
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(toSend)
        })
        .then((response) => {
            if(response.status === 201) this.setState({error:"Signup successful!"});
            if(response.status === 400) {
                this.setState({error:"Something you entered was wrong. Please check your info and try again."});
                throw "Something you entered was wrong. Please check your info and try again.";
            }
            if(response.status === 500) {
                this.setState({error:"Something went wrong on our end. Please try again."});
                throw "Something went wrong on our end. Please try again.";
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

    
    componentDidMount() {
        this.checkLoggedIn();

        // Reset state when user navigates back to screen
        const refreshState = this.props.navigation.addListener("focus", () => {
            this.setState({first_name:"", last_name:"", email:"", password:"", submitted:false, error:""})
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
                        <Text style={{marginBottom: 20, marginTop: 20, color: 'black', fontSize: '1.8em'}}>Enter your details:</Text>
                        <TextInput style={styles.fieldContainer} placeholder='First name' value={this.state.first_name} onChangeText={value=>this.setState({first_name:value})} />
                        <TextInput style={styles.fieldContainer} placeholder='Last name' value={this.state.last_name} onChangeText={value=>this.setState({last_name:value})} />
                        <TextInput style={styles.fieldContainer} placeholder='Email' value={this.state.email} onChangeText={value=>this.setState({email:value})} />
                        <TextInput style={styles.fieldContainer} secureTextEntry={true} placeholder='Password' value={this.state.password} onChangeText={value=>this.setState({password:value})} />
                        <Pressable style={styles.signupButton} onPress={this._onButtonPress}>
                            <Text>SignUp</Text>
                        </Pressable>
                    </View>
                    <View style={styles.formExtrasContainer}>
                        <Text style={this.state.error == "Logging you in!" ? styles.noErrorMessage : styles.errorMessage}>{this.state.error}</Text>
                        <Text style={styles.signUpText}>Already have an account? <Text style={{color: 'blue'}} onPress={() => this.props.navigation.navigate('Login')}>Click here!</Text></Text>
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
        height: '60%',
        borderRadius: 20,
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        position: 'relative'
    },
    formFieldsContainer: {
        justifyContent: 'center',
        alignItems: 'center',
        flex: 7,
        display: 'flex',
        justifyContent: 'space-between'
    },
    fieldContainer: {
        padding: 10,
        borderRadius: 10,
        color: 'black',
        backgroundColor: 'white'
    },
    signupButton: {
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

export default SignUp