import React, { Component } from 'react';
import {
  Text,
  View,
  FlatList,
  ActivityIndicator,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

class Chats extends Component {
  constructor(props) {
    super(props);

    this.state = {
      chatList: [],
      isLoading: true,
      error: '',
    };

    this.getChats = this.getChats.bind(this);
  }

  async componentDidMount() {
    const token = await AsyncStorage.getItem('whatsthat_session_token');

    this.getChats(token);
  }

  getChats(authToken) {
    return fetch('http://localhost:3333/api/1.0.0/chat', {
      headers: {
        'Content-Type': 'application/json',
        'X-Authorization': authToken,
      },
    })
      .then((response) => response.json())
      .then((resJson) => {
        this.setState({ chatList: resJson });
        this.setState({ isLoading: false });
      })
      .catch((err) => {
        this.setState({ error: err });
      });
  }

  render() {
    const { chatList, isLoading, error } = this.state;

    if (isLoading) {
      return (
        <View>
          <ActivityIndicator />
        </View>
      );
    }

    if (error !== '') {
      return (
        <View>
          <Text>
            Something went wrong:
            {error}
          </Text>
        </View>
      );
    }

    return (
      <View>
        <FlatList
          data={chatList}
          renderItem={({ item }) => <Text>{item.name}</Text>}
          keyExtractor={(item) => item.chat_id}
        />
      </View>
    );
  }
}

export default Chats;
