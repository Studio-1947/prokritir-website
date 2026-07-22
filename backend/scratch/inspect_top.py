from PIL import Image

def inspect():
    bottle = Image.open("../frontend/public/prokritir-jol-bottle-web.png")
    cap = Image.open("../frontend/public/Object-web.png")
    
    print(f"Bottle width={bottle.width}, height={bottle.height}")
    print(f"Cap width={cap.width}, height={cap.height}")
    
    # Check top region of bottle (e.g. top 10%)
    top_region = bottle.crop((0, 0, bottle.width, int(bottle.height * 0.15)))
    # Check if there are non-transparent pixels in top region
    bbox = top_region.getbbox()
    print(f"Bbox of top 15% of bottle: {bbox}")
    
    # Save top region so we can inspect it or verify
    top_region.save("../frontend/public/bottle-top-inspect.png")
    
inspect()
