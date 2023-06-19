from converter import text_to_handwriting


def get_handwritten_text(text):
    text_to_handwriting(text, rgb=[0, 0, 0])
    print("Text is ready")
