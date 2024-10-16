import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Image, FlatList, TouchableOpacity, TextInput, Modal } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons'; // Import Ionicons cho nút quay lại và thêm sản phẩm
import FeatherIcon from 'react-native-vector-icons/Feather'; // Import Feather cho nút sửa
import MaterialIcons from 'react-native-vector-icons/MaterialIcons'; // Import MaterialIcons cho nút xóa
import firestore from '@react-native-firebase/firestore'; // Import Firestore từ Firebase
import CustomAlert from '../../component/CustomAlert'; // Import CustomAlert

export default function BrandManagement({ navigation }) {
    const [searchText, setSearchText] = useState(''); // Giá trị tìm kiếm
    const [brandItems, setBrandItems] = useState([]); // State lưu trữ danh sách thương hiệu
    const [isModalVisible, setModalVisible] = useState(false); // Trạng thái của Modal
    const [selectedBrandId, setSelectedBrandId] = useState(null); // Lưu ID thương hiệu cần xóa
    const [selectedBrandName, setSelectedBrandName] = useState(''); // Lưu tên thương hiệu cần xóa
    const [isAlertVisible, setAlertVisible] = useState(false); // Trạng thái của CustomAlert
    const [alertContent, setAlertContent] = useState({ title: '', message: '' }); // Nội dung của alert

    // useEffect để lấy dữ liệu từ Firestore khi component được mount
    useEffect(() => {
        const unsubscribe = firestore()
            .collection('HangSX')
            .onSnapshot(snapshot => {
                const brands = snapshot.docs.map(doc => ({
                    id: doc.id,    // Lấy ID của mỗi document
                    ...doc.data(), // Lấy dữ liệu của mỗi document
                }));
                setBrandItems(brands); // Lưu dữ liệu vào state
            }, error => {
                console.error('Error fetching brands from Firestore: ', error);
            });

        return () => unsubscribe(); // Cleanup listener khi component unmount
    }, []);

    // Hiển thị CustomAlert
    const showAlert = (title, message) => {
        setAlertContent({ title, message });
        setAlertVisible(true);

        // Ẩn CustomAlert sau 2 giây
        setTimeout(() => {
            setAlertVisible(false);
        }, 2000);
    };

    // Hàm mở Modal và lưu lại ID, tên thương hiệu cần xóa
    const showDeleteModal = (id, name) => {
        setSelectedBrandId(id);
        setSelectedBrandName(name); // Lưu tên thương hiệu cần xóa
        setModalVisible(true);
    };

    // Đóng Modal
    const hideModal = () => {
        setModalVisible(false);
        setSelectedBrandId(null); // Reset lại thương hiệu đã chọn
        setSelectedBrandName(''); // Reset lại tên thương hiệu
    };

    // Hàm xóa thương hiệu từ Firestore
    const handleDeleteBrand = async () => {
        if (selectedBrandId) {
            try {
                await firestore().collection('HangSX').doc(selectedBrandId).delete();
                console.log('Thương hiệu đã được xóa!');
                showAlert('Thành công', `Thương hiệu "${selectedBrandName}" đã được xóa!`);
            } catch (error) {
                console.error('Lỗi khi xóa thương hiệu: ', error);
            } finally {
                hideModal(); // Đóng modal sau khi xóa
            }
        }
    };

    // Hàm lọc thương hiệu theo từ khóa tìm kiếm
    const filteredProducts = brandItems.filter(brand =>
        brand.tenHang.toLowerCase().includes(searchText.toLowerCase())
    );

    // Render mỗi thương hiệu trong danh sách
    const renderItem = ({ item }) => (
        <View style={styles.productItem}>
            <Image source={{ uri: item.urlAnh }} style={styles.productImage} />
            <View style={styles.productDetails}>
                <Text style={styles.productName}>{item.tenHang}</Text>
                <Text style={styles.productQuantity}>
                    {item.moTa.length > 100
                        ? `${item.moTa.slice(0, 100)}...`
                        : item.moTa}
                </Text>
            </View>
            {/* Nút sửa và xóa */}
            <View style={styles.actionButtons}>
                <TouchableOpacity
                    style={styles.editButton}
                    onPress={() => navigation.navigate('AddBrandScreen', { brand: item })}>
                    <FeatherIcon name="edit" size={24} color="#007bff" />
                </TouchableOpacity>
                <TouchableOpacity style={styles.deleteButton} onPress={() => showDeleteModal(item.id, item.tenHang)}>
                    <MaterialIcons name="delete" size={24} color="#FF4500" />
                </TouchableOpacity>
            </View>
        </View>
    );

    return (
        <View style={styles.container}>
            {/* Header */}
            <View style={styles.header}>
                <TouchableOpacity onPress={() => navigation.navigate('HomeTab')}>
                    <Icon name="arrow-back" size={30} color="#fff" />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Quản Lý Thương Hiệu</Text>
                <TouchableOpacity onPress={() => navigation.navigate('AddBrandScreen')}>
                    <Icon name="add-circle" size={30} color="#fff" />
                </TouchableOpacity>
            </View>

            {/* Thanh tìm kiếm */}
            <View style={styles.searchContainer}>
                <Icon name="search-outline" size={20} color="#000" style={styles.searchIcon} />
                <TextInput
                    placeholder="Tìm thương hiệu"
                    style={styles.searchInput}
                    placeholderTextColor="#000"
                    value={searchText} // Giá trị từ state
                    onChangeText={(text) => setSearchText(text)} // Cập nhật state khi nhập liệu
                />
                {searchText ? (
                    <TouchableOpacity onPress={() => setSearchText('')} style={styles.clearIconContainer}>
                        <FeatherIcon name="x-circle" size={20} color="#000" />
                    </TouchableOpacity>
                ) : null}
            </View>

            {/* Danh sách thương hiệu */}
            <FlatList
                data={filteredProducts} // Hiển thị danh sách đã lọc
                keyExtractor={(item) => item.id}
                renderItem={renderItem}
                contentContainerStyle={styles.productList}
            />

            {/* Modal xác nhận xóa */}
            <Modal
                visible={isModalVisible}
                animationType="fade"
                transparent={true}
                onRequestClose={hideModal}
            >
                <View style={styles.modalBackground}>
                    <View style={styles.modalContainer}>
                        <Text style={styles.modalTitle}>Xác nhận</Text>
                        <Text style={styles.modalMessage}>Bạn có muốn xóa thương hiệu "{selectedBrandName}" này?</Text>
                        <View style={styles.modalButtonContainer}>
                            <TouchableOpacity onPress={hideModal} style={styles.cancelButton}>
                                <Text style={styles.cancelButtonText}>Hủy</Text>
                            </TouchableOpacity>
                            <TouchableOpacity
                                onPress={handleDeleteBrand}
                                style={styles.deleteButtonModal} // Đổi màu nút thành đỏ
                            >
                                <Text style={styles.deleteButtonText}>Xóa</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            </Modal>

            {/* Custom Alert */}
            <CustomAlert
                isVisible={isAlertVisible}
                title={alertContent.title}
                message={alertContent.message}
                onClose={() => setAlertVisible(false)} // Cho phép ẩn bằng tay
            />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 15,
        paddingVertical: 10,
        backgroundColor: '#FF4500',
    },
    headerTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#fff',
    },
    searchContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#f2f2f2',
        paddingHorizontal: 10,
        margin: 15,
        borderRadius: 10,
    },
    searchInput: {
        flex: 1,
        fontSize: 16,
        color: '#000',
        paddingLeft: 10,
    },
    clearIconContainer: {
        marginLeft: 10,
    },
    productList: {
        paddingBottom: 100, // Giữ khoảng cách với bottom tab nếu có
    },
    productItem: {
        flexDirection: 'row',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: '#ddd',
        padding: 10,
        marginHorizontal: 15,
        marginBottom: 10,
        borderRadius: 10,
        backgroundColor: '#fff',
    },
    productImage: {
        width: 80,
        height: 80,
        resizeMode: 'contain',
    },
    productDetails: {
        flex: 1,
        marginLeft: 10,
    },
    productName: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#000',
    },
    productQuantity: {
        fontSize: 14,
        color: '#000',
        marginTop: 5,
    },
    actionButtons: {
        flexDirection: 'row',
    },
    editButton: {
        backgroundColor: '#f0f8ff',
        padding: 5,
        borderRadius: 5,
        marginRight: 10,
    },
    deleteButton: {
        backgroundColor: '#ffebee',
        padding: 5,
        borderRadius: 5,
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
        fontSize: 17,
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
    deleteButtonModal: {
        backgroundColor: '#ED2828', // Màu nền đỏ cho nút xóa
        paddingVertical: 12,
        paddingHorizontal: 30,
        borderRadius: 5,
        marginHorizontal: 10,
    },
    deleteButtonText: {
        fontSize: 16,
        color: '#fff', // Màu chữ trắng
        fontWeight: 'bold',
    },
});