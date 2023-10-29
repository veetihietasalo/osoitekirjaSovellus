import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import Places from './Places'; // import your Places screen
import MapQuest from './MapQuest'; // import your MapQuest screen

const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Places">
        <Stack.Screen name="Places" component={Places} />
        <Stack.Screen name="MapQuest" component={MapQuest} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
