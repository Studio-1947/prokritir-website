from PIL import Image

def process_bottle():
    # Load raw bottle image (11.4 MB)
    img = Image.open("../frontend/public/prokritir-jol-bottle 2.png")
    
    # Crop to non-transparent bounding box: (625, 375, 2471, 6267)
    bbox = img.getbbox()
    cropped = img.crop(bbox)
    
    # Calculate new height to match old bottle height (1850px) for layout compatibility
    target_height = 1850
    ratio = cropped.width / cropped.height
    target_width = int(target_height * ratio) # ≈ 580
    
    # Resize using high-quality lanczos filter
    resized = cropped.resize((target_width, target_height), Image.Resampling.LANCZOS)
    
    # Save as optimized web version
    resized.save("../frontend/public/prokritir-jol-bottle-web.png", "PNG", optimize=True)
    print(f"Saved optimized bottle: {target_width} x {target_height}")

def process_cap():
    img = Image.open("../frontend/public/Object.png")
    # Object.png is already 924x424 (no padding). Let's save a web version
    target_width = 620
    ratio = img.width / img.height
    target_height = int(target_width / ratio) # ≈ 285
    
    resized = img.resize((target_width, target_height), Image.Resampling.LANCZOS)
    resized.save("../frontend/public/Object-web.png", "PNG", optimize=True)
    print(f"Saved optimized cap: {target_width} x {target_height}")

process_bottle()
process_cap()
