import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View } from 'react-native';
import Login from './components/login';
import SignUp from './components/signup';
import Chats from './components/chats';
import { NavigationContainer } from '@react-navigation/native'
import { createNativeStackNavigator } from '@react-navigation/native-stack';

const NavStack = createNativeStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <NavStack.Navigator initialRouteName='Login'>
        <NavStack.Screen options={{headerShown: false}} name='Login' component={Login} />
        <NavStack.Screen name='SignUp' component={SignUp} />
        <NavStack.Screen options={{headerShown: false}} name='Chats' component={Chats} />
      </NavStack.Navigator>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#349E39'
  },
});
