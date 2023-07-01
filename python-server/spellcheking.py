from spellchecker import SpellChecker
import re


def flatten(l):
    flat_list = []
    for sublist in l:
        flat_list.append(sublist)

    return flat_list


def check_spelling(list_of_words):
    spell = SpellChecker()
    suggestions = []

    for val in list_of_words:
        val = val.lower()
        try:
            suggestion = list((spell.candidates(re.sub(r'[^A-Za-z0-9]+', '', val))))[0:4]
            suggestions.append(flatten(suggestion))
        except Exception as err:
            suggestions.append([val])

    return suggestions
