import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createDrawerNavigator } from '@react-navigation/drawer';
import HomeTab from './component/HomeTab';  // Import HomeTab vừa tạo

const Drawer = createDrawerNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Drawer.Navigator>
        <Drawer.Screen name="HomeTab" component={HomeTab} />
      </Drawer.Navigator>
    </NavigationContainer>
  );
}