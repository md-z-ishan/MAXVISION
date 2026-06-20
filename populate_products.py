"""
MAXVISION - Full Product Seeder with unique brand images
"""

import os
import django

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'ecommerce2.settings')
django.setup()

from store.models import Product

def populate():
    Product.objects.all().delete()
    print("Cleared existing products...")

    products = [

        # ===================== EYEGLASSES =====================

        {"name": "Ray-Ban Highstreet RB5228",
         "description": "Black Full Rim Rectangle Eyeglasses. Lightweight acetate frame with spring hinges. Best for daily office wear. UV400 anti-glare coating.",
         "price": 6990.0, "discount_percentage": 30.0, "category": "eyeglasses",
         "frame_shape": "rectangle", "frame_size": "medium", "frame_color": "Black",
         "brand": "Ray-Ban", "material": "Acetate", "stock_quantity": 20,
         "image_url": "https://images.unsplash.com/photo-1574258495973-f010dfbb5371?w=500&h=400&fit=crop&auto=format"},

        {"name": "Ray-Ban Clubmaster RB3016",
         "description": "Tortoise & Gold Half Rim Clubmaster. Premium stainless steel frame with acetate temples. Classic American style.",
         "price": 8990.0, "discount_percentage": 15.0, "category": "eyeglasses",
         "frame_shape": "wayfarer", "frame_size": "medium", "frame_color": "Tortoise",
         "brand": "Ray-Ban", "material": "Stainless Steel", "stock_quantity": 15,
         "image_url": "https://images.unsplash.com/photo-1511499767150-a48a237f0083?w=500&h=400&fit=crop&auto=format"},

        {"name": "Oakley Crosslink RX OX8154",
         "description": "Gunmetal Full Rim Rectangle Glasses. Unobtainium nose pads for all-day comfort. Lightweight O-Matter frame.",
         "price": 12990.0, "discount_percentage": 20.0, "category": "eyeglasses",
         "frame_shape": "rectangle", "frame_size": "wide", "frame_color": "Gunmetal",
         "brand": "Oakley", "material": "O-Matter", "stock_quantity": 10,
         "image_url": "https://images.unsplash.com/photo-1585386959984-a4155224a1ad?w=500&h=400&fit=crop&auto=format"},

        {"name": "Titan Eye+ NXT Round Classic",
         "description": "Matte Brown Full Rim Round Glasses. Ultra-light NXT polymer frame. Elegant circular design for round and heart-shaped faces.",
         "price": 3490.0, "discount_percentage": 25.0, "category": "eyeglasses",
         "frame_shape": "round", "frame_size": "narrow", "frame_color": "Brown",
         "brand": "Titan Eye+", "material": "NXT Polymer", "stock_quantity": 25,
         "image_url": "https://images.unsplash.com/photo-1577803645773-f96470509666?w=500&h=400&fit=crop&auto=format"},

        {"name": "Fastrack NB034BK1 Rectangle",
         "description": "Glossy Black Full Rim Rectangle. Bold trendy design for young professionals. Durable polycarbonate frame.",
         "price": 2290.0, "discount_percentage": 40.0, "category": "eyeglasses",
         "frame_shape": "rectangle", "frame_size": "medium", "frame_color": "Black",
         "brand": "Fastrack", "material": "Polycarbonate", "stock_quantity": 30,
         "image_url": "https://images.unsplash.com/photo-1563013544-824ae1b704d3?w=500&h=400&fit=crop&auto=format"},

        {"name": "Vincent Chase VC E12480 Cat Eye",
         "description": "Pink & Rose Gold Full Rim Cat Eye. Glamorous feminine style with premium TR90 frame. Retro cat-eye silhouette.",
         "price": 1999.0, "discount_percentage": 50.0, "category": "eyeglasses",
         "frame_shape": "cat_eye", "frame_size": "medium", "frame_color": "Pink",
         "brand": "Vincent Chase", "material": "TR90", "stock_quantity": 18,
         "image_url": "https://images.unsplash.com/photo-1583394838336-acd977736f90?w=500&h=400&fit=crop&auto=format"},

        {"name": "John Jacobs JJ E16200 Aviator",
         "description": "Silver & Blue Full Rim Aviator. Classic pilot-inspired design with spring-loaded temples. Premium stainless steel.",
         "price": 4490.0, "discount_percentage": 10.0, "category": "eyeglasses",
         "frame_shape": "aviator", "frame_size": "wide", "frame_color": "Silver",
         "brand": "John Jacobs", "material": "Stainless Steel", "stock_quantity": 12,
         "image_url": "https://images.unsplash.com/photo-1508296695146-257a814070b4?w=500&h=400&fit=crop&auto=format"},

        {"name": "Lenskart Air LA E15321 Slim",
         "description": "Transparent Blue Full Rim Rectangle. Feather-light Ultem frame at just 4 grams. Crystal clear transparent design.",
         "price": 2500.0, "discount_percentage": 20.0, "category": "eyeglasses",
         "frame_shape": "rectangle", "frame_size": "narrow", "frame_color": "Blue",
         "brand": "Lenskart Air", "material": "Ultem", "stock_quantity": 22,
         "image_url": "https://images.unsplash.com/photo-1604697964648-9f4aa1adc2cb?w=500&h=400&fit=crop&auto=format"},

        {"name": "Vision Plus VP3021 Geometric",
         "description": "Gunmetal & Black Full Rim Geometric. Trendy hexagonal design with premium alloy construction.",
         "price": 1799.0, "discount_percentage": 35.0, "category": "eyeglasses",
         "frame_shape": "geometric", "frame_size": "medium", "frame_color": "Gunmetal",
         "brand": "Vision Plus", "material": "Metal Alloy", "stock_quantity": 16,
         "image_url": "https://images.unsplash.com/photo-1485053329638-4e9f0ba3de14?w=500&h=400&fit=crop&auto=format"},

        {"name": "Ranchi Frames RF Classic Oval",
         "description": "Matte Black Full Rim Oval. Local Ranchi brand premium quality. Handcrafted with Italian acetate.",
         "price": 1299.0, "discount_percentage": 45.0, "category": "eyeglasses",
         "frame_shape": "round", "frame_size": "medium", "frame_color": "Black",
         "brand": "Ranchi Frames", "material": "Acetate", "stock_quantity": 35,
         "image_url": "https://images.unsplash.com/photo-1512095507099-b8fe50b3acb8?w=500&h=400&fit=crop&auto=format"},

        # ===================== SUNGLASSES =====================

        {"name": "Ray-Ban Wayfarer RB2132",
         "description": "Classic Black Full Rim Wayfarer Sunglasses. 100% UV protection with G-15 polarized lenses. Iconic American design since 1952.",
         "price": 9990.0, "discount_percentage": 15.0, "category": "sunglasses",
         "frame_shape": "wayfarer", "frame_size": "medium", "frame_color": "Black",
         "brand": "Ray-Ban", "material": "Acetate", "stock_quantity": 20,
         "image_url": "https://images.unsplash.com/photo-1473496169904-658ba7574b0d?w=500&h=400&fit=crop&auto=format"},

        {"name": "Ray-Ban Aviator Classic RB3025",
         "description": "Gold & Green Full Rim Aviator Sunglasses. The world's most iconic sunglasses. Crystal lenses with 100% UV protection.",
         "price": 11990.0, "discount_percentage": 10.0, "category": "sunglasses",
         "frame_shape": "aviator", "frame_size": "wide", "frame_color": "Gold",
         "brand": "Ray-Ban", "material": "Metal", "stock_quantity": 15,
         "image_url": "https://images.unsplash.com/photo-1502920917128-1aa500764cbd?w=500&h=400&fit=crop&auto=format"},

        {"name": "Oakley Holbrook OO9102",
         "description": "Matte Black Full Rim Wayfarer Sunglasses. Plutonite lens material blocks 100% UV. Stress-resistant O-Matter frame.",
         "price": 15490.0, "discount_percentage": 20.0, "category": "sunglasses",
         "frame_shape": "wayfarer", "frame_size": "wide", "frame_color": "Black",
         "brand": "Oakley", "material": "O-Matter", "stock_quantity": 8,
         "image_url": "https://images.unsplash.com/photo-1556306535-0f09a537f0a3?w=500&h=400&fit=crop&auto=format"},

        {"name": "Fastrack NBP109BK1 Sporty",
         "description": "Matte Black Half Rim Sport Sunglasses. Lightweight TR90 frame with rubberized grip. Perfect for outdoor activities.",
         "price": 1495.0, "discount_percentage": 30.0, "category": "sunglasses",
         "frame_shape": "geometric", "frame_size": "wide", "frame_color": "Black",
         "brand": "Fastrack", "material": "TR90", "stock_quantity": 25,
         "image_url": "https://images.unsplash.com/photo-1572635196237-14b3f281503f?w=500&h=400&fit=crop&auto=format"},

        {"name": "Vincent Chase Polarized VC-S14227",
         "description": "Brown Tortoise Full Rim Cat Eye Sunglasses. Premium polarized lenses for zero glare. Retro-inspired glamorous cat-eye silhouette.",
         "price": 1699.0, "discount_percentage": 40.0, "category": "sunglasses",
         "frame_shape": "cat_eye", "frame_size": "medium", "frame_color": "Tortoise",
         "brand": "Vincent Chase", "material": "Acetate", "stock_quantity": 18,
         "image_url": "https://images.unsplash.com/photo-1577744486770-020ab432438a?w=500&h=400&fit=crop&auto=format"},

        {"name": "Titan Eye+ Dash UV400 Aviator",
         "description": "Gunmetal & Blue Full Rim Aviator. Premium metal frame with 100% UV400 protection. Tinted blue gradient lenses.",
         "price": 3990.0, "discount_percentage": 25.0, "category": "sunglasses",
         "frame_shape": "aviator", "frame_size": "wide", "frame_color": "Gunmetal",
         "brand": "Titan Eye+", "material": "Metal", "stock_quantity": 12,
         "image_url": "https://images.unsplash.com/photo-1522478706765-f001a9ad7e8b?w=500&h=400&fit=crop&auto=format"},

        {"name": "Asif Collections AC Round Retro",
         "description": "Gold & Brown Full Rim Round Sunglasses. Handpicked exclusive design. Premium acetate with gradient brown lenses. Retro 70s inspired.",
         "price": 999.0, "discount_percentage": 50.0, "category": "sunglasses",
         "frame_shape": "round", "frame_size": "narrow", "frame_color": "Gold",
         "brand": "Asif Collections", "material": "Acetate", "stock_quantity": 30,
         "image_url": "https://images.unsplash.com/photo-1529159696229-09e95dbd36d7?w=500&h=400&fit=crop&auto=format"},

        # ===================== COMPUTER GLASSES (Special Power) =====================

        {"name": "Lenskart Blu Zero Power LB E13380",
         "description": "Matte Black Full Rim Rectangle Computer Glasses. Blue light blocking for digital eye strain relief. Feather-light TR90 frame.",
         "price": 1500.0, "discount_percentage": 20.0, "category": "computer_glasses",
         "frame_shape": "rectangle", "frame_size": "medium", "frame_color": "Black",
         "brand": "Lenskart Blu", "material": "TR90", "stock_quantity": 30,
         "image_url": "https://images.unsplash.com/photo-1591076482161-42ce6da69f67?w=500&h=400&fit=crop&auto=format"},

        {"name": "John Jacobs Blu Screen JJ E16540",
         "description": "Navy Blue Full Rim Rectangle. Premium Japanese blue-cut coating. Reduces 99% of harmful blue light. Anti-glare + UV combo.",
         "price": 3490.0, "discount_percentage": 15.0, "category": "computer_glasses",
         "frame_shape": "rectangle", "frame_size": "medium", "frame_color": "Navy Blue",
         "brand": "John Jacobs", "material": "Acetate", "stock_quantity": 18,
         "image_url": "https://images.unsplash.com/photo-1587091813089-8b8f8f71e01d?w=500&h=400&fit=crop&auto=format"},

        {"name": "Vincent Chase Blu Slim VC E12300",
         "description": "Transparent Pink Full Rim Rectangle Blue Light Glasses. Ultra-slim 3g TR90 frame. Effective blue-cut lenses for working women.",
         "price": 1299.0, "discount_percentage": 35.0, "category": "computer_glasses",
         "frame_shape": "rectangle", "frame_size": "narrow", "frame_color": "Pink",
         "brand": "Vincent Chase", "material": "TR90", "stock_quantity": 22,
         "image_url": "https://images.unsplash.com/photo-1612198188060-c7c2a3b66eae?w=500&h=400&fit=crop&auto=format"},

        # ===================== CONTACT LENSES =====================

        {"name": "Aqualens 24H Daily Disposable",
         "description": "Clear daily disposable contact lenses. High oxygen permeability for all-day comfort. UV blocking. 30 lens pack.",
         "price": 499.0, "discount_percentage": 10.0, "category": "contact_lenses",
         "frame_shape": "none", "frame_size": "none", "frame_color": "",
         "brand": "Aqualens", "material": "Hydrogel", "stock_quantity": 50,
         "image_url": "https://images.unsplash.com/photo-1587854692152-cbe660dbde88?w=500&h=400&fit=crop&auto=format"},

        {"name": "Bausch & Lomb Ultra Monthly",
         "description": "MoistureSeal Technology for 16 hours of moisture. Monthly disposable silicone hydrogel. Range -0.5 to -12.0.",
         "price": 1499.0, "discount_percentage": 15.0, "category": "contact_lenses",
         "frame_shape": "none", "frame_size": "none", "frame_color": "",
         "brand": "Bausch & Lomb", "material": "Silicone Hydrogel", "stock_quantity": 40,
         "image_url": "https://images.unsplash.com/photo-1582750433449-648ed127bb54?w=500&h=400&fit=crop&auto=format"},

        {"name": "Acuvue Oasys 1-Day HydraLuxe",
         "description": "Premium daily disposable with HydraLuxe Technology. UV blocking class 1. Best for active lifestyle.",
         "price": 2290.0, "discount_percentage": 5.0, "category": "contact_lenses",
         "frame_shape": "none", "frame_size": "none", "frame_color": "",
         "brand": "Acuvue", "material": "Senofilcon A", "stock_quantity": 35,
         "image_url": "https://images.unsplash.com/photo-1584036553516-bf83210aa16c?w=500&h=400&fit=crop&auto=format"},

        {"name": "FreshLook Colorblends Monthly",
         "description": "Colored contact lenses in 12 vibrant shades. Brilliant Blue, Amethyst, Green, Hazel. Monthly disposable.",
         "price": 899.0, "discount_percentage": 20.0, "category": "contact_lenses",
         "frame_shape": "none", "frame_size": "none", "frame_color": "Blue",
         "brand": "FreshLook", "material": "Phemfilcon A", "stock_quantity": 45,
         "image_url": "https://images.unsplash.com/photo-1607461238940-e0e3d2a60c52?w=500&h=400&fit=crop&auto=format"},
    ]

    for p in products:
        Product.objects.create(**p)
    
    print(f"✅ Successfully added {len(products)} products with images!")
    from django.db.models import Count
    for cat in Product.objects.values('category').annotate(count=Count('category')):
        print(f"  - {cat['category']}: {cat['count']} products")

if __name__ == "__main__":
    populate()
