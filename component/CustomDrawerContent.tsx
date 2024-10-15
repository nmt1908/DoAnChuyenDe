import React from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons'; // Thư viện icon

const CustomDrawerContent = (props) => {
  return (
    <View style={styles.drawerContainer}>
      {/* Header - Ảnh đại diện và thông tin người dùng */}
      <View style={styles.header}>
        <Image
          source={require('../assets/images/avatar.png')} // Thay bằng hình ảnh của bạn
          style={styles.avatar}
        />
        <Text style={styles.userName}>Nguyễn Văn Admin</Text>
        <Text style={styles.userEmail}>nguyenvana@gmail.com</Text>
      </View>

      {/* Các mục điều hướng */}
      <View style={styles.menuContainer}>
        <TouchableOpacity style={styles.menuItem} onPress={() => props.navigation.navigate('ProductManagement')}>
          <Icon name="cafe-outline" size={20} color="#774C60" />
          <Text style={styles.menuText}>Quản lý sản phẩm</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.menuItem} onPress={() => props.navigation.navigate('CategoryManagement')}>
          <Icon name="cube-outline" size={20} color="#774C60" />
          <Text style={styles.menuText}>Quản lý danh mục</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.menuItem} onPress={() => props.navigation.navigate('OrderManagement')}>
          <Icon name="clipboard-outline" size={20} color="#774C60" />
          <Text style={styles.menuText}>Quản lý đơn hàng</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.menuItem} onPress={() => props.navigation.navigate('UserManagement')}>
          <Icon name="person-outline" size={20} color="#774C60" />
          <Text style={styles.menuText}>Quản lý người dùng</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.menuItem} onPress={() => props.navigation.navigate('BlackList')}>
          <Icon name="people-outline" size={20} color="#774C60" />
          <Text style={styles.menuText}>Danh sách đen</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.menuItem} onPress={() => props.navigation.navigate('Statistics')}>
          <Icon name="bar-chart-outline" size={20} color="#774C60" />
          <Text style={styles.menuText}>Thống kê doanh thu</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.menuItem} onPress={() => props.navigation.navigate('Logout')}>
          <Icon name="log-out-outline" size={20} color="#774C60" />
          <Text style={styles.menuText}>Đăng xuất</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  drawerContainer: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    backgroundColor: '#FF4500',
    paddingVertical: 20,
    paddingHorizontal: 20,
    alignItems: 'center',
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    marginBottom: 10,
  },
  userName: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  userEmail: {
    color: '#fff',
    fontSize: 14,
  },
  menuContainer: {
    paddingTop: 10,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 15,
    paddingHorizontal: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  menuText: {
    fontSize: 16,
    marginLeft: 10,
    color: '#333',
  },
});

export default CustomDrawerContent;