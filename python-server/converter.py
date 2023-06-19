import string
import numpy as np
from PIL import Image
import cv2
import os

char = string.ascii_lowercase
file_code_name = {}

width = 50
height = 0
newwidth = 0
arr = string.ascii_letters
arr = arr + string.digits + "+,.-? "
letss = string.ascii_letters
# path = 'D:\\PythonProjects\\handwritten-converter\\letters'
path = 'D:\\UBT\\Subjects\\Intelligent User Interfaces\\iui-project\\python-server\\letters'

def getimg(case, col):
    global width, height, back
    img = cv2.imread(os.path.join(path, "%s.png" % case))
    img[np.where((img != [255, 255, 255]).all(axis=2))] = col
    cv2.imwrite(os.path.join(path, "chr.png"), img)
    cases = Image.open(os.path.join(path, "chr.png"))
    back.paste(cases, (width, height))
    newwidth = cases.width
    width = width + newwidth


def text_to_handwriting(string, rgb=[0, 0, 138], save_to: str = "generated.png"):
    """Convert the texts passed into handwritten characters"""
    global arr, width, height, back
    try:
        back = Image.open(os.path.join(path, "zback.png"))
    except:
        print("error")
        raise IOError

    rgb = [rgb[2], rgb[1], rgb[0]]
    count = -1
    lst = string.split()
    for letter in string:
        if width + 150 >= back.width or ord(letter) == 10:
            height = height + 227
            width = 50
        if letter in arr:
            if letter == " ":
                count += 1
                letter = "zspace"
                wrdlen = len(lst[count + 1])
                if wrdlen * 110 >= back.width - width:
                    width = 50
                    height = height + 227

            elif letter.isupper():
                letter = "c" + letter.lower()
            elif letter == ",":
                letter = "coma"
            elif letter == ".":
                letter = "fs"
            elif letter == "?":
                letter = "que"

            getimg(letter, rgb)

    back.save(f"{save_to}")
    back.close()
    back = Image.open(os.path.join(path, "zback.png"))
    width = 50
    height = 0
    return save_to