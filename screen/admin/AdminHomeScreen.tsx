import React from 'react';
import {
  View, Text, Image, StyleSheet, ScrollView, TouchableOpacity,
  KeyboardAvoidingView, Platform
} from 'react-native';
import Icon from 'react-native-vector-icons/Feather';
export default function AdminHomeScreen({ navigation }) {
  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'} // Điều chỉnh cho iOS hoặc Android
    >
      <ScrollView contentContainerStyle={styles.container}>
        <View style={styles.container2}>
          {/* Danh mục các hãng */}
          <View style={styles.categoryContainer}>
            <Text style={styles.categoryTitle}>Danh mục sản phẩm</Text>
            <ScrollView horizontal={true} showsHorizontalScrollIndicator={false}>
              <View style={styles.categoryRow}>
                <TouchableOpacity style={styles.categoryItem}>
                  <Image source={require('../../assets/images/iphone16.jpg')} style={styles.categoryIcon} />
                  <Text>Điện thoại</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.categoryItem}>
                  <Image source={require('../../assets/images/macpro.png')} style={styles.categoryIcon} />
                  <Text>Laptop</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.categoryItem}>
                  <Image source={require('../../assets/images/tablet-ipad-pro.jpg')} style={styles.categoryIcon} />
                  <Text>Tablet</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.categoryItem}>
                  <Image source={require('../../assets/images/pc-gaming.png')} style={styles.categoryIcon} />
                  <Text>PC</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.categoryItem}>
                  <Image source={require('../../assets/images/logoapple.png')} style={styles.categoryIcon} />
                  <Text>Apple</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.categoryItem}>
                  <Image source={require('../../assets/images/logoapple.png')} style={styles.categoryIcon} />
                  <Text>Apple</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.categoryItem}>
                  <Image source={require('../../assets/images/logoapple.png')} style={styles.categoryIcon} />
                  <Text>Apple</Text>
                </TouchableOpacity>
              </View>
            </ScrollView>

          </View>
          <View style={styles.categoryContainer}>
            <Text style={styles.categoryTitle}>Danh mục thương hiệu</Text>
            <ScrollView horizontal={true} showsHorizontalScrollIndicator={false}>
              <View style={styles.categoryRow}>
                <TouchableOpacity style={styles.categoryItem}>
                  <Image source={require('../../assets/images/logoapple.png')} style={styles.categoryIcon} />
                  <Text>Apple</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.categoryItem}>
                  <Image source={require('../../assets/images/samsunglogo.jpg')} style={styles.categoryIcon} />
                  <Text>Samsung</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.categoryItem}>
                  <Image source={require('../../assets/images/oppologo.jpg')} style={styles.categoryIcon} />
                  <Text>Oppo</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.categoryItem}>
                  <Image source={require('../../assets/images/lenovologo.jpg')} style={styles.categoryIcon} />
                  <Text>Lenovo</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.categoryItem}>
                  <Image source={require('../../assets/images/acerlogo.jpg')} style={styles.categoryIcon} />
                  <Text>Acer</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.categoryItem}>
                  <Image source={require('../../assets/images/logoapple.png')} style={styles.categoryIcon} />
                  <Text>Apple</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.categoryItem}>
                  <Image source={require('../../assets/images/logoapple.png')} style={styles.categoryIcon} />
                  <Text>Apple</Text>
                </TouchableOpacity>
              </View>
            </ScrollView>

          </View>
          {/* Banner quảng cáo */}
          <View style={styles.bannerContainer}>
            <Image source={require('../../assets/images/banner1.png')} style={styles.bannerImage} />
          </View>

          {/* Menu sản phẩm và nút lọc */}
          <View style={styles.productHeader}>
            <Text style={styles.productTitle}>Menu</Text>
            <TouchableOpacity style={styles.filterButton}>
              <Icon name="filter" size={20} color="#000" />
              <Text style={styles.filterText}>Lọc</Text>
            </TouchableOpacity>
          </View>

          {/* Danh sách sản phẩm */}
          <View style={styles.productContainer}>
            {/* Dòng 1 */}
            <TouchableOpacity
              style={styles.productItem}
              onPress={() => navigation.navigate('DetailProductScreen', {
                productName: 'Iphone 16 Pro Max',
                price: '41.000.000đ',
                rating: '5.0',
                description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum'
                ,
                images: [require('../../assets/images/iphone16.jpg'), require('../../assets/images/iphone16.jpg'), require('../../assets/images/iphone16.jpg')]
              })}>
              <Image source={require('../../assets/images/iphone16.jpg')} style={styles.productImage} />
              <Text style={styles.productName}>Iphone 16 Pro Max</Text>
              <Text style={styles.productPrice}>41.000.000đ</Text>
              <Text style={styles.productRating}>★★★★★ (5.0)</Text>
              <TouchableOpacity style={styles.addToCartButton}>
                <Text style={styles.buttonText}>Thêm vào giỏ hàng</Text>
              </TouchableOpacity>
            </TouchableOpacity>

            <TouchableOpacity style={styles.productItem}>
              <Image source={require('../../assets/images/iphone14.jpg')} style={styles.productImage} />
              <Text style={styles.productName}>Iphone 14 Pro Max</Text>
              <Text style={styles.productPrice}>27.999.999đ</Text>
              <Text style={styles.productRating}>★★★★★ (5.0)</Text>
              <TouchableOpacity style={styles.addToCartButton}>
                <Text style={styles.buttonText}>Thêm vào giỏ hàng</Text>
              </TouchableOpacity>
            </TouchableOpacity>

            {/* Dòng 2 */}
            <TouchableOpacity style={styles.productItem}>
              <Image source={require('../../assets/images/iphone16.jpg')} style={styles.productImage} />
              <Text style={styles.productName}>Iphone 16 Pro Max</Text>
              <Text style={styles.productPrice}>41.000.000đ</Text>
              <Text style={styles.productRating}>★★★★★ (5.0)</Text>
              <TouchableOpacity style={styles.addToCartButton}>
                <Text style={styles.buttonText}>Thêm vào giỏ hàng</Text>
              </TouchableOpacity>
            </TouchableOpacity>

            <TouchableOpacity style={styles.productItem}>
              <Image source={require('../../assets/images/iphone14.jpg')} style={styles.productImage} />
              <Text style={styles.productName}>Iphone 14 Pro Max</Text>
              <Text style={styles.productPrice}>27.999.999đ</Text>
              <Text style={styles.productRating}>★★★★★ (5.0)</Text>
              <TouchableOpacity style={styles.addToCartButton}>
                <Text style={styles.buttonText}>Thêm vào giỏ hàng</Text>
              </TouchableOpacity>
            </TouchableOpacity>
          </View>

        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    backgroundColor: '#fff',
  },
  container2: {
    marginBottom: 85,
  },
  categoryContainer: {
    padding: 10,
  },
  categoryTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  categoryRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',

  },
  categoryItem: {
    alignItems: 'center',
    marginRight: 15,
    elevation: 5,
    backgroundColor: '#fff', // Màu nền của sản phẩm
    borderRadius: 10, // Bo góc khung sản phẩm
    padding: 10,
  },
  categoryIcon: {
    width: 60,
    height: 60,
    marginBottom: 5,
  },
  bannerContainer: {
    marginVertical: 10,
    alignItems: 'center',
  },
  bannerImage: {
    width: '100%',
    height: 150,
    resizeMode: 'cover',
  },
  productHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 20,
  },
  productTitle: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  productContainer: {
    flexDirection: 'row',  // Đặt chiều ngang cho dòng
    flexWrap: 'wrap',  // Tự động xuống dòng nếu hết chỗ
    justifyContent: 'space-between',
    paddingHorizontal: 20,
  },
  productRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  productItem: {
    width: '48%',  // Chiều rộng của mỗi sản phẩm
    alignItems: 'center',
    backgroundColor: '#fff', // Màu nền của sản phẩm
    borderRadius: 10, // Bo góc khung sản phẩm
    padding: 10, // Padding cho khung sản phẩm
    marginBottom: 10,
    // Đổ bóng cho Android
    elevation: 5,
  },
  productImage: {
    width: 120,
    height: 120,
    marginBottom: 10,
    resizeMode: 'contain',  // Giữ tỉ lệ ảnh đúng
  },
  productName: {
    fontSize: 14,
    fontWeight: 'bold',
    marginBottom: 5,
    textAlign: 'center',
  },
  productPrice: {
    fontSize: 16,
    color: 'red',
    marginBottom: 5,
  },
  productRating: {
    fontSize: 14,
    color: '#ffcc00',
    marginBottom: 10,
  },
  addToCartButton: {
    backgroundColor: '#ff4500',
    paddingVertical: 8,
    paddingHorizontal: 10,
    borderRadius: 5,
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 12,
  },
  filterButton: {
    flexDirection: 'row',  // Đặt hướng nằm ngang cho các thành phần bên trong
    alignItems: 'center',  // Canh giữa theo trục dọc (vertical)
  },
  filterText: {
    marginLeft: 5,  // Thêm khoảng cách giữa icon và text
    fontSize: 16,
    color: '#000',
    fontWeight: 'bold',
  },
});
