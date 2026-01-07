from django.contrib import admin
from django import forms
from django.utils.html import format_html
from .models import Product, Order, ProductImage, OrderItem
from .models import HeroSection, BrandStory, CraftsmanshipItem
# Register your models here.

class ProductAdminForm(forms.ModelForm):
    class Meta:
        model = Product
        fields = '__all__'
        widgets = {
            'dimensions': forms.TextInput(attrs={'placeholder': 'VD: 20 x 10 x 2 cm'}),
            'capacity': forms.Textarea(attrs={'placeholder': '- 1 main compartment\n- 9 card slots'}),
        }

class ProductImageInline(admin.TabularInline):
    model = ProductImage
    extra = 8

@admin.register(Product)
class ProductAdmin(admin.ModelAdmin):
    form = ProductAdminForm # Gán form đã có placeholder vào đây
    inlines = [ProductImageInline]
    # Thêm cột hiển thị ảnh nhỏ
    def image_tag(self, obj):
        first_image = obj.images.first()
        if first_image:
            return format_html('<img src="{}" style="width: 50px; height:50px; object-fit: cover; border-radius: 4px;" />', first_image.image.url)
        return "No Image"
    
    image_tag.short_description = 'Ảnh'

    list_display = ('image_tag', 'name', 'price', 'stock', 'status', 'category')
    list_filter = ('status', 'category', 'created_at')
    search_fields = ('name', 'description')
    ordering = ('-created_at',)

@admin.register(Order)
class OrderAdmin(admin.ModelAdmin):
    list_display = ('id', 'user', 'total_price', 'status_colored', 'created_at')
    list_filter = ('status', 'created_at')
    
    # Hiển thị màu sắc cho trạng thái đơn hàng
    def status_colored(self, obj):
        colors = {
            'pending': '#ff9800', # Cam
            'paid': '#4caf50',    # Xanh lá
            'completed': '#2196f3',# Xanh dương
            'cancelled': '#f44336',# Đỏ
        }
        return format_html(
            '<span style="color: white; background-color: {}; padding: 4px 8px; border-radius: 12px; font-size: 12px;">{}</span>',
            colors.get(obj.status, '#ccc'),
            obj.status.upper()
        )
    status_colored.short_description = 'Trạng thái'

class ProductImageInline(admin.TabularInline):
    model = ProductImage
    extra = 1

class LuissimiAdminSite(admin.AdminSite):
    site_header = "LUISSIMI LUXURY ADMIN"
    index_template = "admin/dashboard.html"

    def index(self, request, extra_context=None):
        # 1. Tính toán các con số thống kê (Logic đồng bộ với Node.js)
        total_users = User.objects.count()
        total_products = Product.objects.count()
        total_orders = Order.objects.count()

        # Doanh thu từ đơn hàng đã thanh toán/hoàn thành
        revenue = Order.objects.filter(
            status__in=['paid', 'shipped', 'completed']
        ).aggregate(total=Sum('total_price'))['total'] or 0

        # 2. Top 5 sản phẩm bán chạy nhất dựa trên OrderItem
        top_products = Product.objects.annotate(
            sold=Sum('orderitem__quantity')
        ).filter(sold__gt=0).order_by('-sold')[:5]

        # 3. Lấy 4 sản phẩm mới nhất cho "Bộ sưu tập nổi bật"
        featured_products = Product.objects.all().order_by('-created_at')[:4]

        # 4. Đưa toàn bộ dữ liệu vào context của Template
        extra_context = extra_context or {}
        extra_context.update({
            'total_users': total_users,
            'total_products': total_products,
            'total_orders': total_orders,
            'total_revenue': revenue,
            'top_products': top_products,
            'featured_products': featured_products,
            'brand_color': '#C6A667', # Màu Gold đặc trưng
        })
        
        return super().index(request, extra_context)

# Khởi tạo admin_site để dùng trong urls.py
admin_site = LuissimiAdminSite(name='luissimi_admin')

@admin.register(HeroSection)
class HeroAdmin(admin.ModelAdmin):
    list_display = ('title', 'is_video', 'is_active')

@admin.register(BrandStory)
class BrandStoryAdmin(admin.ModelAdmin):
    # Vì chỉ có 1 câu chuyện thương hiệu, ta giới hạn không cho tạo thêm
    def has_add_permission(self, request):
        return BrandStory.objects.count() == 0

@admin.register(CraftsmanshipItem)
class CraftsmanshipAdmin(admin.ModelAdmin):
    list_display = ('title', 'order', 'description')