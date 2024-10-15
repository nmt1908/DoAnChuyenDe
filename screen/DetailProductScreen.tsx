import React, { useState } from 'react';
import { View, Text, Image, StyleSheet, ScrollView, TouchableOpacity, Dimensions } from 'react-native';
import Icon from 'react-native-vector-icons/Feather';
import IconIon from 'react-native-vector-icons/Ionicons';

export default function DetailProductScreen({ route, navigation }) {
  const { productName, price, rating, images, description } = route.params;
  const [quantity, setQuantity] = useState(1);

  // Function to handle quantity change
  const handleQuantityChange = (type) => {
    if (type === 'increase') {
      setQuantity(quantity + 1);
    } else if (type === 'decrease' && quantity > 1) {
      setQuantity(quantity - 1);
    }
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.navigate('HomeTab')}>
          <IconIon name="arrow-back" size={30} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Chi tiết sản phẩm</Text>
      </View>

      {/* Product Images */}
      <View style={styles.imageSection}>
        <ScrollView
          horizontal
          pagingEnabled
          showsHorizontalScrollIndicator={false}
          style={styles.imageContainer}
        >
          {images.map((image, index) => (
            <Image key={index} source={image} style={styles.productImage} />
          ))}
        </ScrollView>
        <Text style={styles.swipeHint}>Vuốt để xem các ảnh khác</Text>
      </View>

      {/* Product Info */}
      <View style={styles.productInfo}>
        <Text style={styles.productName}>{productName}</Text>
        <View style={styles.ratingRow}>
          <Text style={styles.price}>{price}</Text>
          <View style={styles.ratingContainer}>
            <Text style={styles.ratingText}>{rating}</Text>
            <Icon name="star" size={20} color="#FFD700" />
          </View>
        </View>

        <Text style={styles.specificationTitle}>Thông số kỹ thuật</Text>
        <Text style={styles.specificationText}>
          {description.length > 200
            ? `${description.slice(0, 200)}...`
            : description}
        </Text>
      </View>

      {/* Reviews */}
      <View style={styles.bottomSection}>
        <TouchableOpacity style={styles.reviewButton}>
          <Text style={styles.reviewButtonText}>Xem tất cả các đánh giá</Text>
          <Icon name="chevron-right" size={20} color="#FF4500" />
        </TouchableOpacity>

        {/* Quantity and Add to Cart */}
        <View style={styles.cartContainer}>
          <View style={styles.quantityContainer}>
            <TouchableOpacity onPress={() => handleQuantityChange('decrease')} style={styles.quantityButton}>
              <Text style={styles.quantityButtonText}>-</Text>
            </TouchableOpacity>
            <Text style={styles.quantity}>{quantity}</Text>
            <TouchableOpacity onPress={() => handleQuantityChange('increase')} style={styles.quantityButton}>
              <Text style={styles.quantityButtonText}>+</Text>
            </TouchableOpacity>
          </View>
          <TouchableOpacity style={styles.addToCartButton}>
            <Text style={styles.addToCartText}>Thêm vào giỏ hàng</Text>
          </TouchableOpacity>
        </View>
      </View>
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
    padding: 15,
    backgroundColor: '#FF4500',
  },
  headerTitle: {
    color: '#fff',
    fontSize: 20,
    marginLeft: 20,
    fontWeight: 'bold',
  },
  imageSection: {
    backgroundColor: '#f8f8f8',  // Đặt màu nền khác biệt cho phần ảnh
    paddingBottom: 10,
  },
  imageContainer: {
    height: 300,
    backgroundColor: '#fff',
  },
  productImage: {
    width: Dimensions.get('window').width,
    height: '100%',
    resizeMode: 'contain',
  },
  swipeHint: {
    textAlign: 'center',
    color: '#fff',
    fontSize: 14,
    backgroundColor: '#F1694E',
  },
  productInfo: {
    paddingHorizontal: 20,
    paddingBottom: 20,
    flexGrow: 1, // Đẩy phần còn lại lên trên
  },
  productName: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#000',
    marginBottom: 10,
  },
  ratingRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  price: {
    fontSize: 24,
    color: 'red',
    fontWeight: 'bold',
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  ratingText: {
    fontSize: 18,
    marginRight: 5,
  },
  specificationTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginTop: 10,
  },
  specificationText: {
    fontSize: 14,
    marginTop: 5,
    color: '#666',
  },
  bottomSection: {
    justifyContent: 'flex-end',
    paddingBottom: 20,
  },
  reviewButton: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 20,
    borderTopWidth: 1,
    borderTopColor: '#ddd',
  },
  reviewButtonText: {
    color: '#FF4500',
    fontWeight: 'bold',
  },
  cartContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    alignItems: 'center',
    paddingTop: 10,
  },
  quantityContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  quantityButton: {
    backgroundColor: '#ddd',
    padding: 10,
    borderRadius: 5,
  },
  quantityButtonText: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  quantity: {
    fontSize: 18,
    marginHorizontal: 10,
  },
  addToCartButton: {
    backgroundColor: '#FF4500',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
  },
  addToCartText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});