import React, { Component } from 'react';
import {
  Text, TextInput, View, Pressable, StyleSheet, ActivityIndicator,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import PropTypes from 'prop-types';

import * as EmailValidator from 'email-validator';

class SignUp extends Component {
  constructor(props) {
    super(props);

    this.state = {
      firstName: '',
      lastName: '',
      email: '',
      password: '',
      submitted: false,
      error: '',
    };

    this.onButtonPress = this.onButtonPress.bind(this);
  }

  componentDidMount() {
    this.checkLoggedIn();

    const { navigation } = this.props;
    // Reset state when user navigates back to screen
    const refreshState = navigation.addListener('focus', () => {
      this.setState({
        firstName: '',
        lastName: '',
        email: '',
        password: '',
        submitted: false,
        error: '',
      });
    });

    return refreshState;
  }

  onButtonPress() {
    // reset submitted and error state
    this.setState({ submitted: true });
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

  validateInputs() {
    const {
      firstName, lastName, email, password,
    } = this.state;

    // Check if fields are empty
    if (firstName === '' || lastName === '' || email === '' || password === '') {
      this.setState({ error: 'All fields need to be completed' });
      this.setState({ submitted: false });
      return;
    }

    // Validate first name
    if (firstName === '' || firstName.length <= 2) {
      this.setState({ error: 'First name invalid' });
      this.setState({ submitted: false });
      return;
    }

    // Validate last name
    if (lastName === '' || lastName.length <= 2) {
      this.setState({ error: 'Last name invalid' });
      this.setState({ submitted: false });
      return;
    }

    // Validate email
    if (!EmailValidator.validate(email)) {
      this.setState({ error: 'Email was incorrect' });
      this.setState({ submitted: false });
      return;
    }

    // Validate password
    const re = /^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,}$/;
    if (re.test(password) === false) {
      this.setState({ error: 'Password not strong enough' });
      this.setState({ submitted: false });
      return;
    }

    // If all validation passes
    if ((firstName !== '' && firstName.length > 2) && (lastName !== '' && lastName.length > 2) && EmailValidator.validate(email) && re.test(password) === true) {
      this.setState({ error: 'Thanks for signing up!' });
      this.setState({ submitted: true });

      this.createUser();
    }
  }

  createUser() {
    const {
      firstName, lastName, email, password,
    } = this.state;

    const toSend = {
      first_name: firstName,
      last_name: lastName,
      email,
      password,
    };

    return fetch('http://localhost:3333/api/1.0.0/user', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(toSend),
    })
      .then((response) => {
        this.setState({ submitted: false });

        if (response.status === 201) {
          this.setState({ error: 'Signup successful!' });
          const { navigation } = this.props;
          navigation.navigate('Login');
        }

        if (response.status === 400) {
          throw new Error('Something you entered was wrong. Please check your info and try again.');
        } else if (response.status === 500) {
          throw new Error('Something went wrong on our end. Please try again.');
        } else {
          throw new Error('Something went wrong. Please contact us.');
        }
      })
      .catch((error) => {
        this.setState({ error: error.message });
      });
  }

  render() {
    const {
      firstName, lastName, email, password, error, submitted,
    } = this.state;

    const { navigation } = this.props;

    if (submitted) {
      return (
        <View style={styles.screenContainer}>
          <ActivityIndicator />
        </View>
      );
    }

    return (
      <View style={styles.screenContainer}>
        <Text style={styles.titleTextContainer}>WhatsThat?</Text>
        <View style={styles.formContainer}>
          <View style={styles.formFieldsContainer}>
            <Text style={{
              marginBottom: 20, marginTop: 20, color: 'black', fontSize: '1.8em',
            }}
            >
              Enter your details:
            </Text>
            <TextInput style={styles.fieldContainer} placeholder="First name" value={firstName} onChangeText={(value) => this.setState({ firstName: value })} />
            <TextInput style={styles.fieldContainer} placeholder="Last name" value={lastName} onChangeText={(value) => this.setState({ lastName: value })} />
            <TextInput style={styles.fieldContainer} placeholder="Email" value={email} onChangeText={(value) => this.setState({ email: value })} />
            <TextInput style={styles.fieldContainer} secureTextEntry placeholder="Password" value={password} onChangeText={(value) => this.setState({ password: value })} />
            <Pressable style={styles.signupButton} onPress={this.onButtonPress}>
              <Text>SignUp</Text>
            </Pressable>
          </View>
          <View style={styles.formExtrasContainer}>
            <Text style={error === 'Logging you in!' ? styles.noErrorMessage : styles.errorMessage}>{error}</Text>
            <Text style={styles.signUpText}>
              Already have an account?
              <Text style={{ color: 'blue' }} onPress={() => navigation.navigate('Login')}>Click here!</Text>
            </Text>
          </View>
        </View>
      </View>
    );
  }
}

SignUp.propTypes = {
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
    height: '60%',
    borderRadius: 20,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
  },
  formFieldsContainer: {
    alignItems: 'center',
    flex: 7,
    display: 'flex',
    justifyContent: 'space-between',
  },
  fieldContainer: {
    padding: 10,
    borderRadius: 10,
    color: 'black',
    backgroundColor: 'white',
  },
  signupButton: {
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

export default SignUp;
