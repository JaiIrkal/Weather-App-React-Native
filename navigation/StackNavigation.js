import { View, Text } from 'react-native'
import React from 'react'
import { NavigationContainer } from '@react-navigation/native'
import { createNativeStackNavigator } from '@react-navigation/native-stack'
import HomeScreen from '../screens/HomeScreen'

const Stack = createNativeStackNavigator()

const StackNavigation = () => {
  return (
    <NavigationContainer>
        <Stack.Navigator initialRouteName='Home'>
            <Stack.Screen name='Home' component={HomeScreen} options={{headerShown:false}}/>
        </Stack.Navigator>
    </NavigationContainer>
  )
}

export default StackNavigation