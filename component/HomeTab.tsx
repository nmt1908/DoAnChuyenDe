import React from 'react';
import { View, Text } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import * as Animatable from 'react-native-animatable';
import AdminHomeScreen from '../screen/admin/AdminHomeScreen';
import AccountScreen from '../screen/AccountScreen';
import CartScreen from '../screen/CartScreen';
import NotificationScreen from '../screen/NotificationScreen';
import Icon from 'react-native-vector-icons/Feather';

const Tab = createBottomTabNavigator();

// Component Biểu Tượng Hoạt Hình
const AnimatedTabIcon = ({ name, focused }) => {
  const animation = focused ? 'bounceIn' : 'fadeInUp';
  const iconSize = focused ? 30 : 24;  // Phóng to biểu tượng khi được chọn
  const iconColor = focused ? '#EE4D2D' : '#fff';  // Đổi màu cam khi chọn
  const backgroundColor = focused ? '#F2F2F2' : 'transparent';  // Nền trắng khi được chọn

  return (
    <Animatable.View
      animation={animation}
      duration={200}
      style={{
        alignItems: 'center',
        justifyContent: 'center',
        width: 60,
        height: 60,
        borderRadius: 30,  // Nền tròn phía sau biểu tượng
        backgroundColor: backgroundColor,  // Nền trắng khi chọn
        marginBottom: focused ? 20 : 0,  // Đẩy biểu tượng lên khi chọn
      }}
    >
      <Icon name={name} size={iconSize} color={iconColor} />
    </Animatable.View>
  );
};

const HomeTab = () => {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused }) => {
          const iconName = {
            'Trang chủ': 'home',
            'Thông báo': 'bell',
            'Giỏ hàng': 'shopping-bag',
            'Tài khoản': 'user'
          }[route.name];

          return (
            <View style={{ justifyContent: 'center', alignItems: 'center' }}>
              <AnimatedTabIcon name={iconName} focused={focused} />
            </View>
          );
        },
        tabBarLabel: ({ focused }) => (
          <Text style={{ color: focused ? '#fff' : '#fff', fontSize: 12 }}>
            {route.name}
          </Text>
        ),
        tabBarStyle: {
          height: 70,
          backgroundColor: '#EE4D2D',  // Màu nền thanh điều hướng
          position: 'absolute',
          bottom: 10,
          right: 10,
          left: 10,
          borderRadius: 20,  // Bo tròn thanh điều hướng
          borderTopWidth: 0,
          elevation: 10,
        },
        tabBarLabelStyle: {
          paddingBottom: 5,
        },
        tabBarIconStyle: {
          paddingTop: 1,
        },
        headerShown: false,
      })}
    >
      <Tab.Screen
        name="Trang chủ"
        component={AdminHomeScreen}
      />
      
      <Tab.Screen
        name="Giỏ hàng"
        component={CartScreen}
      />
      <Tab.Screen
        name="Thông báo"
        component={NotificationScreen}
      />
      <Tab.Screen
        name="Tài khoản"
        component={AccountScreen}
      />
      
    </Tab.Navigator>
  );
};

export default HomeTab;