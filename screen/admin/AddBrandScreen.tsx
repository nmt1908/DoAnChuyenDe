import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, Image, StyleSheet, ScrollView } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { launchImageLibrary } from 'react-native-image-picker';
import storage from '@react-native-firebase/storage'; // Firebase storage for image upload
import firestore from '@react-native-firebase/firestore'; // Firestore for saving brands
import CustomAlert from '../../component/CustomAlert'; // Custom alert

export default function AddBrandScreen({ navigation, route }) {
  const { brand } = route.params || {}; // Lấy dữ liệu thương hiệu nếu có (sửa thương hiệu)

  const [brandName, setBrandName] = useState('');
  const [description, setDescription] = useState('');
  const [imageUri, setImageUri] = useState('https://firebasestorage.googleapis.com/v0/b/chuyende-13cb1.appspot.com/o/default-images.jpg?alt=media&token=5879beef-c710-4fa7-8e97-9517b33c2dac'); // Default image URI
  const [uploading, setUploading] = useState(false);
  const [transferred, setTransferred] = useState(0);
  const [isAlertVisible, setAlertVisible] = useState(false);
  const [alertContent, setAlertContent] = useState({ title: '', message: '' });
  const [selectedImageUri, setSelectedImageUri] = useState('');
  const [oldImageUrl, setOldImageUrl] = useState(''); // Lưu URL của ảnh cũ để xóa

  // Gán giá trị ban đầu cho thương hiệu (chế độ sửa thương hiệu hoặc thêm mới)
  useEffect(() => {
    if (brand) {
      // Nếu có thương hiệu (chế độ sửa), hiển thị thông tin thương hiệu đó
      setBrandName(brand.tenHang);
      setDescription(brand.moTa);
      setImageUri(brand.urlAnh); // Hiển thị ảnh hiện tại của thương hiệu
      setOldImageUrl(brand.urlAnh); // Lưu URL ảnh cũ để xóa nếu có ảnh mới
      setSelectedImageUri(''); // Reset ảnh đã chọn về rỗng khi chuyển sang thương hiệu mới
    } else {
      // Nếu không có thương hiệu (chế độ thêm), reset các trường về mặc định
      resetFields();
    }
  }, [brand]);

  const showAlert = (title, message) => {
    setAlertContent({ title, message });
    setAlertVisible(true);
  };

  const hideAlert = () => {
    setAlertVisible(false);
    // Điều hướng quay lại trang danh sách thương hiệu
    navigation.navigate('BrandManagement');
  };

  // Mở album ảnh và chọn ảnh
  const selectImage = () => {
    const options = {
      mediaType: 'photo',
      maxWidth: 2000,
      maxHeight: 2000,
      quality: 1,
    };

    launchImageLibrary(options, (response) => {
      if (response.didCancel) {
        console.log('Đóng album ảnh');
      } else if (response.error) {
        console.log('Chọn ảnh thất bại: ', response.error);
      } else {
        const selectedImage = response.assets[0];
        setSelectedImageUri(selectedImage.uri); // Cập nhật URI ảnh đã chọn để hiển thị
      }
    });
  };

  // Upload ảnh lên Firebase Storage
  const uploadImage = async (uri) => {
    if (!uri) return null; // Nếu không có ảnh thì không upload

    const uploadUri = uri;
    let filename = uploadUri.substring(uploadUri.lastIndexOf('/') + 1);

    setUploading(true);
    setTransferred(0);

    const storageRef = storage().ref(`imageBrands/${filename}`);

    try {
      const task = storageRef.putFile(uploadUri);

      // Monitor the upload progress
      task.on('state_changed', (snapshot) => {
        setTransferred(Math.round(snapshot.bytesTransferred / snapshot.totalBytes) * 100);
      });

      await task;
      const downloadUrl = await storageRef.getDownloadURL(); // Lấy URL của ảnh sau khi tải lên
      setUploading(false);
      return downloadUrl; // Trả về URL của ảnh đã upload
    } catch (e) {
      console.log('Lỗi khi tải ảnh lên Firebase: ' + e);
      setUploading(false);
      return null;
    }
  };

  // Xóa ảnh cũ trong Firebase Storage
  const deleteOldImage = async (url) => {
    if (!url) return; // Nếu không có URL ảnh cũ thì không cần xóa
    try {
      const storageRef = storage().refFromURL(url); // Lấy tham chiếu tới ảnh từ URL
      await storageRef.delete(); // Xóa ảnh
      console.log('Ảnh cũ đã được xóa');
    } catch (e) {
      console.log('Lỗi khi xóa ảnh cũ: ', e);
    }
  };

  // Hàm để reset các trường dữ liệu về trạng thái mặc định
  const resetFields = () => {
    setBrandName(''); // Reset tên thương hiệu về chuỗi rỗng
    setDescription(''); // Reset mô tả về chuỗi rỗng
    setImageUri('https://firebasestorage.googleapis.com/v0/b/chuyende-13cb1.appspot.com/o/default-images.jpg?alt=media&token=5879beef-c710-4fa7-8e97-9517b33c2dac'); // Đặt lại ảnh mặc định
    setSelectedImageUri(''); // Xóa URI ảnh đã chọn
    setOldImageUrl(''); // Reset URL ảnh cũ về chuỗi rỗng
  };

  // Thêm hoặc cập nhật thương hiệu vào Firestore
  const addOrUpdateBrand = async () => {
    if (!brandName || !description) {
      showAlert('Cảnh báo', 'Vui lòng điền đầy đủ thông tin & chọn ảnh!');
      return;
    }

    try {
      let imageUrl = imageUri; // Sử dụng URL ảnh hiện tại nếu không có ảnh mới

      if (selectedImageUri) {
        // Chỉ upload ảnh mới nếu có chọn ảnh
        const newImageUrl = await uploadImage(selectedImageUri);
        if (newImageUrl) {
          imageUrl = newImageUrl; // Cập nhật URL ảnh với ảnh mới
          if (oldImageUrl && oldImageUrl !== newImageUrl) {
            // Chỉ xóa ảnh cũ nếu upload ảnh mới thành công và URL khác
            await deleteOldImage(oldImageUrl);
          }
        }
      }

      if (brand) {
        // Nếu đang sửa thương hiệu, cập nhật thông tin
        await firestore().collection('HangSX').doc(brand.id).update({
          tenHang: brandName,
          moTa: description,
          urlAnh: selectedImageUri ? imageUrl : oldImageUrl, // Sử dụng URL ảnh cũ nếu không chọn ảnh mới
        });

        showAlert('Thành công', 'Cập nhật thương hiệu thành công!');
      } else {
        // Nếu thêm mới thương hiệu
        const snapshot = await firestore().collection('HangSX').get();
        const newId = `HangSX_ID${snapshot.size + 1}`; // Tạo ID mới dựa trên số lượng hiện có

        await firestore().collection('HangSX').doc(newId).set({
          tenHang: brandName,
          moTa: description,
          urlAnh: imageUrl, // URL ảnh mới hoặc cũ
        });

        showAlert('Thành công', 'Thêm thương hiệu thành công!');

        // Reset các trường sau khi thêm thương hiệu
        resetFields();
      }
    } catch (error) {
      console.log('Lỗi khi thêm/cập nhật thương hiệu: ', error);
      showAlert('Thất bại', 'Thêm/cập nhật thương hiệu thất bại!');
    }
  };

  return (
    <ScrollView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.navigate('BrandManagement')}>
          <Icon name="arrow-back" size={30} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>{brand ? 'Sửa thương hiệu' : 'Thêm thương hiệu mới'}</Text>
      </View>

      {/* Product Image */}
      <View style={styles.imageContainer}>
        <Image
          source={{ uri: selectedImageUri ? selectedImageUri : imageUri }} // Hiển thị ảnh đã chọn nếu có, ngược lại hiển thị ảnh mặc định
          style={styles.productImage}
        />
        {/* Only the camera icon is clickable */}
        <TouchableOpacity style={styles.cameraIcon} onPress={selectImage}>
          <Icon name="camera" size={20} color="#fff" />
        </TouchableOpacity>
      </View>

      <View style={styles.inputContainer}>
        {/* Form Inputs */}
        <TextInput
          style={styles.input}
          placeholder="Tên thương hiệu"
          value={brandName}
          onChangeText={setBrandName}
        />

        <TextInput
          style={styles.textArea}
          placeholder="Mô tả"
          multiline
          numberOfLines={4}
          value={description}
          onChangeText={setDescription}
        />
      </View>

      {/* Submit Button */}
      <TouchableOpacity style={styles.submitButton} onPress={addOrUpdateBrand} disabled={uploading}>
        <Text style={styles.submitButtonText}>{brand ? 'Lưu thay đổi' : 'Thêm thương hiệu'}</Text>
        <Icon name="arrow-forward" size={20} color="#000" />
      </TouchableOpacity>
      <CustomAlert
        isVisible={isAlertVisible}
        title={alertContent.title}
        message={alertContent.message}
        onClose={hideAlert} // Chỉ quay lại sau khi alert bị đóng
      />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  inputContainer: {
    paddingLeft: 20,
    paddingRight: 20,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start',
    backgroundColor: '#FF4500',
    paddingHorizontal: 15,
    paddingVertical: 15,
    width: '100%',
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#fff',
    marginLeft: 15,
  },
  imageContainer: {
    alignSelf: 'center',
    marginTop: 70,
    marginBottom: 20,
    position: 'relative',
    width: 150,
    height: 150,
    backgroundColor: '#F1F1EF',
    borderRadius: 10,
  },
  productImage: {
    width: '100%',
    height: '100%',
    borderRadius: 40,
    resizeMode: 'contain',
  },
  cameraIcon: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    backgroundColor: '#FF4500',
    borderRadius: 20,
    padding: 5,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 30,
    paddingVertical: 10,
    paddingHorizontal: 20,
    marginBottom: 15,
  },
  textArea: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 30,
    paddingVertical: 10,
    paddingHorizontal: 20,
    marginBottom: 15,
    height: 100,
    textAlignVertical: 'top',
  },
  submitButton: {
    flexDirection: 'row',
    justifyContent: 'center',
    backgroundColor: '#D3F4C7',
    paddingVertical: 15,
    borderRadius: 30,
    margin: 20,
  },
  submitButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#000',
    marginRight: 10,
  },
});
