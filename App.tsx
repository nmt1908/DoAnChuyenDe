import React, { useState } from 'react';
import { View, TextInput, TouchableOpacity, Text, StyleSheet } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createDrawerNavigator } from '@react-navigation/drawer';
import HomeTab from './component/HomeTab';  // Import HomeTab vừa tạo
import Icon from 'react-native-vector-icons/Ionicons';  // Thư viện icon
import Feather from 'react-native-vector-icons/Feather';
import CustomDrawerContent from './component/CustomDrawerContent';
import LoginScreen from './screen/auth/LoginScreen';
import RegisterScreen from './screen/auth/RegisterScreen';
import ForgetPasswordScreen from './screen/auth/ForgetPasswordScreen';
import SplashScreen from './screen/SplashScreen';
import DetailProductScreen from './screen/DetailProductScreen';
import AdminHomeScreen from './screen/admin/AdminHomeScreen';
import BrandManagement from './screen/admin/BrandManagement';
import AddBrandScreen from './screen/admin/AddBrandScreen';
import CategoryManagement from './screen/admin/CategoryManagement';

import { UserProvider } from './UserContext';
import AddCategoryScreen from './screen/admin/AddCategoryScreen';


const Drawer = createDrawerNavigator();

// Tạo Header Tùy Chỉnh
const CustomHeader = ({ navigation }) => {
  
  const [searchText, setSearchText] = useState('');
  return (
    <View style={styles.headerContainer}>
      {/* Nút Menu (Drawer) */}
      <TouchableOpacity onPress={() => navigation.openDrawer()} style={styles.iconContainer}>
        <Icon name="menu-outline" size={30} color="#fff" />
      </TouchableOpacity>

      {/* Thanh tìm kiếm */}
      <View style={styles.searchContainer}>
        <Icon name="search-outline" size={20} color="#000" style={styles.searchIcon} />
        <TextInput
          placeholder="Tìm sản phẩm"
          style={styles.searchInput}
          placeholderTextColor="#000"
          value={searchText} // Giá trị từ state
          onChangeText={(text) => setSearchText(text)} // Cập nhật state khi nhập liệu
        />
        {searchText ? (
          <TouchableOpacity onPress={() => setSearchText('')} style={styles.clearIconContainer}>
            <Feather name="x-circle" size={20} color="#000" />
          </TouchableOpacity>
        ) : null}
      </View>

      {/* Nút Bộ Lọc */}
      <TouchableOpacity style={styles.iconContainer}>
        <Icon name="filter-outline" size={30} color="#000" />
      </TouchableOpacity>
    </View>
  );
};



// Tạo Drawer Navigator kết hợp với Bottom Tab
export default function App() {
  return (
    <UserProvider>
      <NavigationContainer>
        <Drawer.Navigator
          drawerContent={(props) => <CustomDrawerContent {...props} />}  // Sử dụng nội dung Drawer tùy chỉnh
        >
          {/* Đăng ký màn hình chính */}
          <Drawer.Screen
            name="SplashScreen"
            component={SplashScreen}
            options={{
              headerShown: false,
            }}
          />
          <Drawer.Screen
            name="HomeTab"
            component={HomeTab}
            options={{
              header: ({ navigation }) => <CustomHeader navigation={navigation} />,
              headerShown: true,  // Hiển thị header tùy chỉnh
            }}
          />

          

          <Drawer.Screen
            name="LoginScreen"
            component={LoginScreen}
            options={{
              headerShown: false,
            }}
          />
          <Drawer.Screen
            name="AdminHomeScreen"
            component={AdminHomeScreen}
            options={{
              headerShown: false,
            }}
          />
          <Drawer.Screen
            name="BrandManagement"
            component={BrandManagement}
            options={{
              headerShown: false,
            }}
          />
          <Drawer.Screen
            name="AddBrandScreen"
            component={AddBrandScreen}
            options={{
              headerShown: false,
            }}
          />
          <Drawer.Screen
            name="DetailProductScreen"
            component={DetailProductScreen}
            options={{
              headerShown: false,
            }}
          />
          
          <Drawer.Screen
            name="RegisterScreen"
            component={RegisterScreen}
            options={{
              headerShown: false,
            }}
          />
          <Drawer.Screen
            name="ForgetPasswordScreen"
            component={ForgetPasswordScreen}
            options={{
              headerShown: false,
            }}
          />
          <Drawer.Screen
            name="CategoryManagement"
            component={CategoryManagement}
            options={{
              headerShown: false,
            }}
          />
          <Drawer.Screen
            name="AddCategoryScreen"
            component={AddCategoryScreen}
            options={{
              headerShown: false,
            }}
          />
        </Drawer.Navigator>
      </NavigationContainer>
    </UserProvider>

  );
}

// Style cho Header và các thành phần
const styles = StyleSheet.create({
  headerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#EE4D2D',
    paddingHorizontal: 10,
    paddingVertical: 10,
  },
  iconContainer: {
    padding: 5,
  },
  searchContainer: {
    flexDirection: 'row',
    backgroundColor: '#fff',  // Màu nền của ô tìm kiếm
    borderRadius: 20,  // Bo góc
    flex: 1,
    marginHorizontal: 10,
    alignItems: 'center',
    paddingHorizontal: 10,
  },
  searchInput: {
    flex: 1,
    padding: 5,
    color: '#000',
  },
  searchIcon: {
    marginRight: 5,
  },
  clearIconContainer: {
    marginLeft: 5, // Khoảng cách giữa icon xóa và nội dung tìm kiếm
  },
});