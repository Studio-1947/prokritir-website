from PIL import Image

def count_alpha_pixels(path):
    img = Image.open(path)
    print(f"File: {path}")
    width, height = img.size
    rows_to_check = 300
    for y in range(0, rows_to_check, 20):
        non_transparent = sum(1 for x in range(width) if img.getpixel((x, y))[3] > 0)
        print(f"Row y={y:03d}: {non_transparent} non-transparent pixels")
    print("-" * 40)

count_alpha_pixels("../frontend/public/bottle-nocap-web.png")
count_alpha_pixels("../frontend/public/prokritir-jol-bottle-web.png")
count_alpha_pixels("../frontend/public/Object-web.png")
