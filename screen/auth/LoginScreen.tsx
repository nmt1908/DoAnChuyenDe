import React, { useEffect, useState, useContext } from 'react';
import {
    View,
    Text,
    TextInput,
    TouchableOpacity,
    Image,
    StyleSheet,
    ActivityIndicator,
    ScrollView,
    KeyboardAvoidingView, Platform
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';
import Icon from 'react-native-vector-icons/Feather'; // Import Icon Feather
import { UserContext } from '../../UserContext'; // Import UserContext
import CustomAlert from '../../component/CustomAlert'; // Import CustomAlert

export default function LoginScreen({ navigation }) {
    const { setUserData } = useContext(UserContext); // Lấy setUserData từ UserContext
    const [loginCredential, setLoginCredential] = useState(''); // Chứa email hoặc số điện thoại
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(true); // Biến để theo dõi trạng thái load
    const [isAlertVisible, setAlertVisible] = useState(false); // Trạng thái hiển thị alert
    const [alertContent, setAlertContent] = useState({ title: '', message: '' }); // Nội dung của alert
    const [showPassword, setShowPassword] = useState(false); // Trạng thái hiển thị/ẩn mật khẩu

    // Hiển thị alert
    const showAlert = (title, message) => {
        setAlertContent({ title, message });
        setAlertVisible(true);
    };

    // Ẩn alert
    const hideAlert = () => {
        setAlertVisible(false);
    };

    // Kiểm tra trạng thái đăng nhập khi ứng dụng khởi chạy
    useEffect(() => {
        const checkLoginStatus = async () => {
            const userData = await AsyncStorage.getItem('userData');
            if (userData) {
                // Nếu đã có thông tin đăng nhập, điều hướng đến HomeTab
                navigation.navigate('HomeTab');
            } else {
                // Nếu không có, tiếp tục hiển thị màn hình đăng nhập
                setLoading(false);
            }
        };

        checkLoginStatus();
    }, []);

    const handleLogin = async () => {
        setLoading(true);
        try {
            if (!loginCredential || !password) {
                showAlert('Lỗi', 'Vui lòng điền đầy đủ thông tin!');
                return;
            }
            // Đăng nhập bằng Firebase Authentication
            const userCredential = await auth().signInWithEmailAndPassword(loginCredential, password);
            console.log('User Credential:', userCredential);
            const user = userCredential.user;
            console.log('UID:', user.uid);

            // Sau khi đăng nhập thành công, lấy thông tin từ Firestore dựa trên uid của người dùng
            const userDoc = await firestore().collection('NguoiDung').doc(user.uid).get();

            if (userDoc.exists) {
                const userData = userDoc.data();

                // Lưu UID của người dùng vào AsyncStorage
                await AsyncStorage.setItem('userUID', user.uid);  // Lưu UID

                // Cập nhật thông tin vào UserContext và AsyncStorage
                await handleUserLogin(userData);
            } else {
                // Nếu không tìm thấy người dùng
                showAlert('Lỗi', 'Không tìm thấy thông tin người dùng trong Firestore.');
            }
        } catch (error) {
            // Chặn lỗi hiển thị lên RedBox bằng cách tắt console.error hoặc tùy chỉnh
            console.error('Lỗi khi đăng nhập:', error);

            // Phân tích lỗi từ Firebase và hiển thị thông báo tùy chỉnh
            if (error.code === 'auth/invalid-email') {
                showAlert('Lỗi', 'Email không hợp lệ.');
            } else if (error.code === 'auth/user-not-found') {
                showAlert('Lỗi', 'Người dùng không tồn tại.');
            } else if (error.code === 'auth/wrong-password') {
                showAlert('Lỗi', 'Sai tài khoản hoặc mật khẩu.');
            } else {
                showAlert('Lỗi', 'Sai tài khoản hoặc mật khẩu.');
            }
        } finally {
            setLoading(false);
        }
    };

    const handleUserLogin = async (userData) => {
        // Truy vấn bảng VaiTro để kiểm tra vai trò người dùng
        const roleDoc = await firestore()
            .collection('VaiTro')
            .doc(userData.vaiTro)
            .get();

        if (roleDoc.exists) {
            const roleData = roleDoc.data();

            // Cập nhật tên người dùng và vai trò
            console.log('Người dùng đã đăng nhập:', userData.tenNguoiDung);
            console.log('Người dùng đã đăng nhập với vai trò: ', roleData.tenVaiTro);
            // Lưu toàn bộ thông tin người dùng vào AsyncStorage và UserContext
            await AsyncStorage.setItem('userData', JSON.stringify(userData));
            setUserData(userData); // Cập nhật UserContext với thông tin người dùng

            // Điều hướng dựa vào vai trò
            if (roleData.tenVaiTro.trim() === 'Admin') {
                await AsyncStorage.setItem('userToken', 'ADMIN');
                navigation.navigate('HomeTab');
            } else if (roleData.tenVaiTro.trim() === 'Khách Hàng') {
                await AsyncStorage.setItem('userToken', 'Khách Hàng');
                navigation.navigate('HomeTab');
            } else if (roleData.tenVaiTro.trim() === 'Quản lý kho') {
                await AsyncStorage.setItem('userToken', 'Quản lý kho');
                navigation.navigate('HomeTab');
            } else if (roleData.tenVaiTro.trim() === 'Shipper') {
                await AsyncStorage.setItem('userToken', 'Shipper');
                navigation.navigate('HomeTab');
            } else {
                showAlert('Thông báo', 'Vai trò không xác định.');
            }
        } else {
            showAlert('Lỗi', 'Vai trò của người dùng không tồn tại.');
        }
    };

    if (loading) {
        // Hiển thị khi đang kiểm tra trạng thái đăng nhập
        return (
            <View style={styles.loadingContainer}>
                {/* Logo hiển thị phía trên ActivityIndicator */}
                <Image source={require('../../assets/images/logo.png')} style={styles.loadingLogo} />
                <ActivityIndicator size="large" color="#FF4500" />
            </View>
        );
    }

    return (
        <KeyboardAvoidingView
            style={{ flex: 1 }}
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'} // Điều chỉnh cho iOS hoặc Android
        >
            <ScrollView contentContainerStyle={styles.contentContainer} keyboardShouldPersistTaps="handled">
                <Image source={require('../../assets/images/logo.png')} style={styles.logo} />

                {/* Email Input */}
                <TextInput
                    style={styles.input}
                    placeholder="Email"
                    value={loginCredential}
                    onChangeText={setLoginCredential}
                    autoCapitalize="none"
                />

                {/* Password Input với icon mắt */}
                <View style={styles.passwordInputContainer}>
                    <TextInput
                        style={styles.inputPassword}
                        placeholder="Mật khẩu"
                        secureTextEntry={!showPassword} // Điều khiển hiển thị/ẩn mật khẩu
                        value={password}
                        onChangeText={setPassword}
                    />
                    {password.length > 0 && (
                        <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
                            <Icon name={showPassword ? 'eye-off' : 'eye'} size={20} color="#FF4500" />
                        </TouchableOpacity>
                    )}
                </View>

                {/* Forgot Password Link */}
                <TouchableOpacity
                    onPress={() => navigation.navigate('ForgetPasswordScreen')}
                    style={styles.forgotPassword}
                >
                    <Text style={styles.forgotPasswordText}>Quên mật khẩu?</Text>
                </TouchableOpacity>

                {/* Login Button */}
                <TouchableOpacity onPress={handleLogin} style={styles.loginButton}>
                    <Text style={styles.loginButtonText}>Đăng nhập</Text>
                </TouchableOpacity>

                {/* Register Option */}
                <View style={styles.registerContainer}>
                    <Text style={styles.registerText}>Chưa có tài khoản? </Text>
                    <TouchableOpacity onPress={() => navigation.navigate('RegisterScreen')}>
                        <Text style={styles.registerLink}>Đăng ký</Text>
                    </TouchableOpacity>
                </View>

                {/* Custom Alert */}
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
    contentContainer: {
        flexGrow: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
        backgroundColor: '#fff',
    },
    logo: {
        width: 300,
        height: 300,
        resizeMode: 'contain',
        marginBottom: 30,
    },
    input: {
        width: '100%',
        height: 50,
        borderRadius: 25,
        backgroundColor: '#f0f0f0',
        paddingHorizontal: 20,
        marginBottom: 10,
        fontSize: 16,
    },
    passwordInputContainer: {
        width: '100%',
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#f0f0f0',
        borderRadius: 25,
        paddingHorizontal: 20,
        marginBottom: 10,
    },
    inputPassword: {
        flex: 1,
        height: 50,
        fontSize: 16,
    },
    forgotPassword: {
        alignSelf: 'flex-end',
        marginBottom: 20,
    },
    forgotPasswordText: {
        color: '#FF4500',
        fontSize: 14,
    },
    loginButton: {
        backgroundColor: '#FF4500',
        paddingVertical: 15,
        borderRadius: 25,
        justifyContent: 'center',
        alignItems: 'center',
        width: '70%',
    },
    loginButtonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: 'bold',
    },
    registerContainer: {
        flexDirection: 'row',
        marginTop: 20,
    },
    registerText: {
        color: '#000',
    },
    registerLink: {
        color: '#FF4500',
        fontWeight: 'bold',
    },
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#fff',
    },
    loadingLogo: {
        width: 250,
        height: 250,
        marginBottom: 20,
        resizeMode: 'contain',
    },
});