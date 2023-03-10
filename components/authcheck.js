import React, { Component, View, Text, StyleSheet } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

class AuthCheck extends Component {
    constructor(props) {
        super(props);

        this.checkLoggedIn = this.checkLoggedIn.bind(this);
    }

    componentDidMount(){
        this.unsubscribe = this.props.navigation.addListener("focus", () => {
            this.checkLoggedIn();
        })
    }

    componentWillUnmount() {
        this.unsubscribe();
    }

    checkLoggedIn = async () => {
        const userToken = await AsyncStorage.getItem("whatsthat_session_token");
        if (userToken == null) {
            this.props.navigate('Login');
        }
    }
    
    render() {
        return (
            <div>
                <h1>Text</h1>
            </div>
        )
    }
}

export default AuthCheck