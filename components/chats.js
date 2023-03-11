import React, { Component } from 'react';
import { Text, TextInput, View, Pressable, StyleSheet, FlatList, ActivityIndicator } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

class Chats extends Component {
    constructor(props) {
        super(props)

        this.state = {
            chatList: [],
            isLoading: true
        }

        this._getChats = this._getChats.bind(this);
    }

    _getChats(authToken) {
        return fetch("http://localhost:3333/api/1.0.0/chat", {
            headers: {
                "Content-Type": "application/json",
                "X-Authorization": authToken
            }
        })
        .then(response => {
            return response.json();
        })
        .then(resJson => {
            this.setState({chatList: resJson});
            this.setState({isLoading: false});
        })
        .catch(error => {
            console.log(error);
        })
    }

    async componentDidMount() {
        const token = await AsyncStorage.getItem("whatsthat_session_token");

        this._getChats(token);
    }

    render() {
        if(this.state.isLoading) {
            return (
                <View>
                   <ActivityIndicator />
                </View>
            )
        }

        return (
            <View>
                {console.log(this.state.chatList)}
                <FlatList
                data={this.state.chatList}
                renderItem={({item}) => <Text>{item.name}</Text>}
                keyExtractor={item => item.chat_id}
                />
            </View>
        );
    }
}

export default Chats