import os
import django

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'ecommerce2.settings')
django.setup()

from store.models import Product

def populate():
    # Clear existing products
    Product.objects.all().delete()

    products = [
        # Eyeglasses
        {"name": "Vincent Chase Online", "description": "Black Full Rim Rectangle Glasses", "price": 1999.0, "discount_percentage": 50.0, "category": "eyeglasses", "frame_shape": "rectangle", "frame_size": "medium", "frame_color": "black", "brand": "Vincent Chase", "material": "TR90"},
        {"name": "Lenskart Air", "description": "Blue Transparent Full Rim Round Glasses", "price": 2500.0, "discount_percentage": 20.0, "category": "eyeglasses", "frame_shape": "round", "frame_size": "narrow", "frame_color": "blue", "brand": "Lenskart Air", "material": "Ultem"},
        {"name": "John Jacobs", "description": "Gunmetal Half Rim Aviator Glasses", "price": 3500.0, "discount_percentage": 10.0, "category": "eyeglasses", "frame_shape": "aviator", "frame_size": "wide", "frame_color": "gunmetal", "brand": "John Jacobs", "material": "Stainless Steel"},
        {"name": "Lenskart Studio", "description": "Brown Tortoise Full Rim Cat Eye", "price": 2000.0, "category": "eyeglasses", "frame_shape": "cat_eye", "frame_size": "medium", "frame_color": "brown", "brand": "Lenskart Studio", "material": "Acetate"},
        
        # Sunglasses
        {"name": "Vincent Chase Polarized", "description": "Black Full Rim Wayfarer Sunglasses", "price": 1500.0, "discount_percentage": 30.0, "category": "sunglasses", "frame_shape": "wayfarer", "frame_size": "medium", "frame_color": "black", "brand": "Vincent Chase", "material": "Polycarbonate"},
        {"name": "John Jacobs Supreme", "description": "Gold Full Rim Aviator Sunglasses", "price": 4000.0, "category": "sunglasses", "frame_shape": "aviator", "frame_size": "wide", "frame_color": "gold", "brand": "John Jacobs", "material": "Metal"},
        {"name": "Lenskart Air Sun", "description": "Grey Transparent Geometric Sunglasses", "price": 2200.0, "category": "sunglasses", "frame_shape": "geometric", "frame_size": "medium", "frame_color": "grey", "brand": "Lenskart Air", "material": "TR90"},
        
        # Computer Glasses
        {"name": "Blu Zero Power", "description": "Matte Black Full Rim Rectangle", "price": 1000.0, "discount_percentage": 15.0, "category": "computer_glasses", "frame_shape": "rectangle", "frame_size": "medium", "frame_color": "black", "brand": "Lenskart Blu", "material": "TR90"},
        {"name": "Blu Kids", "description": "Blue Round Computer Glasses", "price": 800.0, "category": "computer_glasses", "frame_shape": "round", "frame_size": "narrow", "frame_color": "blue", "brand": "Lenskart Blu", "material": "Plastic"},
        
        # Contact Lenses
        {"name": "Aqualens 24H", "description": "Clear Monthly Disposable Contact Lenses", "price": 600.0, "category": "contact_lenses", "frame_shape": "none", "frame_size": "none", "brand": "Aqualens", "material": "Hydrogel"},
        {"name": "Bausch & Lomb Icon", "description": "Toric Monthly Disposable", "price": 1200.0, "category": "contact_lenses", "frame_shape": "none", "frame_size": "none", "brand": "Bausch & Lomb", "material": "Silicone Hydrogel"},
    ]

    for p in products:
        Product.objects.create(**p)
    
    print(f"Successfully added {len(products)} eyewear products.")

if __name__ == "__main__":
    populate()
