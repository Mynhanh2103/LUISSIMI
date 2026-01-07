from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import (
    ProductViewSet, HeroSectionViewSet, 
    BrandStoryViewSet, CraftsmanshipItemViewSet, OrderViewSet, 
)
from . import views

router = DefaultRouter()
router.register(r'products', ProductViewSet)
router.register(r'hero', HeroSectionViewSet)
router.register(r'brand-story', BrandStoryViewSet)
router.register(r'craftsmanship', CraftsmanshipItemViewSet)
router.register(r'orders', OrderViewSet)

urlpatterns = [
    path('', include(router.urls)),
    path('cart/add/', views.add_to_cart, name='add_to_cart'),
    path('cart/merge/', views.merge_cart, name='merge_cart'),
    path('cart/items/', views.get_cart_items, name='get_cart_items'),
    path('cart/items/<int:pk>/', views.cart_item_detail, name='cart_item_detail'),
    # THÊM ĐƯỜNG DẪN CHO KHÁCH HÀNG
    path('auth/register/', views.register_customer, name='register_customer'),
    path('auth/login/', views.customer_login, name='customer_login'),
]