from django.urls import path
from .import views
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView

urlpatterns=[
    path('', views.api_root, name='api_root'),
    path('products/',views.getProducts,name='getProducts'),
    path('categories/',views.Categories,name='categories'),
    path('products/<int:pk>/', views.getProduct, name='product_detail'),
    path('cart/', views.cart_view, name='cart'),
    path('cart/add/<int:product_id>/', views.add_to_cart, name='add_to_cart'),
    path('cart/remove/<int:product_id>/', views.remove_from_cart, name='remove_from_cart'),
    path('cart/update/<int:product_id>/',views.update_cart,name='update_cart'),
    path('order/create/', views.create_order, name='create_order'),
    
    # Auth endpoints
    path('register/', views.register_user, name='register'),
    path('login/', views.MyTokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    
    path('setup-admin/', views.create_superuser_view, name='setup_admin'),
    path('password-reset/', views.password_reset_request, name='password_reset_request'),
    path('password-reset-confirm/', views.password_reset_confirm, name='password_reset_confirm'),
]
