import React, { Component } from 'react';
import {
  Text,
  TextInput,
  View,
  Pressable,
  StyleSheet,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import PropTypes from 'prop-types';

import * as EmailValidator from 'email-validator';

class Login extends Component {
  constructor(props) {
    super(props);

    this.state = {
      email: '',
      password: '',
      error: '',
    };

    this.onButtonPress = this.onButtonPress.bind(this);
  }

  componentDidMount() {
    const { navigation } = this.props;

    this.unsubscribe = navigation.addListener('focus', () => {
      this.checkLoggedIn();
    });

    // Reset state when user navigates back to screen
    const refreshState = navigation.addListener('focus', () => {
      this.setState({
        email: '',
        password: '',
        error: '',
      });
    });

    return refreshState;
  }

  componentWillUnmount() {
    this.unsubscribe();
  }

  onButtonPress() {
    // reset submitted and error state
    this.setState({ error: '' });

    // Validate form inputs
    this.validateInputs();
  }

  checkLoggedIn = async () => {
    const { navigation } = this.props;

    const userToken = await AsyncStorage.getItem('whatsthat_session_token');
    if (userToken != null) {
      navigation.navigate('AuthCheck');
    }
  };

  loginUser() {
    const { email, password } = this.state;

    const toSend = {
      email,
      password,
    };

    return fetch('http://localhost:3333/api/1.0.0/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(toSend),
    })
      .then((response) => {
        if (response.status === 200) {
          this.setState({ error: 'Login successful!' });
          return response.json();
        }

        if (response.status === 400) {
          throw new Error('Invalid email or password.');
        } else if (response.status === 500) {
          throw new Error('Something went wrong on our end. Please try again.');
        } else {
          throw new Error('Something went wrong. Please contact us.');
        }
      })
      .then(async (resJson) => {
        await AsyncStorage.setItem('whatsthat_user_id', resJson.id);
        await AsyncStorage.setItem('whatsthat_session_token', resJson.token);

        const { navigation } = this.props;
        navigation.navigate('AuthCheck');
      })
      .catch((error) => {
        this.setState({ error: error.message });
      });
  }

  validateInputs() {
    const { email, password } = this.state;

    // Check if fields are empty
    if (email === '' || password === '') {
      this.setState({ error: 'Either the email or password field is empty!' });
      return;
    }

    // Validate email
    if (!EmailValidator.validate(email)) {
      this.setState({ error: 'Email was incorrect' });
      return;
    }

    // Validate password
    const re = /^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,}$/;
    if (re.test(password) === false) {
      this.setState({ error: 'Password was incorrect' });
      return;
    }

    // If all validation passes
    if (EmailValidator.validate(email) && re.test(password) === true) {
      this.loginUser();
    }
  }

  render() {
    const { email, password, error } = this.state;
    const { navigation } = this.props;

    return (
      <View style={styles.screenContainer}>
        <Text style={styles.titleTextContainer}>WhatsThat?</Text>
        <View style={styles.formContainer}>
          <View style={styles.formFieldsContainer}>
            <Text style={{ marginBottom: 20, color: 'black', fontSize: '1.8em' }}>Enter your login:</Text>
            <TextInput style={styles.fieldContainer} placeholder="Email" value={email} onChangeText={(value) => this.setState({ email: value })} />
            <TextInput style={styles.fieldContainer} secureTextEntry placeholder="Password" value={password} onChangeText={(value) => this.setState({ password: value })} />
            <Pressable style={styles.loginButton} onPress={this.onButtonPress}>
              <Text>Login</Text>
            </Pressable>
          </View>
          <View style={styles.formExtrasContainer}>
            <Text style={error === 'Login successful!' ? styles.noErrorMessage : styles.errorMessage}>{error}</Text>
            <Text style={styles.signUpText}>
              Not have an account?
              <Text style={{ color: 'blue' }} onPress={() => navigation.navigate('SignUp')}>Click here!</Text>
            </Text>
          </View>
        </View>
      </View>
    );
  }
}

Login.propTypes = {
  navigation: PropTypes.shape({
    navigate: PropTypes.func.isRequired,
    addListener: PropTypes.func.isRequired,
  }).isRequired,
};

const styles = StyleSheet.create({
  screenContainer: {
    width: '100%',
    height: '100%',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#349E39',
  },
  titleTextContainer: {
    backgroundColor: '#149966',
    padding: 10,
    marginBottom: 30,
    borderRadius: 10,
    color: 'white',
    fontSize: '2.5em',
  },
  formContainer: {
    backgroundColor: '#87FF8D',
    width: '80%',
    height: '50%',
    borderRadius: 20,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
  },
  formFieldsContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    flex: 7,
  },
  fieldContainer: {
    marginTop: 20,
    marginBottom: 20,
    padding: 10,
    borderRadius: 10,
    color: 'black',
    backgroundColor: 'white',
  },
  loginButton: {
    width: '35%',
    textAlign: 'center',
    margin: 5,
    padding: 10,
    borderRadius: 10,
    backgroundColor: 'white',
    fontWeight: 'bold',
  },
  formExtrasContainer: {
    flex: 3,
    textAlign: 'center',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  errorMessage: {
    color: 'red',
    alignSelf: 'flex-start',
    alignItems: 'center',
    width: '100%',
  },
  noErrorMessage: {
    color: 'blue',
    alignSelf: 'flex-start',
    textAlign: 'center',
    width: '100%',
  },
  signUpText: {
    justifyContent: 'flex-end',
    marginBottom: 15,
  },
});

export default Login;
