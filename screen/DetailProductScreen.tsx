import React, { useState } from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity, Dimensions } from 'react-native';
import Icon from 'react-native-vector-icons/Feather';
import IconIon from 'react-native-vector-icons/Ionicons';
import Carousel from 'react-native-reanimated-carousel';
import IconFontAwesome from 'react-native-vector-icons/FontAwesome';
import { ScrollView } from 'react-native-gesture-handler';

export default function DetailProductScreen({ route, navigation }) {
  const { productName, price, rating, images, description } = route.params;
  const [quantity, setQuantity] = useState(1);
  const [currentIndex, setCurrentIndex] = useState(0); // Thêm state để theo dõi index của slide hiện tại

  const { width } = Dimensions.get('window'); // Get screen width for the carousel

  const handleQuantityChange = (type) => {
    if (type === 'increase') {
      setQuantity(quantity + 1);
    } else if (type === 'decrease' && quantity > 1) {
      setQuantity(quantity - 1);
    }
  };

  const renderStars = (rating) => {
    const fullStars = Math.floor(rating);
    const halfStar = rating - fullStars >= 0.5;
    const emptyStars = 5 - fullStars - (halfStar ? 1 : 0);

    const stars = [];

    for (let i = 0; i < fullStars; i++) {
      stars.push(<IconFontAwesome key={`full-${i}`} name="star" size={20} color="#FFD700" />);
    }

    if (halfStar) {
      stars.push(<IconFontAwesome key="half-star" name="star-half" size={20} color="#FFD700" />);
    }

    for (let i = 0; i < emptyStars; i++) {
      stars.push(<IconFontAwesome key={`empty-${i}`} name="star" size={20} color="#E0E0E0" />);
    }

    return stars;
  };

  return (
    <ScrollView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.navigate('HomeTab')}>
          <IconIon name="arrow-back" size={30} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Chi tiết sản phẩm</Text>
      </View>

      {/* Product Images using Carousel */}
      <View style={styles.imageSection}>
        <Carousel
          width={width}
          height={300}
          data={images}
          renderItem={({ item }) => <Image source={{ uri: item }} style={styles.productImage} />}
          autoPlay={true}
          scrollAnimationDuration={1000}
          loop={true}
          onSnapToItem={(index) => setCurrentIndex(index)} // Cập nhật index hiện tại
        />

        {/* Custom Dots Indicator */}
        <View style={styles.dotsContainer}>
          {images.map((_, index) => (
            <View
              key={index}
              style={[
                styles.dot,
                currentIndex === index ? styles.activeDot : styles.inactiveDot,
              ]}
            />
          ))}
        </View>
      </View>

      {/* Product Info */}
      <View style={styles.productInfo}>
        <Text style={styles.productName}>{productName}</Text>
        <View style={styles.ratingRow}>
          <Text style={styles.price}>{price}</Text>
          <View style={styles.ratingContainer}>
            <Text style={styles.ratingText}>{rating}</Text>
            <View style={styles.starContainer}>{renderStars(rating)}</View>
          </View>
        </View>

        <Text style={styles.specificationTitle}>Thông số kỹ thuật</Text>
        <Text style={styles.specificationText}>
          {description.length > 300 ? `${description.slice(0, 300)}...` : description}
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
            <TouchableOpacity
              onPress={() => handleQuantityChange('decrease')}
              style={styles.quantityButton}
            >
              <Text style={styles.quantityButtonText}>-</Text>
            </TouchableOpacity>
            <Text style={styles.quantity}>{quantity}</Text>
            <TouchableOpacity
              onPress={() => handleQuantityChange('increase')}
              style={styles.quantityButton}
            >
              <Text style={styles.quantityButtonText}>+</Text>
            </TouchableOpacity>
          </View>
          <TouchableOpacity style={styles.addToCartButton}>
            <Text style={styles.addToCartText}>Thêm vào giỏ hàng</Text>
          </TouchableOpacity>
        </View>
      </View>
    </ScrollView>
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
    paddingTop: 20,
    backgroundColor: '#fff',
    height: 350,
  },
  productImage: {
    width: Dimensions.get('window').width,
    height: '100%',
    resizeMode: 'contain',
  },
  dotsContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: 30,
  },
  dot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    marginHorizontal: 5,
  },
  activeDot: {
    backgroundColor: '#FF4500',
  },
  inactiveDot: {
    backgroundColor: 'gray',
  },
  productInfo: {
    backgroundColor: '#fff',
    marginHorizontal: 15,
    marginTop:-25,
    borderRadius: 15,
    paddingTop: 20,
    paddingLeft: 20,
    paddingRight: 20,
    paddingBottom: 70,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  productName: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#000',
    marginBottom: 5,
  },
  ratingRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  price: {
    fontSize: 24,
    color: '#FF0000',
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
    marginTop: 10,
    color: '#000',
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
    color:'#000',
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
  starContainer: {
    flexDirection: 'row',
    marginLeft: 5,
  },
});