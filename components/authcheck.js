import React, { Component} from 'react';
import { View, Text, StyleSheet  } from 'react-native'
import AsyncStorage from '@react-native-async-storage/async-storage';

class AuthCheck extends Component {
    constructor(props) {
        super(props);

        this.checkLoggedIn = this.checkLoggedIn.bind(this);
    }

    // Check if user is logged in on load
    componentDidMount(){
        this.unsubscribe = this.props.navigation.addListener("focus", () => {
            this.checkLoggedIn();
        })
    }

    // Unsubscribe to prevent memory leak
    componentWillUnmount() {
        this.unsubscribe();
    }

    // Check if the user token exists
    checkLoggedIn = async () => {
        const userToken = await AsyncStorage.getItem("whatsthat_session_token");
        if (userToken == null) {
            this.props.navigate('Login');
        }
    }
    
    render() {
        return (
            <View>
                <Text>Text</Text>
            </View>
        )
    }
}

export default AuthCheck