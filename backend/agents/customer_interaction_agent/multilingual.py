from typing import Dict, Any

class MultilingualAgent:
    """
    Agent responsible for detecting user language, translating incoming queries to English
    for internal processing, and translating system responses back to the user's native language.
    """
    
    def __init__(self):
        # In production, this would use a fast local model like fasttext for language detection
        # and OpenAI/DeepL for translation. For now, it simulates the capability.
        self.supported_languages = ["en", "es", "fr", "de", "zh", "ja", "hi", "ar"]

    def detect_language(self, text: str) -> str:
        """
        Simulates detecting the language of the incoming text.
        """
        if "gracias" in text.lower() or "hola" in text.lower():
            return "es"
        if "merci" in text.lower() or "bonjour" in text.lower():
            return "fr"
        if "danke" in text.lower():
            return "de"
        # Default to English
        return "en"

    def translate_to_english(self, text: str, source_lang: str) -> str:
        """
        Translates text from source language to English.
        """
        if source_lang == "en":
            return text
            
        # Simulate translation logic
        print(f"[Translation Agent] Translating from {source_lang} to English: {text}")
        return f"[Translated to EN] {text}"

    def translate_from_english(self, text: str, target_lang: str) -> str:
        """
        Translates the system's English response back to the user's native language.
        """
        if target_lang == "en":
            return text
            
        # Simulate translation logic
        translations = {
            "es": {"Refund approved": "Reembolso aprobado", "Hello": "Hola"},
            "fr": {"Refund approved": "Remboursement approuvé", "Hello": "Bonjour"}
        }
        
        simulated_translation = translations.get(target_lang, {}).get(text, f"[Translated to {target_lang}] {text}")
        print(f"[Translation Agent] Translating to {target_lang}: {simulated_translation}")
        return simulated_translation

    def process_incoming(self, text: str) -> Dict[str, Any]:
        """
        End-to-end incoming processing.
        """
        lang = self.detect_language(text)
        english_text = self.translate_to_english(text, lang)
        
        return {
            "original_text": text,
            "detected_language": lang,
            "english_translation": english_text
        }
