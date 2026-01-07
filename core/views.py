from django.shortcuts import render

# Create your views here.
from rest_framework import viewsets, filters
from rest_framework.pagination import PageNumberPagination
from django_filters.rest_framework import DjangoFilterBackend
from .models import Product, HeroSection, BrandStory, CraftsmanshipItem, Order, CartItem
from .serializers import (
    ProductSerializer, HeroSectionSerializer, 
    BrandStorySerializer, CraftsmanshipItemSerializer, OrderSerializer, CartItemSerializer
)
from rest_framework.decorators import api_view, permission_classes # Thêm dòng này
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import status
from django.contrib.auth.models import User
from django.contrib.auth.hashers import make_password
from rest_framework_simplejwt.tokens import RefreshToken
# 1. Cấu hình phân trang giống logic của bạn ở Frontend (limit = 12)
class StandardResultsSetPagination(PageNumberPagination):
    page_size = 12
    page_size_query_param = 'limit'
    max_page_size = 100

# 2. View cho Sản phẩm (Hỗ trợ tìm kiếm, lọc danh mục và giá)
class ProductViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = Product.objects.filter(status='published').order_by('-created_at')
    serializer_class = ProductSerializer
    pagination_class = StandardResultsSetPagination # Trả về dạng { "results": [...] }

    def get_queryset(self):
        queryset = super().get_queryset()
        
        # Lọc theo sản phẩm nổi bật cho trang chủ
        is_featured = self.request.query_params.get('is_featured')
        if is_featured:
            queryset = queryset.filter(is_featured=True)

        # Lọc theo danh mục (tote, shoulder, crossbody)
        category = self.request.query_params.get('category')
        if category:
            queryset = queryset.filter(category=category)

        # Lọc theo khoảng giá
        min_price = self.request.query_params.get('minPrice')
        max_price = self.request.query_params.get('maxPrice')
        if min_price:
            queryset = queryset.filter(price__gte=min_price)
        if max_price:
            queryset = queryset.filter(price__lte=max_price)

        # Tìm kiếm theo tên
        search = self.request.query_params.get('search')
        if search:
            queryset = queryset.filter(name__icontains=search)

        # Sắp xếp (newest, price_asc, price_desc)
        sort = self.request.query_params.get('sort')
        if sort == 'price_asc':
            queryset = queryset.order_by('price')
        elif sort == 'price_desc':
            queryset = queryset.order_by('-price')
            
        return queryset

# 3. View cho Hero Section (Video/Ảnh đầu trang)
class HeroSectionViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = HeroSection.objects.filter(is_active=True)
    serializer_class = HeroSectionSerializer
    # Tắt phân trang để trả về mảng thuần cho dễ dùng ở Home.jsx
    pagination_class = None 

# 4. View cho Câu chuyện thương hiệu
class BrandStoryViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = BrandStory.objects.all()
    serializer_class = BrandStorySerializer
    pagination_class = None

# 5. View cho Nghệ thuật thủ công (Lookbook 3 ảnh)
class CraftsmanshipItemViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = CraftsmanshipItem.objects.all().order_by('order')
    serializer_class = CraftsmanshipItemSerializer
    pagination_class = None

# 6. View cho Đơn hàng (Dành cho chức năng giỏ hàng sau này)
class OrderViewSet(viewsets.ModelViewSet):
    queryset = Order.objects.all()
    serializer_class = OrderSerializer

@api_view(['POST'])
@permission_classes([AllowAny])
def add_to_cart(request):
    product_id = request.data.get('productId')
    quantity = int(request.data.get('quantity', 1))
    
    # Logic: Nếu sản phẩm đã có trong giỏ thì tăng số lượng, chưa có thì tạo mới
    item, created = CartItem.objects.get_or_create(product_id=product_id)
    if not created:
        item.quantity += quantity
    else:
        item.quantity = quantity
    item.save()
    
    return Response({"message": "Đã thêm vào giỏ!"}, status=status.HTTP_201_CREATED)

@api_view(['GET'])
@permission_classes([AllowAny])
def get_cart_items(request):
    # Lấy toàn bộ danh sách giỏ hàng gửi về React
    if request.user.is_authenticated:
        items = CartItem.objects.filter(user=request.user)
    else:
        items = CartItem.objects.none() # Khách vãng lai sẽ dùng LocalStorage ở React
    
    serializer = CartItemSerializer(items, many=True)
    return Response(serializer.data)

@api_view(['POST'])
@permission_classes([AllowAny])
def register_customer(request):
    data = request.data
    try:
        # Tạo user mới từ thông tin đăng ký
        user = User.objects.create(
            username=data['email'],
            email=data['email'],
            password=make_password(data['password']),
            first_name=data.get('name', '')
        )
        return Response({'message': 'Đăng ký thành công!'}, status=status.HTTP_201_CREATED)
    except Exception as e:
        return Response({'error': 'Email đã tồn tại'}, status=status.HTTP_400_BAD_REQUEST)

@api_view(['POST'])
@permission_classes([AllowAny])
def customer_login(request):
    username = request.data.get('username') # Hoặc email
    password = request.data.get('password')
    user = authenticate(username=username, password=password)
    
    if user:
        refresh = RefreshToken.for_user(user)
        return Response({
            'access': str(refresh.access_token),
            'name': user.first_name,
            'email': user.email
        })
    return Response({'error': 'Thông tin đăng nhập sai'}, status=status.HTTP_401_UNAUTHORIZED)

@api_view(['PATCH', 'DELETE'])
@permission_classes([IsAuthenticated])
def cart_item_detail(request, pk):
    try:
        # Đảm bảo khách hàng chỉ được sửa/xóa giỏ hàng của chính mình
        item = CartItem.objects.get(pk=pk, user=request.user)
    except CartItem.DoesNotExist:
        return Response(status=status.HTTP_404_NOT_FOUND)

    if request.method == 'PATCH':
        item.quantity = request.data.get('quantity', item.quantity)
        item.save()
        return Response({'message': 'Cập nhật thành công'})

    if request.method == 'DELETE':
        item.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)
    
@api_view(['POST'])
@permission_classes([IsAuthenticated])
def merge_cart(request):
    items = request.data.get('items', [])
    for item in items:
        product_id = item['product']['id']
        quantity = item['quantity']
        
        # Logic: Update hoặc Create trong Database
        cart_item, created = CartItem.objects.get_or_create(
            user=request.user, 
            product_id=product_id,
            defaults={'quantity': quantity}
        )
        if not created:
            cart_item.quantity += quantity
            cart_item.save()
            
    return Response({"message": "Gộp giỏ hàng thành công"}, status=200)