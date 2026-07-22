from PIL import Image

def find_neck_profile():
    img = Image.open("../frontend/public/prokritir-jol-bottle-web.png")
    width, height = img.size
    
    print(f"Bottle size: {width} x {height}")
    # Inspect width of non-transparent content row by row from y=0 to y=400
    for y in range(0, 300, 10):
        # find left and right bounds of non-transparent pixels (alpha > 0)
        row_alphas = [x for x in range(width) if img.getpixel((x, y))[3] > 0]
        if row_alphas:
            left = min(row_alphas)
            right = max(row_alphas)
            row_width = right - left + 1
            print(f"y={y:03d}: left={left}, right={right}, width={row_width}")
        else:
            print(f"y={y:03d}: empty")

find_neck_profile()
