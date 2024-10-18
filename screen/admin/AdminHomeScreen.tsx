import React, { useState, useEffect, useCallback, useContext } from 'react';
import {
  View, Text, Image, StyleSheet, ScrollView, TouchableOpacity,
  KeyboardAvoidingView, Platform, Dimensions, RefreshControl
} from 'react-native';
import Icon from 'react-native-vector-icons/Feather';
import firestore from '@react-native-firebase/firestore';
import storage from '@react-native-firebase/storage';
import Carousel from 'react-native-reanimated-carousel';
import IconFontAwesome from 'react-native-vector-icons/FontAwesome';
import { SearchContext } from '../../SearchContext';  // Import SearchContext

export default function AdminHomeScreen({ navigation }) {
  const [brands, setBrands] = useState([]);
  const [categories, setCategories] = useState([]);
  const [bannerImages, setBannerImages] = useState([]);
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [selectedCategoryId, setSelectedCategoryId] = useState(null);
  const [selectedBrandId, setSelectedBrandId] = useState(null);
  const [refreshing, setRefreshing] = useState(false);

  const { searchText } = useContext(SearchContext); // Lấy searchText từ SearchContext

  // Fetch dữ liệu ban đầu
  useEffect(() => {
    const fetchInitialData = async () => {
      try {
        // Fetch brands
        const brandCollection = await firestore().collection('HangSX').get();
        const brandList = brandCollection.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        setBrands(brandList);

        // Fetch categories
        const categoryCollection = await firestore().collection('DanhMuc').get();
        const categoryList = categoryCollection.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        setCategories(categoryList);

        // Fetch banner images
        const fetchBannerImages = async () => {
          const storageRef = storage().ref('imageBanner');
          const result = await storageRef.listAll();
          const urls = await Promise.all(result.items.map(item => item.getDownloadURL()));
          setBannerImages(urls);
        };
        fetchBannerImages();

      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchInitialData();
  }, []);

  // Fetch sản phẩm khi thay đổi category hoặc brand
  useEffect(() => {
    fetchProducts();
  }, [selectedCategoryId, selectedBrandId]);

  // Lọc sản phẩm theo từ khóa tìm kiếm
  useEffect(() => {
    if (searchText) {
      const lowerCaseSearchText = searchText.toLowerCase();
      const filtered = products.filter(product =>
        product.tenSP.toLowerCase().includes(lowerCaseSearchText)
      );
      setFilteredProducts(filtered);
    } else {
      setFilteredProducts(products); // Hiển thị tất cả sản phẩm nếu không có từ khóa tìm kiếm
    }
  }, [searchText, products]);

  const fetchProducts = async () => {
    let query = firestore().collection('SanPham');

    // Lọc theo danh mục
    if (selectedCategoryId) {
      query = query.where('maDanhMuc', '==', selectedCategoryId);
    }

    // Lọc theo thương hiệu
    if (selectedBrandId) {
      query = query.where('idHang', '==', selectedBrandId);
    }

    const snapshot = await query.get();
    const productList = await Promise.all(
      snapshot.docs.map(async (doc) => {
        const productData = { id: doc.id, ...doc.data() };

        // Chỉ tải ảnh chính từ Firebase Storage
        const storageRef = storage().ref(`imageProduct/${doc.id}`);
        const result = await storageRef.listAll();
        const imageUrls = await Promise.all(result.items.map(item => item.getDownloadURL()));
        return {
          ...productData,
          imageUrl: imageUrls[0] || 'default-image-url',  // Chỉ tải ảnh chính
        };
      })
    );

    setProducts(productList);
    setFilteredProducts(productList);  // Ban đầu không cần filter thêm vì đã dùng query
  };

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    setSelectedCategoryId(null);
    setSelectedBrandId(null);
    fetchProducts();
    setRefreshing(false);
  }, []);

  const { width } = Dimensions.get('window');

  const renderBannerItem = (item) => (
    <View style={styles.carouselItem}>
      <Image source={{ uri: item }} style={styles.bannerImage} />
    </View>
  );

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
    <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
      <ScrollView
        contentContainerStyle={styles.container}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
      >
        <View style={styles.container2}>
          {/* Danh mục sản phẩm */}
          <View style={styles.categoryContainer}>
            <Text style={styles.categoryTitle}>Danh mục sản phẩm</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
              <View style={styles.categoryRow}>
                {categories.map((category) => (
                  <TouchableOpacity
                    key={category.id}
                    style={[styles.categoryItem, selectedCategoryId === category.id && { borderColor: 'red' }]}
                    onPress={() => setSelectedCategoryId(prevId => prevId === category.id ? null : category.id)}
                  >
                    <Image source={{ uri: category.urlAnh }} style={styles.categoryIcon} />
                    <Text style={styles.categoryName}>{category.tenDanhMuc}</Text>
                  </TouchableOpacity>
                ))}
              </View>
            </ScrollView>
          </View>

          {/* Danh mục thương hiệu */}
          <View style={styles.categoryContainer}>
            <Text style={styles.categoryTitle}>Danh mục thương hiệu</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
              <View style={styles.categoryRow}>
                {brands.map((brand) => (
                  <TouchableOpacity
                    key={brand.id}
                    style={[styles.categoryItem, selectedBrandId === brand.id && { borderColor: 'red' }]}
                    onPress={() => setSelectedBrandId(prevId => prevId === brand.id ? null : brand.id)}
                  >
                    <Image source={{ uri: brand.urlAnh }} style={styles.categoryIcon} />
                    <Text style={styles.brandName}>{brand.tenHang}</Text>
                  </TouchableOpacity>
                ))}
              </View>
            </ScrollView>
          </View>

          {/* Banner */}
          <View style={styles.bannerContainer}>
            {bannerImages.length > 0 && (
              <Carousel
                width={width}
                height={150}
                data={bannerImages}
                autoPlay
                scrollAnimationDuration={1000}
                renderItem={({ item }) => renderBannerItem(item)}
              />
            )}
          </View>

          {/* Product Header and Filter */}
          <View style={styles.productHeader}>
            <Text style={styles.productTitle} >Menu Sản Phẩm</Text>
            <TouchableOpacity style={styles.filterButton}>
              <Icon name="filter" size={20} color="#000" />
              <Text style={styles.filterText}>Lọc</Text>
            </TouchableOpacity>
          </View>

          {/* Danh sách sản phẩm */}
          <View style={styles.productContainer}>
            {filteredProducts.length > 0 ? (
              filteredProducts.map((product) => (
                <TouchableOpacity
                  key={product.id}
                  style={styles.productItem}
                  onPress={async () => {
                    // Tải toàn bộ ảnh khi người dùng nhấn vào chi tiết sản phẩm
                    const storageRef = storage().ref(`imageProduct/${product.id}`);
                    const result = await storageRef.listAll();
                    const allImageUrls = await Promise.all(result.items.map(item => item.getDownloadURL()));

                    navigation.navigate('DetailProductScreen', {
                      productName: product.tenSP,
                      price: `${product.giaBan.toLocaleString()}đ`,
                      rating: product.danhGia,
                      description: product.moTa,
                      images: allImageUrls
                    });
                  }}
                >
                  <Image source={{ uri: product.imageUrl }} style={styles.productImage} />
                  <Text style={styles.productName}>{product.tenSP}</Text>
                  <Text style={styles.productPrice}>{product.giaBan.toLocaleString()}đ</Text>
                  <View style={styles.ratingContainer}>
                    <Text style={styles.ratingMark}>{product.danhGia}</Text>
                    <View style={styles.starContainer}>
                      {renderStars(product.danhGia)}
                    </View>
                  </View>
                  <TouchableOpacity style={styles.addToCartButton}>
                    <Text style={styles.buttonText}>Thêm vào giỏ hàng</Text>
                  </TouchableOpacity>
                </TouchableOpacity>
              ))
            ) : (
              <Text style={styles.noResultsText}>Không có kết quả cho sản phẩm bạn tìm kiếm...</Text>
            )}
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    backgroundColor: '#fff'
  },
  container2: {
    marginBottom: 85
  },
  categoryContainer: {
    padding: 10
  },
  categoryTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#000',
  },
  categoryRow: {
    flexDirection: 'row',
    justifyContent: 'space-around'
  },
  categoryItem: {
    alignItems: 'center',
    marginRight: 15,
    elevation: 5,
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 10
  },
  categoryIcon: {
    width: 60,
    height: 60,
    marginBottom: 5
  },
  brandName:{
    color:'#000',
  },
  categoryName:{
    color:'#000',
  },
  bannerContainer: {
    marginVertical: 10,
    alignItems: 'center',
    backgroundColor: '#F6F5F8'
  },
  bannerImage: {
    width: '100%',
    height: 150,
    resizeMode: 'contain'
  },
  carouselItem: {
    justifyContent: 'center',
    alignItems: 'center'
  },
  productHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 20
  },
  productTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color:'#000',
  },
  productContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    paddingHorizontal: 20
  },
  productItem: {
    width: '48%',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 10,
    marginBottom: 10,
    elevation: 5
  },
  productImage: {
    width: 120,
    height: 120,
    marginBottom: 10,
    resizeMode: 'contain'
  },
  productName: {
    fontSize: 14,
    fontWeight: 'bold',
    marginBottom: 5,
    textAlign: 'center',
    color: '#000',
  },
  productPrice: {
    fontSize: 16,
    color: 'red',
    marginBottom: 5
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10
  },
  starContainer: {
    flexDirection: 'row',
    marginLeft: 5
  },

  addToCartButton: {
    backgroundColor: '#ff4500',
    paddingVertical: 8,
    paddingHorizontal: 10,
    borderRadius: 5
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 12
  },
  filterButton: {
    flexDirection: 'row',
    alignItems: 'center'
  },
  filterText: {
    marginLeft: 5,
    fontSize: 16,
    color: '#000',
    fontWeight: 'bold'
  },
  noResultsText: {
    textAlign: 'center',
    marginTop: 20,
    fontSize: 16,
    color: 'gray'
  },
  ratingMark:{
    color:'#000',
  },
});
