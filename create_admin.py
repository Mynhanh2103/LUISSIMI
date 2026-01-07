# create_admin.py
import os
import django

# Thiết lập môi trường Django
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'django_admin.settings') # Thay bằng tên folder settings của bạn
django.setup()

from django.contrib.auth import get_user_model

def create_superuser():
    User = get_user_model()
    # Lấy thông tin từ Environment Variables để bảo mật
    username = os.getenv('ADMIN_USERNAME', 'admin_luissimi')
    email = os.getenv('ADMIN_EMAIL', 'admin@example.com')
    password = os.getenv('ADMIN_PASSWORD', 'Luissimi123@')

    if not User.objects.filter(username=username).exists():
        User.objects.create_superuser(username=username, email=email, password=password)
        print(f"✅ Đã tạo tài khoản Superuser: {username}")
    else:
        print(f"ℹ️ Tài khoản {username} đã tồn tại, bỏ qua bước tạo mới.")

if __name__ == "__main__":
    create_superuser()