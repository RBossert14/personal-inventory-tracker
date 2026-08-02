from PIL import Image
from transformers import pipeline as hf_pipeline

_classifier = None  # lazily loaded on first use, not at import time — CLIP is slow to load


def _get_classifier():
    global _classifier
    if _classifier is None:
        _classifier = hf_pipeline("zero-shot-image-classification", model="openai/clip-vit-base-patch32")
    return _classifier


def classify(image: Image.Image, labels: list[str]) -> list[dict]:
    classifier = _get_classifier()
    return classifier(image, candidate_labels=labels)
