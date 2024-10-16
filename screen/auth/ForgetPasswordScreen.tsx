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
    Platform,
    ActivityIndicator
} from 'react-native';
import firestore from '@react-native-firebase/firestore';
import auth from '@react-native-firebase/auth';
import CustomAlert from '../../component/CustomAlert'; // Import CustomAlert để hiển thị thông báo lỗi/thành công

export default function ForgetPasswordScreen({ navigation }) {
    const [email, setEmail] = useState(''); // Trạng thái để lưu email
    const [loading, setLoading] = useState(false); // Trạng thái theo dõi khi gửi yêu cầu
    const [isAlertVisible, setAlertVisible] = useState(false); // Trạng thái hiển thị alert
    const [alertContent, setAlertContent] = useState({ title: '', message: '' }); // Nội dung của alert

    const showAlert = (title, message) => {
        setAlertContent({ title, message });
        setAlertVisible(true);
    };

    const hideAlert = () => {
        setAlertVisible(false);
    };

    const checkEmailExistsInFirestore = async (email) => {
        try {
            // Truy vấn Firestore để kiểm tra email có tồn tại hay không
            const querySnapshot = await firestore()
                .collection('NguoiDung') // Tên collection trong Firestore
                .where('email', '==', email) // Kiểm tra với trường email
                .get();

            return !querySnapshot.empty; // Trả về true nếu có kết quả, ngược lại trả về false
        } catch (error) {
            console.error('Lỗi khi kiểm tra email trong Firestore:', error);
            return false;
        }
    };

    const handlePasswordReset = async () => {
        const trimmedEmail = email.trim(); // Xóa khoảng trắng
        const emailRegex = /^[a-zA-Z0-9._%+-]{6,30}@gmail\.com$/;

        if (!trimmedEmail) {
            showAlert('Lỗi', 'Vui lòng nhập email. Email không được bỏ trống');
            return;
        }

        if (!emailRegex.test(trimmedEmail)) {
            showAlert('Lỗi', 'Email không hợp lệ! Email phải có ít nhất 6 và tối đa 30 ký tự.');
            return;
        }

        setLoading(true);
        try {
            // Kiểm tra email trong Firestore
            const emailExists = await checkEmailExistsInFirestore(trimmedEmail);

            if (!emailExists) {
                showAlert('Lỗi', 'Email không tồn tại trong hệ thống Firestore.');
            } else {
                // Gửi email đặt lại mật khẩu qua Firebase Authentication
                await auth().sendPasswordResetEmail(trimmedEmail);
                showAlert('Thành công', 'Email đặt lại mật khẩu đã được gửi. Vui lòng kiểm tra hộp thư của bạn.');
            }
        } catch (error) {
            console.error('Lỗi gửi email đặt lại mật khẩu:', error);
            if (error.code === 'auth/invalid-email') {
                showAlert('Lỗi', 'Địa chỉ email không hợp lệ.');
            } else {
                showAlert('Lỗi', 'Đã có lỗi xảy ra. Vui lòng thử lại.');
            }
        } finally {
            setLoading(false);
        }
    };

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
                    placeholder="Nhập email của bạn"
                    value={email}
                    onChangeText={setEmail}
                    autoCapitalize="none"
                    keyboardType="email-address"
                />

                {/* Reset Password Button */}
                <TouchableOpacity onPress={handlePasswordReset} style={styles.loginButton}>
                    {loading ? (
                        <ActivityIndicator size="small" color="#fff" />
                    ) : (
                        <Text style={styles.loginButtonText}>Gửi yêu cầu</Text>
                    )}
                </TouchableOpacity>

                {/* Back to Login */}
                <View style={styles.registerContainer}>
                    <Text style={styles.registerText}>Quay lại </Text>
                    <TouchableOpacity onPress={() => navigation.navigate('LoginScreen')}>
                        <Text style={styles.registerLink}>Đăng nhập</Text>
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
    loginButton: {
        backgroundColor: '#FF4500',
        paddingVertical: 15,
        borderRadius: 25,
        justifyContent: 'center',
        alignItems: 'center',
        width: '70%',
        marginTop: 20,
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
});
