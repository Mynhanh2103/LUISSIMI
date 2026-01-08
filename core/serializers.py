from rest_framework import serializers
from .models import User, Product, ProductImage, Order, OrderItem, HeroSection, BrandStory, CraftsmanshipItem, Color
from .models import CartItem
from django.contrib.auth import get_user_model
# 1. Serializer cho người dùng
User = get_user_model()
class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'username', 'email', 'role']

# 2. Serializer cho ảnh sản phẩm (Quan trọng cho Slider/QuickView)
class ProductImageSerializer(serializers.ModelSerializer):
    # Đảm bảo trả về URL đầy đủ từ Cloudinary
    image = serializers.ImageField(use_url=True)
    
    class Meta:
        model = ProductImage
        fields = ['id', 'image']
class ColorSerializer(serializers.ModelSerializer):
    class Meta:
        model = Color
        fields = ['id', 'name', 'hex_code']
# 3. Serializer cho Sản phẩm (Đầy đủ thông số Catalog)
class ProductSerializer(serializers.ModelSerializer):
    # Lấy danh sách ảnh thông qua related_name='images' trong model
    images = ProductImageSerializer(many=True, read_only=True)
    colors = ColorSerializer(many=True, read_only=True)
    class Meta:
        model = Product
        fields = [
            'id', 'name', 'description', 'price', 'colors', 'category', 'stock', 
            'status', 'is_featured', 'created_at', 'images',
            'collab_info', 'craftsmanship', 'material_detail', 
            'design_style', 'capacity', 'dimensions', 'weight', 'aging_process'
        ]

# 4. Serializer cho Đơn hàng
class OrderItemSerializer(serializers.ModelSerializer):
    product_name = serializers.ReadOnlyField(source='product.name')
    
    class Meta:
        model = OrderItem
        fields = ['id', 'product', 'product_name', 'quantity', 'price']

class OrderSerializer(serializers.ModelSerializer):
    items = OrderItemSerializer(many=True, read_only=True)
    user_email = serializers.ReadOnlyField(source='user.email')
    
    class Meta:
        model = Order
        fields = ['id', 'user', 'user_email', 'total_price', 'status', 'created_at', 'items']

# 5. Serializers cho Quản trị nội dung (CMS)

class HeroSectionSerializer(serializers.ModelSerializer):
    # Media có thể là Video hoặc Ảnh
    media = serializers.FileField(use_url=True)
    
    class Meta:
        model = HeroSection
        fields = ['id', 'title', 'subtitle', 'media', 'is_video', 'is_active']

class BrandStorySerializer(serializers.ModelSerializer):
    # Phải có đầy đủ 'content' để React hiển thị
    image = serializers.ImageField(use_url=True)
    logo_brand = serializers.ImageField(use_url=True)
    
    class Meta:
        model = BrandStory
        fields = ['id', 'heading', 'sub_heading', 'content', 'image', 'logo_brand']

class CraftsmanshipItemSerializer(serializers.ModelSerializer):
    image = serializers.ImageField(use_url=True)
    
    class Meta:
        model = CraftsmanshipItem
        fields = ['id', 'title', 'image', 'order', 'description']

# core/serializers.py
class CartItemSerializer(serializers.ModelSerializer):
    # Lấy thông tin chi tiết sản phẩm để React hiện ảnh/tên
    product = ProductSerializer(read_only=True) 
    
    class Meta:
        model = CartItem
        fields = ['id', 'product', 'quantity']

class RegisterSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        # Đảm bảo các trường này khớp với payload từ React gửi lên
        fields = ('username', 'email', 'password', 'first_name')
        extra_kwargs = {'password': {'write_only': True}}

    def create(self, validated_data):
        # Dùng create_user để mật khẩu được băm (hash) an toàn
        user = User.objects.create_user(
            username=validated_data['username'],
            email=validated_data['email'],
            password=validated_data['password'],
            first_name=validated_data.get('first_name', '')
        )
        return user