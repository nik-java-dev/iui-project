import cv2
import numpy as np


def make_background_transparent(image):
    image_bgr = image
    h, w, c = image_bgr.shape
    image_bgra = np.concatenate([image_bgr, np.full((h, w, 1), 255, dtype=np.uint8)], axis=-1)
    white = np.all(image_bgr == [255, 255, 255], axis=-1)
    image_bgra[white, -1] = 0
    cv2.imwrite('transparent.png', image_bgra)
    return image_bgra
