import React, { useContext, useEffect, useState } from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet, Alert, Modal } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { UserContext } from '../UserContext';
import firestore from '@react-native-firebase/firestore'; // Import Firestore

const CustomDrawerContent = (props) => {
  const [isModalVisible, setModalVisible] = useState(false);
  const { userData, setUserData } = useContext(UserContext);

  useEffect(() => {
    let unsubscribe = null; // Biến để lưu trạng thái lắng nghe từ Firestore

    // Hàm để tải dữ liệu từ AsyncStorage khi ứng dụng khởi động
    const loadUserDataFromAsyncStorage = async () => {
      try {
        const storedData = await AsyncStorage.getItem('userData');
        if (storedData) {
          setUserData(JSON.parse(storedData)); // Cập nhật UserContext từ AsyncStorage
        }
      } catch (error) {
        console.error('Lỗi khi tải dữ liệu từ AsyncStorage:', error);
      }
    };

    // Hàm lắng nghe thay đổi trong Firestore theo thời gian thực
    const listenToUserDataFromFirestore = async () => {
      const uid = await AsyncStorage.getItem('userUID'); // Lấy UID của người dùng
      if (!uid) return; // Nếu không có UID, thoát

      unsubscribe = firestore()
        .collection('NguoiDung')
        .doc(uid)
        .onSnapshot(
          (doc) => {
            if (doc.exists) {
              const updatedUserData = doc.data();
              setUserData(updatedUserData); // Cập nhật UserContext khi có thay đổi
              AsyncStorage.setItem('userData', JSON.stringify(updatedUserData)); // Cập nhật AsyncStorage
            } else {
              console.log('Không tìm thấy tài liệu người dùng.');
            }
          },
          (error) => {
            console.error('Lỗi khi lắng nghe Firestore:', error);
          }
        );
    };

    // Đầu tiên, tải dữ liệu từ AsyncStorage
    loadUserDataFromAsyncStorage().then(() => {
      // Sau khi dữ liệu từ AsyncStorage được tải, bắt đầu lắng nghe Firestore
      listenToUserDataFromFirestore();
    });

    // Hủy lắng nghe từ Firestore khi component bị unmount
    return () => {
      if (unsubscribe) {
        unsubscribe(); // Gọi hàm hủy listener của Firestore
      }
    };
  }, [setUserData]);
  const handleLogout = async () => {
    try {
      // Xóa tất cả dữ liệu liên quan đến người dùng từ AsyncStorage
      await AsyncStorage.clear(); // Xóa tất cả dữ liệu từ AsyncStorage

      // Cập nhật UserContext về null sau khi đăng xuất
      setUserData(null); // Xóa dữ liệu người dùng trong Context

      // Điều hướng người dùng về trang đăng nhập sau khi xóa thành công
      props.navigation.reset({
        index: 0,
        routes: [{ name: 'LoginScreen' }],
      });
    } catch (error) {
      console.error('Lỗi khi đăng xuất:', error);
      Alert.alert('Lỗi', 'Đã có lỗi xảy ra khi đăng xuất.');
    }
  };

  const showLogoutModal = () => {
    setModalVisible(true);
  };

  const hideLogoutModal = () => {
    setModalVisible(false);
  };

  return (
    <View style={styles.drawerContainer}>
      <View style={styles.header}>
        <Image
          source={userData && userData.urlAnh ? { uri: userData.urlAnh } : require('../assets/images/defaultuser.jpg')}
          style={styles.avatar}
        />
        <Text style={styles.userName}>{userData ? userData.tenNguoiDung : 'Tên người dùng'}</Text>
        <Text style={styles.userEmail}>{userData ? userData.email : 'Email'}</Text>
      </View>

      <View style={styles.menuContainer}>
        {userData && userData.vaiTro === 'VaiTro_ID1' ? (
          <>
            <TouchableOpacity style={styles.menuItem} onPress={() => props.navigation.navigate('ProductManagement')}>
              <Icon name="cafe-outline" size={20} color="#774C60" />
              <Text style={styles.menuText}>Quản lý sản phẩm</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.menuItem} onPress={() => props.navigation.navigate('CategoryManagement')}>
              <Icon name="cube-outline" size={20} color="#774C60" />
              <Text style={styles.menuText}>Quản lý danh mục</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.menuItem} onPress={() => props.navigation.navigate('BrandManagement')}>
              <Icon name="logo-apple" size={20} color="#774C60" />
              <Text style={styles.menuText}>Quản lý thương hiệu</Text>
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
          </>
        ) : null}

        {userData && userData.vaiTro === 'VaiTro_ID2' ? (
          <>
            <TouchableOpacity style={styles.menuItem} >
              <Icon name="bar-chart-outline" size={20} color="#774C60" />
              <Text style={styles.menuText}>Đơn hàng của tôi</Text>
            </TouchableOpacity>
          </>
        ) : null}

        {userData && userData.vaiTro === 'VaiTro_ID4' ? (
          <>

            <TouchableOpacity style={styles.menuItem} >
              <Icon name="bar-chart-outline" size={20} color="#774C60" />
              <Text style={styles.menuText}>Quản lý đơn hàng</Text>
            </TouchableOpacity>
          </>
        ) : null}
        <TouchableOpacity style={styles.menuItem} onPress={() => props.navigation.navigate('Tài khoản')}>
          <Icon name="person-outline" size={20} color="#774C60" />
          <Text style={styles.menuText}>Thông tin tài khoản</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.menuItem} onPress={showLogoutModal}>
          <Icon name="log-out-outline" size={20} color="#774C60" />
          <Text style={styles.menuText}>Đăng xuất</Text>
        </TouchableOpacity>
      </View>

      <Modal
        visible={isModalVisible}
        animationType="fade"
        transparent={true}
        onRequestClose={hideLogoutModal}
      >
        <View style={styles.modalBackground}>
          <View style={styles.modalContainer}>
            <Text style={styles.modalTitle}>Xác nhận</Text>
            <Text style={styles.modalMessage}>Bạn có muốn đăng xuất?</Text>
            <View style={styles.modalButtonContainer}>
              <TouchableOpacity onPress={hideLogoutModal} style={styles.cancelButton}>
                <Text style={styles.cancelButtonText}>Hủy</Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => {
                  hideLogoutModal();
                  handleLogout();
                }}
                style={styles.okButton}
              >
                <Text style={styles.okButtonText}>OK</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
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
  modalBackground: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContainer: {
    width: 300,
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 20,
    alignItems: 'center',
  },
  modalTitle: {
    fontSize: 25,
    fontWeight: 'bold',
    color: '#FF4500',
    marginBottom: 10,
  },
  modalMessage: {
    fontSize: 18,
    color: '#000',
    marginBottom: 20,
  },
  modalButtonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    width: '100%',
  },
  cancelButton: {
    backgroundColor: '#E0E0E0',
    paddingVertical: 12,
    paddingHorizontal: 30,
    borderRadius: 5,
    marginHorizontal: 10,
  },
  cancelButtonText: {
    fontSize: 16,
    color: '#000',
  },
  okButton: {
    backgroundColor: '#90EE90',
    paddingVertical: 12,
    paddingHorizontal: 30,
    borderRadius: 5,
    marginHorizontal: 10,
  },
  okButtonText: {
    fontSize: 16,
    color: '#000',
    fontWeight: 'bold',
  },
});

export default CustomDrawerContent;