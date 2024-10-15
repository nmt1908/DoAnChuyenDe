import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Animated } from 'react-native';
import * as Animatable from 'react-native-animatable';
import AdminHomeScreen from '../screen/admin/AdminHomeScreen';
import AccountScreen from '../screen/AccountScreen';
import CartScreen from '../screen/CartScreen';
import NotificationScreen from '../screen/NotificationScreen';
import Icon from 'react-native-vector-icons';

const Tab = createBottomTabNavigator();

const AnimatedTabScreen = (Component) => {
  return (props) => (
    <Animatable.View 
      style={{ flex: 1 }} 
      animation="fadeIn" 
      duration={300} 
    >
      <Component {...props} />
    </Animatable.View>
  );
};

function HomeTab() {
  return (
    <Tab.Navigator>
      <Tab.Screen 
        name="Home" 
        component={AnimatedTabScreen(AdminHomeScreen)} 
        options={{ headerShown: false }} 
      />
      <Tab.Screen 
        name="Cart" 
        component={AnimatedTabScreen(CartScreen)} 
        options={{ headerShown: false }} 
      />
      <Tab.Screen 
        name="Notification" 
        component={AnimatedTabScreen(NotificationScreen)} 
        options={{ headerShown: false }} 
      />
      <Tab.Screen 
        name="Account" 
        component={AnimatedTabScreen(AccountScreen)} 
        options={{ headerShown: false }} 
      />
    </Tab.Navigator>
  );
}

export default HomeTab;