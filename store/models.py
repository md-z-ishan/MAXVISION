from django.db import models
from django.contrib.auth.models import User

class Product(models.Model):
    CATEGORY_CHOICES = [
        ('eyeglasses', 'Eyeglasses'),
        ('sunglasses', 'Sunglasses'),
        ('computer_glasses', 'Computer Glasses'),
        ('contact_lenses', 'Contact Lenses'),
    ]

    SHAPE_CHOICES = [
        ('rectangle', 'Rectangle'),
        ('round', 'Round'),
        ('wayfarer', 'Wayfarer'),
        ('aviator', 'Aviator'),
        ('cat_eye', 'Cat Eye'),
        ('geometric', 'Geometric'),
        ('none', 'None'), # For contacts
    ]

    SIZE_CHOICES = [
        ('narrow', 'Narrow'),
        ('medium', 'Medium'),
        ('wide', 'Wide'),
        ('extra_wide', 'Extra Wide'),
        ('none', 'None'),
    ]

    name = models.CharField(max_length=200)
    description = models.TextField()
    price = models.FloatField()
    discount_percentage = models.FloatField(default=0.0)
    stock_quantity = models.PositiveIntegerField(default=10)
    category = models.CharField(max_length=20, choices=CATEGORY_CHOICES, default='eyeglasses')
    
    # Eyewear specific attributes
    frame_shape = models.CharField(max_length=20, choices=SHAPE_CHOICES, default='rectangle')
    frame_size = models.CharField(max_length=20, choices=SIZE_CHOICES, default='medium')
    frame_color = models.CharField(max_length=50, blank=True, null=True)
    brand = models.CharField(max_length=100, blank=True, null=True)
    material = models.CharField(max_length=50, blank=True, null=True)

    image = models.ImageField(upload_to='products/', null=True, blank=True)
    image_url = models.URLField(max_length=500, null=True, blank=True)
    
    @property
    def discounted_price(self):
        return self.price * (1 - self.discount_percentage / 100)

    def __str__(self):
        return f"{self.name} - {self.brand} ({self.category})"


class Prescription(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='prescriptions')
    name = models.CharField(max_length=100, default="My Prescription")
    
    # Right Eye (OD)
    od_sph = models.FloatField(default=0.0)
    od_cyl = models.FloatField(default=0.0)
    od_axis = models.IntegerField(default=0)
    od_add = models.FloatField(default=0.0)
    
    # Left Eye (OS)
    os_sph = models.FloatField(default=0.0)
    os_cyl = models.FloatField(default=0.0)
    os_axis = models.IntegerField(default=0)
    os_add = models.FloatField(default=0.0)
    
    # Pupillary Distance
    pd = models.FloatField(null=True, blank=True)
    
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.user.username} - {self.name}"


class UserProfile(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name='profile')
    mobile = models.CharField(max_length=15, unique=True, null=True, blank=True)
    age = models.PositiveIntegerField(null=True, blank=True)
    gender = models.CharField(max_length=10, choices=[('Male', 'Male'), ('Female', 'Female'), ('Other', 'Other')], null=True, blank=True)
    
    def __str__(self):
        return self.user.username


class Cart(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    product = models.ForeignKey(Product, on_delete=models.CASCADE)
    quantity = models.PositiveIntegerField(default=1)
    
    # Optional Lens Details
    LENS_PACKAGE_CHOICES = [
        ('frame_only', 'Frame Only'),
        ('single_vision', 'Single Vision'),
        ('bifocal', 'Bifocal / Progressive'),
        ('zero_power', 'Zero Power (Computer)'),
    ]
    lens_package = models.CharField(max_length=20, choices=LENS_PACKAGE_CHOICES, default='frame_only')
    lens_price = models.FloatField(default=0.0)
    prescription = models.ForeignKey(Prescription, on_delete=models.SET_NULL, null=True, blank=True)

    def subtotal(self):
        return (self.product.discounted_price + self.lens_price) * self.quantity

    def __str__(self):
        return f"{self.user.username} - {self.product.name} ({self.lens_package})"


class Wishlist(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    product = models.ForeignKey(Product, on_delete=models.CASCADE)

    class Meta:
        unique_together = ('user', 'product')

    def __str__(self):
        return f"{self.user.username} - {self.product.name}"


class Order(models.Model):
    STATUS_CHOICES = [
        ('Pending', 'Pending'),
        ('Accepted', 'Accepted'),
        ('Processing', 'Processing Lenses'),
        ('Shipped', 'Shipped'),
        ('Delivered', 'Delivered'),
        ('Cancelled', 'Cancelled'),
    ]

    user = models.ForeignKey(User, on_delete=models.CASCADE)
    address = models.TextField()
    mobile = models.CharField(max_length=15)
    total_amount = models.DecimalField(max_digits=10, decimal_places=2)
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='Pending')
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"Order #{self.id} - {self.user.username}"
    

class OrderItem(models.Model):
    order = models.ForeignKey(Order, on_delete=models.CASCADE, related_name='items')
    product = models.ForeignKey('Product', on_delete=models.CASCADE)
    quantity = models.PositiveIntegerField()
    price = models.FloatField()
    
    # Snapshot of lens details
    lens_package = models.CharField(max_length=50, blank=True, null=True)
    lens_price = models.FloatField(default=0.0)
    prescription_details = models.TextField(blank=True, null=True) # Storing stringified prescription to avoid relation loss if prescription is deleted

    def subtotal(self):
        return self.quantity * (self.price + self.lens_price)


class Invoice(models.Model):
    order = models.OneToOneField(Order, on_delete=models.CASCADE, related_name='invoice')
    serial_number = models.CharField(max_length=50, unique=True)
    pdf = models.FileField(upload_to='invoices/')
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"Invoice {self.serial_number} for Order #{self.order.id}"