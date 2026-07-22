import numpy as np
from PIL import Image

def find_best_match():
    bottle = Image.open("../frontend/public/prokritir-jol-bottle 2.png").convert("RGBA")
    cap = Image.open("../frontend/public/Object.png").convert("RGBA")
    
    # Resize bottle down to speed up matching
    # Let's resize both by a factor of 4
    scale = 4
    b_small = bottle.resize((bottle.width // scale, bottle.height // scale))
    c_small = cap.resize((cap.width // scale, cap.height // scale))
    
    b_arr = np.array(b_small)[:, :, :3].astype(float)
    c_arr = np.array(c_small)[:, :, :3].astype(float)
    
    bh, bw, _ = b_arr.shape
    ch, cw, _ = c_arr.shape
    
    print(f"Searching small bottle {bw}x{bh} for small cap {cw}x{ch}...")
    
    best_diff = float('inf')
    best_pos = (0, 0)
    
    # Sweep upper half of bottle (cap should be near the top)
    for y in range(0, bh // 3):
        for x in range(0, bw - cw):
            crop = b_arr[y:y+ch, x:x+cw]
            diff = np.mean(np.abs(crop - c_arr))
            if diff < best_diff:
                best_diff = diff
                best_pos = (x * scale, y * scale)
                
    print(f"Best match position: {best_pos} with diff: {best_diff:.2f}")

find_best_match()
