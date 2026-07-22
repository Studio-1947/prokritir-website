from PIL import Image

def find_top_pixel():
    nocap = Image.open("../frontend/public/bottle-nocap-web.png")
    bbox = nocap.getbbox()
    print("Old bottle-nocap bbox:", bbox)
    
    cap = Image.open("../frontend/public/bottle-cap-web.png")
    print("Old bottle-cap bbox:", cap.getbbox())
    
find_top_pixel()
