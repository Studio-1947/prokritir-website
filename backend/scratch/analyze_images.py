from PIL import Image

def analyze(path):
    img = Image.open(path)
    print(f"Path: {path}")
    print(f"Size: {img.size}")
    print(f"Mode: {img.mode}")
    if img.mode == 'RGBA':
        bbox = img.getbbox()
        print(f"Bounding box of non-transparent content: {bbox}")
        if bbox:
            width = bbox[2] - bbox[0]
            height = bbox[3] - bbox[1]
            print(f"Content dimensions: {width} x {height}")
            print(f"Content ratio (W/H): {width / height:.4f}")
    print("-" * 40)

analyze("../frontend/public/prokritir-jol-bottle 2.png")
analyze("../frontend/public/Object.png")
analyze("../frontend/public/bottle-nocap-web.png")
analyze("../frontend/public/bottle-cap-web.png")
