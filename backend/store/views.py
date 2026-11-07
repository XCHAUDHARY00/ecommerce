from django.http import JsonResponse
from rest_framework.decorators import api_view
from rest_framework.response import Response
# pyrefly: ignore [missing-import]
from .models import Product, Category, UserProfile, Order, OrderItem, Cart, CartItem

# pyrefly: ignore [missing-import]
from .serializers import ProductSerializer, CategorySerializer, CartItemSerializer, CartSerializer
from django.core.mail import EmailMultiAlternatives
from django.template.loader import render_to_string
from django.utils.html import strip_tags
from django.conf import settings
from django.contrib.auth.tokens import default_token_generator
from django.utils.http import urlsafe_base64_encode, urlsafe_base64_decode
from django.utils.encoding import force_bytes, force_str
import threading
import os

def send_email_async(subject, html_content, to_email):
    def send():
        try:
            text_content = strip_tags(html_content)
            msg = EmailMultiAlternatives(subject, text_content, settings.DEFAULT_FROM_EMAIL, [to_email])
            msg.attach_alternative(html_content, "text/html")
            msg.send()
        except Exception as e:
            print(f"Error sending email: {e}")
    threading.Thread(target=send).start()

def get_cart(request):
    """Get or create cart. Authenticated users get their own cart.
    Anonymous users get a session-based cart to avoid shared cart bug."""
    if request.user.is_authenticated:
        cart, _ = Cart.objects.get_or_create(user=request.user)
    else:
        # Session-based cart for anonymous users
        if not request.session.session_key:
            request.session.create()
        session_key = request.session.session_key
        cart_id = request.session.get('cart_id')
        if cart_id:
            try:
                cart = Cart.objects.get(id=cart_id, user=None)
            except Cart.DoesNotExist:
                cart = Cart.objects.create(user=None)
                request.session['cart_id'] = cart.id
        else:
            cart = Cart.objects.create(user=None)
            request.session['cart_id'] = cart.id
    return cart

from django.db.models import Q
from rest_framework.pagination import PageNumberPagination

class ProductPagination(PageNumberPagination):
    page_size = 20
    page_size_query_param = 'page_size'
    max_page_size = 100

@api_view(['GET'])
def getProducts(request):
    query = request.GET.get('search', '')
    category = request.GET.get('category', '')
    
    products = Product.objects.all()
    
    if query:
        products = products.filter(
            Q(name__icontains=query) | Q(description__icontains=query)
        )
    if category:
        products = products.filter(category__name__iexact=category)
    
    # Paginate if 'page' param is provided, otherwise return all (backward compatible)
    page = request.GET.get('page')
    if page:
        paginator = ProductPagination()
        paginated = paginator.paginate_queryset(products, request)
        serializer = ProductSerializer(paginated, many=True, context={'request': request})
        return paginator.get_paginated_response(serializer.data)
    
    serializer = ProductSerializer(products, many=True, context={'request': request})
    return JsonResponse(serializer.data, safe=False)

@api_view(['GET'])
def Categories(request):
    categories = Category.objects.all()
    serializer = CategorySerializer(categories, many=True, context={'request': request})
    return JsonResponse(serializer.data, safe=False)

@api_view(['GET'])
def getProduct(request, pk):
    try:
        product = Product.objects.get(pk=pk)
        serializer = ProductSerializer(product, context={'request': request})
        return JsonResponse(serializer.data)
    except Product.DoesNotExist:
        return JsonResponse({'error': 'Product not found'}, status=404)
    except Exception as e:
        return JsonResponse({'error': str(e)}, status=500)

@api_view(['GET'])
def cart_view(request):
    cart = get_cart(request)
    cart_items = CartItem.objects.filter(cart=cart)
    serializer = CartItemSerializer(cart_items, many=True, context={'request': request})
    return JsonResponse(serializer.data, safe=False)

@api_view(['POST'])
def add_to_cart(request, product_id):
    try:
        product = Product.objects.get(pk=product_id)
    except Product.DoesNotExist:
        return JsonResponse({'error': 'Product not found'}, status=404)
        
    cart = get_cart(request)
    cart_item, item_created = CartItem.objects.get_or_create(cart=cart, product=product)
    if not item_created:
        cart_item.quantity += 1
        cart_item.save()
    serializer = CartItemSerializer(cart_item, context={'request': request})
    return JsonResponse(serializer.data)

@api_view(['POST'])
def remove_from_cart(request, product_id):
    try:
        product = Product.objects.get(pk=product_id)
        cart = get_cart(request)
        cart_item = CartItem.objects.get(cart=cart, product=product)
        cart_item.delete()
        return JsonResponse({'message': 'Item removed from cart'})
    except (Product.DoesNotExist, CartItem.DoesNotExist):
        return JsonResponse({'error': 'Item not found'}, status=404)

@api_view(['POST'])
def update_cart(request, product_id):
    try:
        product = Product.objects.get(pk=product_id)
        cart = get_cart(request)
        cart_item = CartItem.objects.get(cart=cart, product=product)
    except (Product.DoesNotExist, CartItem.DoesNotExist):
        return JsonResponse({'error': 'Item not found'}, status=404)

    quantity = request.data.get('quantity', 0)
    if quantity == 0:
        cart_item.delete()
        return JsonResponse({'message': 'Item removed from cart'})

    cart_item.quantity = quantity
    cart_item.save()
    serializer = CartItemSerializer(cart_item, context={'request': request})
    return JsonResponse(serializer.data)

@api_view(['POST'])
def create_order(request):
    cart = get_cart(request)
    cart_items = cart.items.all()
    
    if not cart_items.exists():
        return JsonResponse({'error': 'Cart is empty'}, status=400)
        
    data = request.data
    total_amount = sum(item.subtotal for item in cart_items)
    
    # Create the order
    order = Order.objects.create(
        user=request.user if request.user.is_authenticated else None,
        full_name=data.get('full_name'),
        address=data.get('address'),
        city=data.get('city'),
        postal_code=data.get('postal_code'),
        phone_number=data.get('phone_number'),
        payment_method=data.get('payment_method', 'Cash on Delivery'),
        total_amount=total_amount
    )
    
    # Create order items
    for item in cart_items:
        OrderItem.objects.create(
            order=order,
            product=item.product,
            quantity=item.quantity,
            price=item.product.price
        )
        
    # Clear the cart
    cart_items.delete()
    
    return JsonResponse({
        'message': 'Order created successfully',
        'order_id': order.id
    })

from .serializers import RegisterSerializer, MyTokenObtainPairSerializer
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework_simplejwt.views import TokenObtainPairView
from django.contrib.auth.models import User

class MyTokenObtainPairView(TokenObtainPairView):
    serializer_class = MyTokenObtainPairSerializer

@api_view(['POST'])
def register_user(request):
    serializer = RegisterSerializer(data=request.data)
    if serializer.is_valid():
        user = serializer.save()
        refresh = RefreshToken.for_user(user)
        refresh['username'] = user.username # Add custom claim
        
        # Send Welcome Email
        try:
            frontend_url = os.environ.get('FRONTEND_URL', 'http://localhost:5173')
            if frontend_url.endswith('/'):
                frontend_url = frontend_url[:-1]
            html_content = render_to_string('emails/welcome.html', {
                'user': user,
                'frontend_url': frontend_url
            })
            send_email_async("Welcome to IndeStack!", html_content, user.email)
        except Exception as e:
            print(f"Welcome email error: {e}")

        return Response({
            'refresh': str(refresh),
            'access': str(refresh.access_token),
            'message': 'User registered successfully',
            'user': {
                'id': user.id,
                'username': user.username,
                'email': user.email
            }
        })
    return Response(serializer.errors, status=400)

from rest_framework.permissions import IsAdminUser
from rest_framework.decorators import permission_classes

@api_view(['POST'])
@permission_classes([IsAdminUser])
def create_superuser_view(request):
    import os
    username = os.environ.get('DJANGO_SUPERUSER_USERNAME', 'admin')
    password = os.environ.get('DJANGO_SUPERUSER_PASSWORD', 'admin123')
    email = os.environ.get('DJANGO_SUPERUSER_EMAIL', 'admin@example.com')
    
    if User.objects.filter(username=username).exists():
        return Response({"message": f"Superuser {username} already exists!"})
    
    try:
        User.objects.create_superuser(username, email, password)
        return Response({"message": f"Superuser {username} created successfully!"})
    except Exception as e:
        return Response({"error": str(e)}, status=500)

@api_view(['POST'])
def password_reset_request(request):
    email = request.data.get('email')
    if not email:
        return Response({'error': 'Email is required'}, status=400)
    
    try:
        user = User.objects.get(email=email)
        token = default_token_generator.make_token(user)
        uid = urlsafe_base64_encode(force_bytes(user.pk))
        
        frontend_url = os.environ.get('FRONTEND_URL', 'http://localhost:5173')
        if frontend_url.endswith('/'):
            frontend_url = frontend_url[:-1]
            
        reset_link = f"{frontend_url}/reset-password?uid={uid}&token={token}"
        
        html_content = render_to_string('emails/password_reset.html', {
            'user': user,
            'reset_link': reset_link
        })
        send_email_async("Reset your IndeStack password", html_content, user.email)
        
        return Response({'message': 'Password reset link sent to your email.'})
    except User.DoesNotExist:
        # Don't reveal if user exists or not for security
        return Response({'message': 'If an account exists with this email, a reset link has been sent.'})

@api_view(['POST'])
def password_reset_confirm(request):
    uidb64 = request.data.get('uid')
    token = request.data.get('token')
    new_password = request.data.get('password')
    
    if not all([uidb64, token, new_password]):
        return Response({'error': 'Missing required fields'}, status=400)
        
    try:
        uid = force_str(urlsafe_base64_decode(uidb64))
        user = User.objects.get(pk=uid)
        
        if default_token_generator.check_token(user, token):
            user.set_password(new_password)
            user.save()
            return Response({'message': 'Password has been reset successfully.'})
        else:
            return Response({'error': 'Invalid or expired reset link.'}, status=400)
    except (TypeError, ValueError, OverflowError, User.DoesNotExist):
        return Response({'error': 'Invalid reset link.'}, status=400)