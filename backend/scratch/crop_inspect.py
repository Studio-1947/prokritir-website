from PIL import Image
import numpy as np

def crop_and_compare():
    bottle = Image.open("../frontend/public/prokritir-jol-bottle 2.png").convert("RGBA")
    cap = Image.open("../frontend/public/Object.png").convert("RGBA")
    
    # Cap size is 924x424
    # Bottle content bounding box is: (625, 375, 2471, 6267)
    # Content width = 1846, height = 5892
    # Content center is at x = 625 + (1846 / 2) = 1548
    # The cap should be centered. Width = 924, so x goes from 1548 - 462 = 1086 to 2010
    # Let's crop y from 375 to 375 + 424 = 799
    
    crop_x1 = 1086
    crop_x2 = 2010
    crop_y1 = 375
    crop_y2 = 799
    
    top_crop = bottle.crop((crop_x1, crop_y1, crop_x2, crop_y2))
    top_crop.save("../frontend/public/bottle-top-crop.png")
    
    # Calculate average color of non-transparent pixels in both
    cap_arr = np.array(cap)
    top_arr = np.array(top_crop)
    
    cap_alpha = cap_arr[:, :, 3] > 0
    top_alpha = top_arr[:, :, 3] > 0
    
    print(f"Cap non-transparent pixels: {np.sum(cap_alpha)}")
    print(f"Top crop non-transparent pixels: {np.sum(top_alpha)}")
    
    if np.sum(cap_alpha) > 0:
        print(f"Cap average RGB: {np.mean(cap_arr[cap_alpha, :3], axis=0)}")
    if np.sum(top_alpha) > 0:
        print(f"Top crop average RGB: {np.mean(top_arr[top_alpha, :3], axis=0)}")

crop_and_compare()
