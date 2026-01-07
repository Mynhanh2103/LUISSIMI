from django.db import models
from django.contrib.auth.models import AbstractUser
from cloudinary.models import CloudinaryField
from django.contrib.auth.models import AbstractUser
class User(AbstractUser):
    # Đồng bộ với User.js
    role = models.CharField(max_length=10, default="admin")

class Product(models.Model):
    # Các danh mục khớp với bộ lọc trong Collection.jsx
    CATEGORY_CHOICES = [
        ('tote', 'Tote'),
        ('shoulder', 'Shoulder Bag'),
        ('crossbody', 'Crossbody Bag'),
    ]
    
    # Đảm bảo dòng này thụt lề 4 dấu cách so với chữ 'class'
    STATUS_CHOICES = [
        ('draft', 'Nháp'),
        ('published', 'Đã đăng'),
    ]

    name = models.CharField(max_length=255, db_index=True)
    description = models.TextField(blank=True, null=True)
    price = models.DecimalField(max_digits=12, decimal_places=2)
    category = models.CharField(max_length=20, choices=CATEGORY_CHOICES, default='tote')
    stock = models.IntegerField(default=0)
    status = models.CharField(max_length=15, choices=STATUS_CHOICES, default='published')
    is_featured = models.BooleanField(default=False, verbose_name="Sản phẩm nổi bật")
    created_at = models.DateTimeField(auto_now_add=True)
    craftsmanship = models.CharField(
        max_length=255, 
        default="100% Handmade, meticulous hand-stitching",
        help_text="Nghệ thuật thủ công"
    )
    material_detail = models.CharField(
        max_length=255, 
        null=True, blank=True,
        help_text="VD: Italian Pull-up leather"
    )
    design_style = models.CharField(
        max_length=255, 
        null=True, blank=True,
        help_text="VD: Minimalist, gender-neutral"
    )
    capacity = models.TextField(
        null=True, blank=True,
        help_text="Khả năng chứa (VD: 9 card slots)"
    )
    # SỬA LỖI TẠI ĐÂY: Thay placeholder bằng help_text
    dimensions = models.CharField(
        max_length=100, 
        blank=True, 
        null=True, 
        help_text="VD: 20 x 10 x 2 cm" 
    )
    weight = models.CharField(
        max_length=100, 
        blank=True, 
        null=True, 
        help_text="Trọng lượng sản phẩm"
    )
    
    # Trường đặc biệt cho đồ da [cite: 65]
    aging_process = models.TextField(default="Unique patina develops over time", blank=True)
    collab_info = models.CharField(max_length=255, default="NAMGIA-ATELIER x LUISSIMI")
    def __str__(self):
        return self.name
    
class ProductImage(models.Model):
    # Quản lý mảng images từ Product.js
    product = models.ForeignKey(Product, related_name='images', on_delete=models.CASCADE)
    image = CloudinaryField('image')

class Order(models.Model):
    # Đồng bộ với Order.js
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    total_price = models.DecimalField(max_digits=12, decimal_places=2)
    status = models.CharField(max_length=20, default="pending")
    created_at = models.DateTimeField(auto_now_add=True)

class HeroSection(models.Model):
    # Quản lý video/ảnh Hero
    title = models.CharField(max_length=200, default="LUISSIMI")
    subtitle = models.TextField(blank=True)
    media = CloudinaryField('media', resource_type='auto') # Hỗ trợ video
    is_video = models.BooleanField(default=False)
    is_active = models.BooleanField(default=True)

class BrandStory(models.Model):
    # Quản lý "Câu chuyện thương hiệu"
    heading = models.CharField(max_length=200, default="NGHỆ THUẬT THỦ CÔNG")
    sub_heading = models.CharField(max_length=200, default="Câu chuyện thương hiệu")
    content = models.TextField()
    image = CloudinaryField('image')
    logo_brand = CloudinaryField('logo')

class CraftsmanshipItem(models.Model):
    # Quản lý 3 tấm ảnh dưới cùng
    title = models.CharField(max_length=100)
    image = CloudinaryField('image')
    order = models.IntegerField(default=0)
    description = models.TextField(
        blank=True, 
        null=True, 
        help_text="Mô tả ngắn về giá trị cốt lõi"
    )
    class Meta:
        ordering = ['order']

class OrderItem(models.Model):
    order = models.ForeignKey(Order, related_name='items', on_delete=models.CASCADE)
    product = models.ForeignKey(Product, related_name='orderitem', on_delete=models.CASCADE)
    quantity = models.IntegerField(default=1)
    price = models.DecimalField(max_digits=12, decimal_places=2) # Lưu giá lúc mua

class Color(models.Model):
    name = models.CharField(max_length=50, verbose_name="Tên màu") # VD: Đỏ Rượu
    hex_code = models.CharField(max_length=7, help_text="VD: #800020", verbose_name="Mã màu Hex")

    def __str__(self):
        return self.name
    
class CartItem(models.Model):
    # Kết nối với sản phẩm đã có
    user = models.ForeignKey(User, on_delete=models.CASCADE, null=True, blank=True)
    product = models.ForeignKey(Product, on_delete=models.CASCADE)
    quantity = models.PositiveIntegerField(default=1)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.product.name} ({self.quantity})"
    
class Wishlist(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name="favorites")
    product = models.ForeignKey(Product, on_delete=models.CASCADE)
    added_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        unique_together = ('user', 'product') # Một người chỉ thả tim 1 sản phẩm 1 lần