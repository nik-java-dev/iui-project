import cv2

from converter import text_to_handwriting
from PIL import Image
from make_transparent import make_background_transparent


def get_handwritten_text(text):
    text_to_handwriting(text, rgb=[0, 0, 0])
    print("Text is ready")


def change_background(val=1):
    if val == 1:
        background = Image.open(f"backgrounds/back_{val}.png")

    if val == 2:
        background = Image.open(f"backgrounds/back_{val}.png")

    if val == 3:
        background = Image.open(f"backgrounds/back_{val}.png")

    if val == 4:
        background = Image.open(f"backgrounds/back_{val}.png")

    make_background_transparent(cv2.imread("generated.png"))
    foreground = Image.open("transparent.png")
    background.paste(foreground, (0, 0), foreground)
    background.save("generated.png")
