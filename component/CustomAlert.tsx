import React, { useState } from 'react';
import {
    View,
    Text,
    TouchableOpacity,
    StyleSheet,
    Modal,
} from 'react-native';

export default function CustomAlert({ isVisible, title, message, onClose }) {
    return (
        <Modal
            transparent={true}
            visible={isVisible}
            animationType="fade"
            onRequestClose={onClose} // Đóng modal khi người dùng nhấn nút quay lại
        >
            <View style={styles.modalBackground}>
                <View style={styles.modalContainer}>
                    {/* Tiêu đề của Alert */}
                    <Text style={styles.modalTitle}>{title}</Text>

                    {/* Nội dung của Alert */}
                    <Text style={styles.modalMessage}>{message}</Text>

                    {/* Nút OK */}
                    <TouchableOpacity onPress={onClose} style={styles.okButton}>
                        <Text style={styles.okButtonText}>OK</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </Modal>
    );
}

const styles = StyleSheet.create({
    modalBackground: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.5)', // Nền mờ
    },
    modalContainer: {
        width: 300,
        backgroundColor: '#fff',
        borderRadius: 10,
        padding: 20,
        alignItems: 'center',
    },
    modalTitle: {
        fontSize: 22,
        fontWeight: 'bold',
        color: '#FF4500', // Màu cam cho tiêu đề
        marginBottom: 10,
    },
    modalMessage: {
        fontSize: 16,
        color: '#000',
        textAlign: 'center',
        marginBottom: 20,
    },
    okButton: {
        backgroundColor: '#E0E0E0',
        paddingVertical: 10,
        paddingHorizontal: 30,
        borderRadius: 5,
    },
    okButtonText: {
        fontSize: 16,
        color: '#000',
    },
});