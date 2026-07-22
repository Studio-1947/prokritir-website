import numpy as np
from PIL import Image

def find_cap_in_bottle():
    bottle = Image.open("../frontend/public/prokritir-jol-bottle 2.png").convert("RGBA")
    cap = Image.open("../frontend/public/Object.png").convert("RGBA")
    
    # We will search for cap dimensions in bottle
    b_arr = np.array(bottle)
    c_arr = np.array(cap)
    
    print(f"Bottle array shape: {b_arr.shape}")
    print(f"Cap array shape: {c_arr.shape}")
    
    # Let's crop the top part of the bottle and see if it matches the cap
    # Cap size is 924x424
    # Bounding box of content in bottle starts at (625, 375)
    # Let's check the top-center of the bottle content
    # The bottle content width is 1846, center is at x = 625 + 923 = 1548
    # The cap width is 924, so it should be from x = 1548 - 462 = 1086 to 2010
    # Let's check the region y from 375 to 375 + 424 = 799
    
    crop_x1 = 1086
    crop_x2 = 2010
    crop_y1 = 375
    crop_y2 = 799
    
    bottle_top = b_arr[crop_y1:crop_y2, crop_x1:crop_x2]
    print(f"Bottle top crop shape: {bottle_top.shape}")
    
    # Check similarity (e.g. mean absolute difference)
    # We only check RGB channels
    diff = np.abs(bottle_top[:, :, :3].astype(float) - c_arr[:, :, :3].astype(float))
    mean_diff = np.mean(diff)
    print(f"Mean absolute color difference: {mean_diff:.2f}")

find_cap_in_bottle()
