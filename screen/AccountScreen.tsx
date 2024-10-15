import React, { useContext, useState } from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, ImageBackground, Alert, Modal } from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';
import Icon from 'react-native-vector-icons/Feather'; // Import Feather icon (nút camera)
import MaterialIcons from 'react-native-vector-icons/MaterialIcons'; // Import icon đồng xu.
import AsyncStorage from '@react-native-async-storage/async-storage';
import { UserContext } from '../UserContext'; // Import UserContext

export default function AccountScreen({ navigation }) {
  const [isModalVisible, setModalVisible] = useState(false);
  const { userData, setUserData } = useContext(UserContext); // Lấy userData và setUserData từ UserContext

  const handleLogout = async () => {
    try {
      // Xóa tất cả dữ liệu liên quan đến người dùng từ AsyncStorage
      await AsyncStorage.clear(); // Xóa tất cả dữ liệu từ AsyncStorage
      
      // Cập nhật UserContext về null sau khi đăng xuất
      setUserData(null); // Xóa dữ liệu người dùng trong Context
  
      // Điều hướng người dùng về trang đăng nhập sau khi xóa thành công
      navigation.reset({
        index: 0,
        routes: [{ name: 'LoginScreen' }],
      });
    } catch (error) {
      console.error('Lỗi khi đăng xuất:', error);
      Alert.alert('Lỗi', 'Đã có lỗi xảy ra khi đăng xuất.');
    }
  };

  const confirmLogout = () => {
    Alert.alert(
      'Xác nhận',
      'Bạn có chắc chắn muốn đăng xuất?',
      [
        {
          text: 'Hủy',
          style: 'cancel',
        },
        {
          text: 'Đăng xuất',
          onPress: handleLogout, // Thực hiện đăng xuất nếu người dùng xác nhận
        },
      ],
      { cancelable: true }
    );
  };

  const showLogoutModal = () => {
    setModalVisible(true);
  };

  // Ẩn modal
  const hideLogoutModal = () => {
    setModalVisible(false);
  };

  return (
    <ScrollView style={styles.container}>
      {/* Hình nền */}
      <ImageBackground source={require('../assets/images/wallpaper.jpg')} style={styles.wallpaper}>
        {/* Ảnh đại diện người dùng */}
        <View style={styles.header}>
          <Image source={userData && userData.urlAnh ? { uri: userData.urlAnh } : require('../assets/images/defaultuser.jpg')} style={styles.avatar} />
          <TouchableOpacity style={styles.cameraIconBackground}>
            <Icon style={styles.cameraIcon} name="camera" size={20} color="#fff" />
          </TouchableOpacity>
        </View>
      </ImageBackground>

      {/* Thông tin người dùng */}
      <View style={styles.infoContainer}>
        {userData ? (
          <>
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Họ Và Tên</Text>
              <Text style={styles.infoValue}>{userData.tenNguoiDung}</Text>
            </View>
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Email</Text>
              <Text style={styles.infoValue}>{userData.email}</Text>
            </View>
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Số Điện Thoại</Text>
              <Text style={styles.infoValue}>{userData.sdt}</Text>
            </View>
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Địa chỉ</Text>
              <Text style={styles.infoValue}>{userData.diaChi}</Text>
            </View>
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Mật Khẩu</Text>
              <Text style={styles.infoValue}>*************</Text>
            </View>
            {/* Xu */}
            <View style={styles.infoRow}>
              <View style={styles.coinContainer}>
                <Text style={styles.infoLabel}><MaterialIcons name="attach-money" size={20} color="gold" /></Text>
                <Text style={styles.infoValue}><Text style={styles.coinText}>Xu: {userData.xu || '0'}</Text></Text>
              </View>
            </View>
          </>
        ) : (
          <Text>Đang tải thông tin người dùng...</Text>
        )}
      </View>

      {/* Nút đổi mật khẩu và đăng xuất */}
      <View style={styles.buttonContainer}>
        <TouchableOpacity style={styles.buttonChangePassword}>
          <Text style={styles.buttonText}>Đổi mật khẩu</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={showLogoutModal} style={styles.buttonLogout}>
          <Text style={styles.buttonText}>Đăng xuất</Text>
        </TouchableOpacity>
      </View>

      {/* Custom Modal */}
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
              {/* Nút Hủy */}
              <TouchableOpacity onPress={hideLogoutModal} style={styles.cancelButton}>
                <Text style={styles.cancelButtonText}>Hủy</Text>
              </TouchableOpacity>

              {/* Nút OK */}
              <TouchableOpacity
                onPress={() => {
                  hideLogoutModal();
                  handleLogout(); // Thực hiện đăng xuất
                }}
                style={styles.okButton}
              >
                <Text style={styles.okButtonText}>OK</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    marginBottom: 80,
  },
  wallpaper: {
    width: '100%',
    height: 150, // Chiều cao của hình nền
    justifyContent: 'flex-end', // Căn avatar ở phía dưới
    alignItems: 'center',
  },
  header: {
    alignItems: 'center',
    marginBottom: -50, // Kéo avatar lên phía trên
  },
  avatar: {
    width: 150,
    height: 150,
    borderRadius: 100,
    borderWidth: 3,
    borderColor: '#fff', // Viền trắng quanh avatar
  },
  cameraIconBackground: {
    width: 40,
    height: 40,
    position: 'absolute',
    bottom: 0, // Căn chỉnh icon camera nằm dưới cùng của avatar
    right: 5, // Dịch chuyển icon camera sang bên phải
    backgroundColor: '#FF4500',
    borderRadius: 100, // Biến background thành hình tròn
    justifyContent: 'center', // Căn giữa icon theo chiều dọc
    alignItems: 'center',    // Căn giữa icon theo chiều ngang
  },
  infoContainer: {
    marginTop: 60, // Đảm bảo khoảng cách giữa avatar và thông tin
    paddingHorizontal: 20,
  },
  infoRow: {
    marginBottom: 15,
  },
  infoLabel: {
    fontSize: 16,
    color: '#FF4500',
    fontWeight: 'bold',
  },
  infoValue: {
    fontSize: 16,
    color: '#000',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingBottom: 25,
    marginTop: 10, // Đảm bảo khoảng cách giữa các nút và thông tin
  },
  buttonChangePassword: {
    backgroundColor: '#90EE90', // Màu xanh lá nhạt
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 20,
  },
  buttonLogout: {
    backgroundColor: '#FF6347', // Màu đỏ cam
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 20,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  coinContainer: {
    flexDirection: 'row',
    alignItems: 'center', // Khoảng cách lớn hơn giữa nút và xu
  },
  coinText: {
    fontSize: 16,
    color: '#FF4500',
    marginLeft: 5,
  },
  modalBackground: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)', // Nền tối
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

export default AccountScreen;