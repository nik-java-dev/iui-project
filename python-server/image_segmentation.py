import cv2
import numpy as np

def thresholding(image):
    img_gray = cv2.cvtColor(image,cv2.COLOR_BGR2GRAY)
    ret,thresh = cv2.threshold(img_gray,80,255,cv2.THRESH_BINARY_INV)
    return thresh


def turn_word_image_in_black_and_white(words_list, img):
  words_rgb_baw = []

  for i in range(0, len(words_list)):
    word = words_list[i]
    roi = img[word[1]:word[3], word[0]:word[2]]

    grayImage = cv2.cvtColor(roi, cv2.COLOR_BGR2GRAY)
    (thresh, blackAndWhiteImage) = cv2.threshold(grayImage, 230, 245, cv2.THRESH_BINARY + cv2.THRESH_OTSU)
    RGB_img = cv2.cvtColor(blackAndWhiteImage, cv2.COLOR_BGR2RGB)
    words_rgb_baw.append(RGB_img)
  return words_rgb_baw


def extract_words_from_image(image_as_pil):
    img = np.array(image_as_pil)
    # Convert RGB to BGR
    img = img[:, :, ::-1].copy()
    img = cv2.cvtColor(img, cv2.COLOR_BGR2RGB)

    h, w, c = img.shape

    if w > 1000:
        new_w = 1000
        ar = w / h
        new_h = int(new_w / ar)

        img = cv2.resize(img, (new_w, new_h), interpolation=cv2.INTER_AREA)
    thresh_img = thresholding(img);
    # dilation
    kernel = np.ones((3, 85), np.uint8)
    dilated = cv2.dilate(thresh_img, kernel, iterations=1)
    (contours, heirarchy) = cv2.findContours(dilated.copy(), cv2.RETR_EXTERNAL, cv2.CHAIN_APPROX_NONE)
    sorted_contours_lines = sorted(contours, key=lambda ctr: cv2.boundingRect(ctr)[1])  # (x, y, w, h)
    img2 = img.copy()

    for ctr in sorted_contours_lines:
        x, y, w, h = cv2.boundingRect(ctr)
        cv2.rectangle(img2, (x, y), (x + w, y + h), (40, 100, 250), 2)
    # dilation
    kernel = np.ones((3, 15), np.uint8)
    dilated2 = cv2.dilate(thresh_img, kernel, iterations=1)
    img3 = img.copy()
    words_list = []

    for line in sorted_contours_lines:

        # roi of each line
        x, y, w, h = cv2.boundingRect(line)
        roi_line = dilated2[y:y + h, x:x + w]

        # draw contours on each word
        (cnt, heirarchy) = cv2.findContours(roi_line.copy(), cv2.RETR_EXTERNAL, cv2.CHAIN_APPROX_NONE)
        sorted_contour_words = sorted(cnt, key=lambda cntr: cv2.boundingRect(cntr)[0])

        for word in sorted_contour_words:

            if cv2.contourArea(word) < 400:
                continue

            x2, y2, w2, h2 = cv2.boundingRect(word)
            words_list.append([x + x2, y + y2, x + x2 + w2, y + y2 + h2])
            cv2.rectangle(img3, (x + x2, y + y2), (x + x2 + w2, y + y2 + h2), (255, 255, 100), 2)
    cv2.imwrite('segmented_image.png', img3)

    return turn_word_image_in_black_and_white(words_list, img), img.shape[0], img.shape[1], words_list
