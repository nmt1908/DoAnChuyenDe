import React, { useContext, useState } from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, ImageBackground, Modal, TextInput ,TouchableWithoutFeedback} from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';
import Icon from 'react-native-vector-icons/Feather'; // Icon Feather (mắt)
import MaterialIcons from 'react-native-vector-icons/MaterialIcons'; // Icon đồng xu
import AsyncStorage from '@react-native-async-storage/async-storage';
import { UserContext } from '../UserContext'; // UserContext
import CustomAlert from '../component/CustomAlert'; // CustomAlert
import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';

export default function AccountScreen({ navigation }) {
  const { userData, setUserData } = useContext(UserContext);
  const [isModalVisible, setModalVisible] = useState(false); // Modal cho đăng xuất
  const [isChangePasswordModalVisible, setChangePasswordModalVisible] = useState(false); // Modal cho đổi mật khẩu
  const [showCurrentPassword, setShowCurrentPassword] = useState(false); // Hiển thị/Ẩn mật khẩu hiện tại
  const [showNewPassword, setShowNewPassword] = useState(false); // Hiển thị/Ẩn mật khẩu mới
  const [showConfirmPassword, setShowConfirmPassword] = useState(false); // Hiển thị/Ẩn xác nhận mật khẩu

  const [currentPassword, setCurrentPassword] = useState(''); // Mật khẩu hiện tại
  const [newPassword, setNewPassword] = useState(''); // Mật khẩu mới
  const [confirmPassword, setConfirmPassword] = useState(''); // Xác nhận mật khẩu mới

  const [isAlertVisible, setAlertVisible] = useState(false); // Quản lý hiển thị của CustomAlert
  const [alertContent, setAlertContent] = useState({ title: '', message: '' }); // Nội dung của CustomAlert

  const [isEditModalVisible, setEditModalVisible] = useState(false); // Modal cho chỉnh sửa thông tin
  const [editedName, setEditedName] = useState(userData?.tenNguoiDung || ''); // Tên người dùng
  const [editedAddress, setEditedAddress] = useState(userData?.diaChi || ''); // Địa chỉ
  const [editedPhone, setEditedPhone] = useState(userData?.sdt || ''); // Số điện thoại
  const [editedDOB, setEditedDOB] = useState(userData?.ngaySinh || ''); // Ngày sinh
  const [editedGender, setEditedGender] = useState(userData?.gioiTinh || '');
  const [isImageModalVisible, setImageModalVisible] = useState(false);
  const openImageModal = () => {
    if (userData && userData.urlAnh) {
        setImageModalVisible(true); // Chỉ mở modal nếu userData và urlAnh đã sẵn sàng
    } else {
        console.log('Dữ liệu người dùng hoặc URL ảnh chưa sẵn sàng.');
    }
};

  const closeImageModal = () => {
    setImageModalVisible(false);
  };


  const openEditModal = () => {
    setEditModalVisible(true);
  };
  const saveEditedInfo = async () => {
    try {
      const currentUser = auth().currentUser;
      const userDocRef = firestore().collection('NguoiDung').doc(currentUser.uid);
      await userDocRef.update({
        tenNguoiDung: editedName,
        diaChi: editedAddress,
        sdt: editedPhone,
        ngaySinh: editedDOB,
        gioiTinh: editedGender,
      });

      // Cập nhật lại dữ liệu trong ứng dụng
      setUserData({
        ...userData,
        tenNguoiDung: editedName,
        diaChi: editedAddress,
        sdt: editedPhone,
        ngaySinh: editedDOB,
        gioiTinh: editedGender,
      });

      showAlert('Thành công', 'Thông tin tài khoản đã được cập nhật.');
      setEditModalVisible(false);
    } catch (error) {
      showAlert('Lỗi', 'Đã có lỗi xảy ra khi cập nhật thông tin.');
    }
  };
  // Hàm xử lý đăng xuất
  const handleLogout = async () => {
    try {
      await AsyncStorage.clear();
      setUserData(null);
      navigation.reset({
        index: 0,
        routes: [{ name: 'LoginScreen' }],
      });
    } catch (error) {
      showAlert('Lỗi', 'Đã có lỗi xảy ra khi đăng xuất.');
    }
  };

  // Hàm hiển thị CustomAlert
  const showAlert = (title, message) => {
    setAlertContent({ title, message });
    setAlertVisible(true);
  };

  // Ẩn CustomAlert
  const hideAlert = () => {
    setAlertVisible(false);
  };

  // Hàm xử lý đổi mật khẩu
  const handleChangePassword = async () => {
    if (!currentPassword) {
      showAlert('Lỗi', 'Vui lòng nhập mật khẩu hiện tại.');
      return;
    }

    if (!newPassword || !confirmPassword) {
      showAlert('Lỗi', 'Vui lòng nhập đầy đủ mật khẩu mới và xác nhận mật khẩu.');
      return;
    }

    if (newPassword !== confirmPassword) {
      showAlert('Lỗi', 'Mật khẩu mới và xác nhận mật khẩu không khớp.');
      return;
    }

    try {
      const user = auth().currentUser;

      // Xác thực người dùng bằng mật khẩu hiện tại
      const credential = auth.EmailAuthProvider.credential(user.email, currentPassword);

      // Thực hiện quá trình xác thực mật khẩu
      await user.reauthenticateWithCredential(credential);

      // Nếu xác thực thành công, đổi mật khẩu
      await user.updatePassword(newPassword);

      showAlert('Thành công', 'Mật khẩu đã được thay đổi.');
      setChangePasswordModalVisible(false);

    } catch (error) {
      console.log('Error during reauthentication: ', error); // Thêm console log để kiểm tra lỗi

      if (error.code === 'auth/wrong-password') {
        showAlert('Lỗi', 'Mật khẩu hiện tại không đúng.');
      } if (error.code === 'auth/invalid-credential' || error.code === 'auth/wrong-password') {
        showAlert('Lỗi', 'Mật khẩu hiện tại không đúng.');
      } else {
        showAlert('Lỗi', 'Đã xảy ra lỗi khi đổi mật khẩu. Vui lòng thử lại.');
      }
    }
  };


  return (
    <ScrollView style={styles.container}>
      <ImageBackground source={require('../assets/images/wallpaper.jpg')} style={styles.wallpaper}>
        <View style={styles.header}>
          <TouchableOpacity onPress={openImageModal}>
            <Image
              source={userData?.urlAnh ? { uri: userData.urlAnh } : require('../assets/images/defaultuser.jpg')}
              style={styles.avatar}
            />
          </TouchableOpacity>
          <TouchableOpacity style={styles.cameraIconBackground}>
            <Icon style={styles.cameraIcon} name="camera" size={20} color="#fff" />
          </TouchableOpacity>
        </View>
      </ImageBackground>

      <View style={styles.infoContainer}>
        {userData ? (
          <>
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Họ Và Tên </Text>
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
              <Text style={styles.infoLabel}>Ngày sinh</Text>
              <Text style={styles.infoValue}>{userData.ngaySinh}</Text>
            </View>
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Giới tính</Text>
              <Text style={styles.infoValue}>{userData.gioiTinh}</Text>
            </View>
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Mật Khẩu</Text>
              <Text style={styles.infoValue}>*************</Text>
            </View>
            <View style={styles.infoRow}>
              <View style={styles.coinContainer}>
                <Text style={styles.infoLabel}><MaterialIcons name="attach-money" size={20} color="gold" /></Text>
                <Text style={styles.infoValue}><Text style={styles.coinText}>Xu: {userData.xu || '0'}</Text></Text>
              </View>
            </View>
            <TouchableOpacity style={styles.editIcon} onPress={openEditModal}>

              <Icon name="edit" size={30} color="#FF4500" />

            </TouchableOpacity>
          </>
        ) : (
          <Text>Đang tải thông tin người dùng...</Text>
        )}
      </View>

      <View style={styles.buttonContainer}>
        <TouchableOpacity
          style={styles.buttonChangePassword}
          onPress={() => setChangePasswordModalVisible(true)} // Mở modal đổi mật khẩu
        >
          <Text style={styles.buttonText}>Đổi mật khẩu</Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => setModalVisible(true)}
          style={styles.buttonLogout}
        >
          <Text style={styles.buttonText}>Đăng xuất</Text>
        </TouchableOpacity>
      </View>

      {/* Modal Đổi mật khẩu */}
      <Modal
        visible={isChangePasswordModalVisible}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setChangePasswordModalVisible(false)}
      >
        <View style={styles.modalBackground}>
          <View style={styles.modalContainer}>
            <Text style={styles.modalTitle}>Đổi mật khẩu</Text>

            {/* Nhập mật khẩu hiện tại */}
            <View style={styles.passwordInputContainer}>
              <TextInput
                style={styles.input}
                placeholder="Nhập mật khẩu hiện tại"
                secureTextEntry={!showCurrentPassword} // Điều khiển hiển thị/ẩn
                value={currentPassword}
                onChangeText={setCurrentPassword}
              />
              <TouchableOpacity onPress={() => setShowCurrentPassword(!showCurrentPassword)}>
                <Icon name={showCurrentPassword ? 'eye-off' : 'eye'} size={20} />
              </TouchableOpacity>
            </View>

            {/* Nhập mật khẩu mới */}
            <View style={styles.passwordInputContainer}>
              <TextInput
                style={styles.input}
                placeholder="Nhập mật khẩu mới"
                secureTextEntry={!showNewPassword}
                value={newPassword}
                onChangeText={setNewPassword}
              />
              <TouchableOpacity onPress={() => setShowNewPassword(!showNewPassword)}>
                <Icon name={showNewPassword ? 'eye-off' : 'eye'} size={20} />
              </TouchableOpacity>
            </View>

            {/* Xác nhận mật khẩu mới */}
            <View style={styles.passwordInputContainer}>
              <TextInput
                style={styles.input}
                placeholder="Xác nhận mật khẩu mới"
                secureTextEntry={!showConfirmPassword}
                value={confirmPassword}
                onChangeText={setConfirmPassword}
              />
              <TouchableOpacity onPress={() => setShowConfirmPassword(!showConfirmPassword)}>
                <Icon name={showConfirmPassword ? 'eye-off' : 'eye'} size={20} />
              </TouchableOpacity>
            </View>

            <View style={styles.modalButtonContainer}>
              <TouchableOpacity
                onPress={() => setChangePasswordModalVisible(false)}
                style={styles.cancelButton}
              >
                <Text style={styles.cancelButtonText}>Hủy</Text>
              </TouchableOpacity>

              <TouchableOpacity
                onPress={handleChangePassword}
                style={styles.okButton}
              >
                <Text style={styles.okButtonText}>Đổi</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* Modal Đăng xuất */}
      <Modal
        visible={isModalVisible}
        animationType="fade"
        transparent={true}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalBackground}>
          <View style={styles.modalContainer}>
            <Text style={styles.modalTitle}>Xác nhận</Text>
            <Text style={styles.modalMessage}>Bạn có muốn đăng xuất?</Text>

            <View style={styles.modalButtonContainer}>
              <TouchableOpacity onPress={() => setModalVisible(false)} style={styles.cancelButton}>
                <Text style={styles.cancelButtonText}>Hủy</Text>
              </TouchableOpacity>

              <TouchableOpacity
                onPress={() => {
                  setModalVisible(false);
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
      <Modal
        visible={isEditModalVisible}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setEditModalVisible(false)} // Đóng modal khi nhấn ngoài
      >
        <View style={styles.modalBackground}>
          <View style={styles.modalContainer}>
            <Text style={styles.modalTitle}>Chỉnh sửa thông tin</Text>
            <TextInput
              style={styles.input2}
              placeholder="Họ và Tên"
              value={editedName}
              onChangeText={setEditedName}
            />
            <TextInput
              style={styles.input2}
              placeholder="Ngày Sinh"
              value={editedDOB}
              onChangeText={setEditedDOB}
            />
            <TextInput
              style={styles.input2}
              placeholder="Giới Tính"
              value={editedGender}
              onChangeText={setEditedGender}
            />
            <TextInput
              style={styles.input2}
              placeholder="Số Điện Thoại"
              value={editedPhone}
              onChangeText={setEditedPhone}
              keyboardType="phone-pad"
            />
            <TextInput
              style={styles.input2}
              placeholder="Địa chỉ"
              value={editedAddress}
              onChangeText={setEditedAddress}
            />
            <View style={styles.modalButtonContainer}>
              <TouchableOpacity
                onPress={() => setEditModalVisible(false)} // Đóng modal
                style={styles.cancelButton}
              >
                <Text style={styles.cancelButtonText}>Hủy</Text>
              </TouchableOpacity>

              <TouchableOpacity
                onPress={saveEditedInfo} // Lưu thông tin
                style={styles.okButton}
              >
                <Text style={styles.okButtonText}>Lưu</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* CustomAlert cho thông báo */}
      <CustomAlert
        isVisible={isAlertVisible}
        title={alertContent.title}
        message={alertContent.message}
        onClose={hideAlert}
      />
      <Modal
    visible={isImageModalVisible}
    transparent={true}
    animationType="fade"
    onRequestClose={closeImageModal}
>
    <TouchableWithoutFeedback onPress={closeImageModal}>
        <View style={styles.imageModalContainer}>
            {userData?.urlAnh ? (
                <Image
                    source={{ uri: userData.urlAnh }}
                    style={styles.fullscreenImage}
                    resizeMode="contain"
                    onError={(error) => console.log('Lỗi khi tải ảnh:', error.nativeEvent.error)} // Xử lý lỗi tải ảnh
                />
            ) : (
                <Text>Không có ảnh để hiển thị</Text>
            )}
        </View>
    </TouchableWithoutFeedback>
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
    height: 150,
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
  header: {
    alignItems: 'center',
    marginBottom: -50,
  },
  avatar: {
    width: 150,
    height: 150,
    borderRadius: 100,
    borderWidth: 3,
    borderColor: '#fff',
  },
  cameraIconBackground: {
    width: 40,
    height: 40,
    position: 'absolute',
    bottom: 0,
    right: 5,
    backgroundColor: '#FF4500',
    borderRadius: 100,
    justifyContent: 'center',
    alignItems: 'center',
  },
  infoContainer: {
    marginTop: 60,
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
    marginTop: 10,
  },
  buttonChangePassword: {
    backgroundColor: '#90EE90',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 20,
    marginLeft: 50,
  },
  buttonLogout: {
    backgroundColor: '#FF6347',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 20,
    marginRight: 70,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  coinContainer: {
    flexDirection: 'row',
    alignItems: 'center',
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
    borderRadius: 30,
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
    borderRadius: 30,
    marginHorizontal: 10,
  },
  okButtonText: {
    fontSize: 16,
    color: '#000',
    fontWeight: 'bold',
  },
  passwordInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    paddingHorizontal: 10,
  },
  input: {
    flex: 1,
    height: 40,
    paddingHorizontal: 10,
  },
  editIcon: {
    position: 'absolute',
    top: 10,  // Đặt vị trí y dựa trên khoảng cách từ trên xuống
    right: 40, // Đặt vị trí x cách bên phải
    zIndex: 1, // Đảm bảo icon luôn hiển thị trên cùng
  },
  input2: {
    width: '100%',
    height: 40, // Đảm bảo chiều cao được đặt đúng
    borderColor: '#ccc', // Màu viền cho input
    borderWidth: 1,
    borderRadius: 5,
    paddingHorizontal: 10, // Khoảng cách chữ từ viền
    marginBottom: 15, // Khoảng cách giữa các input
    backgroundColor: '#fff', // Màu nền của input
    color: '#000', // Màu chữ
  },
  imageModalContainer: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.8)',  // Nền mờ phía sau
    justifyContent: 'center',
    alignItems: 'center',
  },
  fullscreenImage: {
    width: '90%',
    height: '70%',
  },
  closeButton: {
    position: 'absolute',
    top: 150,
    right: 20,
    backgroundColor: '#FF4500',
    padding: 10,
    borderRadius: 10,
  },
  closeButtonText: {
    color: '#fff',
    fontSize: 16,
  },
  closeButtonIcon: {

  },
});