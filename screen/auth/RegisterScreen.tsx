import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Image,
  StyleSheet,
  ScrollView,
  KeyboardAvoidingView,
  Platform
} from 'react-native';
import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore'; // Import Firestore
import Icon from 'react-native-vector-icons/Feather'; // Import Feather Icons
import CustomAlert from '../../component/CustomAlert';

export default function RegisterScreen({ navigation }) {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [address, setAddress] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [isAlertVisible, setAlertVisible] = useState(false);
  const [alertContent, setAlertContent] = useState({ title: '', message: '' });

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const showAlert = (title, message) => {
    setAlertContent({ title, message });
    setAlertVisible(true);
  };

  const hideAlert = () => {
    setAlertVisible(false);
  };

  // Function to validate inputs
  const validateInputs = () => {
    const emailRegex = /^[a-zA-Z0-9._%+-]{6,30}@gmail\.com$/;
    const phoneRegex = /^0[0-9]{9,11}$/;

    if (!username.trim()) {
      showAlert('Lỗi', 'Tên người dùng không được để trống!');
      return false;
    }
    if (!emailRegex.test(email)) {
      showAlert('Lỗi', 'Email không hợp lệ! Email phải có ít nhất 6 và tối đa 30 ký tự.');
      return false;
    }
    if (!phoneRegex.test(phoneNumber)) {
      showAlert('Lỗi', 'Số điện thoại phải bắt đầu bằng 0 và có từ 10 đến 12 chữ số.');
      return false;
    }
    if (!address.trim()) {
      showAlert('Lỗi', 'Địa chỉ không được để trống!');
      return false;
    }
    if (password.length < 6) {
      showAlert('Lỗi', 'Mật khẩu phải ít nhất 6 ký tự!');
      return false;
    }
    if (password !== confirmPassword) {
      showAlert('Lỗi', 'Mật khẩu xác nhận không khớp!');
      return false;
    }

    return true;
  };

  // Hàm xử lý đăng ký
  const handleRegister = async () => {
    if (!validateInputs()) return;

    try {
      setLoading(true);

      const userCredential = await auth().createUserWithEmailAndPassword(email, password);
      const { user } = userCredential;
      console.log('User UID:', user.uid); // Kiểm tra UID người dùng mới tạo

      await firestore().collection('NguoiDung').doc(user.uid).set({
        tenNguoiDung: username,
        email: email,
        sdt: phoneNumber,
        diaChi: address,
        gioiTinh: 'Nam',
        ngaySinh: '01/01/2000',
        vaiTro: 'VaiTro_ID2',
        xu: '0',
        urlAnh: 'https://firebasestorage.googleapis.com/v0/b/chuyende-13cb1.appspot.com/o/imageUser%2Fdefaultuser.jpg?alt=media&token=8f73e651-f1ff-4e64-9ffb-b61eac27035e',
      });

      showAlert('Thành công', 'Đăng ký thành công!');
      
      setTimeout(() => {
        hideAlert(); 
        navigation.navigate('LoginScreen'); 
      }, 2000);

    } catch (error) {
      showAlert('Lỗi', 'Đăng ký thất bại. Vui lòng thử lại.');
      console.error('Error during registration: ', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView contentContainerStyle={styles.container} keyboardShouldPersistTaps="handled">
        <Image source={require('../../assets/images/logo.png')} style={styles.logo} />

        <TextInput
          style={styles.input}
          placeholder="Tên người dùng"
          placeholderTextColor="#000"
          value={username}
          onChangeText={setUsername}
          autoCapitalize="none"
        />
        <TextInput
          style={styles.input}
          placeholder="Địa chỉ email"
          placeholderTextColor="#000"
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
          autoCapitalize="none"
        />
        <TextInput
          style={styles.input}
          placeholder="Số điện thoại"
          placeholderTextColor="#000"
          value={phoneNumber}
          onChangeText={setPhoneNumber}
          keyboardType="phone-pad"
        />
        <TextInput
          style={styles.input}
          placeholder="Địa chỉ"
          placeholderTextColor="#000"
          value={address}
          onChangeText={setAddress}
        />

        <View style={styles.passwordInputContainer}>
          <TextInput
            style={styles.inputPassword}
            placeholder="Nhập mật khẩu"
            placeholderTextColor="#000"
            value={password}
            onChangeText={setPassword}
            secureTextEntry={!showPassword}
          />
          {password.length > 0 && (
            <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
              <Icon name={showPassword ? 'eye-off' : 'eye'} size={20} color="#FF4500" />
            </TouchableOpacity>
          )}
        </View>

        <View style={styles.passwordInputContainer}>
          <TextInput
            style={styles.inputPassword}
            placeholder="Nhập lại mật khẩu"
            placeholderTextColor="#000"
            value={confirmPassword}
            onChangeText={setConfirmPassword}
            secureTextEntry={!showConfirmPassword}
          />
          {confirmPassword.length > 0 && (
            <TouchableOpacity onPress={() => setShowConfirmPassword(!showConfirmPassword)}>
              <Icon name={showConfirmPassword ? 'eye-off' : 'eye'} size={20} color="#FF4500" />
            </TouchableOpacity>
          )}
        </View>

        <TouchableOpacity style={styles.registerButton} onPress={handleRegister} disabled={loading}>
          <Text style={styles.registerButtonText}>{loading ? 'Đang đăng ký...' : 'Đăng ký'}</Text>
        </TouchableOpacity>

        <View style={styles.loginLinkContainer}>
          <Text style={styles.alreadyHaveAccountText}>Bạn đã có tài khoản? </Text>
          <TouchableOpacity onPress={() => navigation.navigate('LoginScreen')}>
            <Text style={styles.loginLink}>Đăng nhập tại đây.</Text>
          </TouchableOpacity>
        </View>

        <CustomAlert
          isVisible={isAlertVisible}
          title={alertContent.title}
          message={alertContent.message}
          onClose={hideAlert}
        />
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#fff',
  },
  logo: {
    width: 250,
    height: 170,
    resizeMode: 'contain',
    marginBottom: 30,
  },
  input: {
    width: '100%',
    height: 50,
    borderRadius: 25,
    backgroundColor: '#f0f0f0',
    paddingHorizontal: 20,
    marginBottom: 15,
    fontSize: 16,
    color: '#000',
  },
  passwordInputContainer: {
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f0f0f0',
    borderRadius: 25,
    paddingHorizontal: 20,
    marginBottom: 15,
  },
  inputPassword: {
    flex: 1,
    height: 50,
    fontSize: 16,
    color: '#000',
  },
  registerButton: {
    backgroundColor: '#FF4500',
    width: '50%',
    paddingVertical: 15,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 10,
  },
  registerButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  loginLinkContainer: {
    flexDirection: 'row',
    marginTop: 20,
  },
  alreadyHaveAccountText: {
    color: '#000',
  },
  loginLink: {
    color: '#FF4500',
    fontWeight: 'bold',
  },
});