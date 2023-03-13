import React, { Component } from 'react';
import { View, Text } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import PropTypes from 'prop-types';

class AuthCheck extends Component {
  constructor(props) {
    super(props);

    this.checkLoggedIn = this.checkLoggedIn.bind(this);
  }

  // Check if user is logged in on load
  componentDidMount() {
    const { navigation } = this.props;
    this.unsubscribe = navigation.addListener('focus', () => {
      this.checkLoggedIn();
    });
  }

  // Unsubscribe to prevent memory leak
  componentWillUnmount() {
    this.unsubscribe();
  }

  // Check if the user token exists
  checkLoggedIn = async () => {
    const { navigation } = this.props;

    const userToken = await AsyncStorage.getItem('whatsthat_session_token');
    if (userToken == null || undefined) {
      navigation.navigate('Login');
    } else {
      navigation.navigate('Chats');
    }
  };

  render() {
    return (
      <View>
        <Text>Text</Text>
      </View>
    );
  }
}

AuthCheck.propTypes = {
  navigation: PropTypes.shape({
    navigate: PropTypes.func.isRequired,
    addListener: PropTypes.func.isRequired,
  }).isRequired,
};

export default AuthCheck;
