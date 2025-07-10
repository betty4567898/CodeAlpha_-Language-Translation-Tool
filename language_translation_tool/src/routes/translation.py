from flask import Blueprint, request, jsonify
from googletrans import Translator
import logging

translation_bp = Blueprint('translation', __name__)
translator = Translator()

# Language codes mapping for better user experience
LANGUAGES = {
    'en': 'English',
    'es': 'Spanish',
    'fr': 'French',
    'de': 'German',
    'it': 'Italian',
    'pt': 'Portuguese',
    'ru': 'Russian',
    'ja': 'Japanese',
    'ko': 'Korean',
    'zh': 'Chinese',
    'ar': 'Arabic',
    'hi': 'Hindi',
    'tr': 'Turkish',
    'nl': 'Dutch',
    'sv': 'Swedish',
    'da': 'Danish',
    'no': 'Norwegian',
    'fi': 'Finnish',
    'pl': 'Polish',
    'cs': 'Czech',
    'hu': 'Hungarian',
    'ro': 'Romanian',
    'bg': 'Bulgarian',
    'hr': 'Croatian',
    'sk': 'Slovak',
    'sl': 'Slovenian',
    'et': 'Estonian',
    'lv': 'Latvian',
    'lt': 'Lithuanian',
    'mt': 'Maltese',
    'el': 'Greek',
    'cy': 'Welsh',
    'ga': 'Irish',
    'is': 'Icelandic',
    'mk': 'Macedonian',
    'sq': 'Albanian',
    'sr': 'Serbian',
    'bs': 'Bosnian',
    'me': 'Montenegrin',
    'uk': 'Ukrainian',
    'be': 'Belarusian',
    'kk': 'Kazakh',
    'ky': 'Kyrgyz',
    'uz': 'Uzbek',
    'tg': 'Tajik',
    'mn': 'Mongolian',
    'ka': 'Georgian',
    'hy': 'Armenian',
    'az': 'Azerbaijani',
    'he': 'Hebrew',
    'fa': 'Persian',
    'ur': 'Urdu',
    'bn': 'Bengali',
    'ta': 'Tamil',
    'te': 'Telugu',
    'ml': 'Malayalam',
    'kn': 'Kannada',
    'gu': 'Gujarati',
    'pa': 'Punjabi',
    'or': 'Odia',
    'as': 'Assamese',
    'ne': 'Nepali',
    'si': 'Sinhala',
    'my': 'Myanmar',
    'km': 'Khmer',
    'lo': 'Lao',
    'th': 'Thai',
    'vi': 'Vietnamese',
    'id': 'Indonesian',
    'ms': 'Malay',
    'tl': 'Filipino',
    'sw': 'Swahili',
    'am': 'Amharic',
    'yo': 'Yoruba',
    'ig': 'Igbo',
    'ha': 'Hausa',
    'zu': 'Zulu',
    'af': 'Afrikaans',
    'xh': 'Xhosa',
    'st': 'Sesotho',
    'tn': 'Setswana',
    'ss': 'Siswati',
    've': 'Venda',
    'ts': 'Tsonga',
    'nr': 'Ndebele'
}

@translation_bp.route('/languages', methods=['GET'])
def get_languages():
    """Get available languages for translation"""
    try:
        return jsonify({
            'success': True,
            'languages': LANGUAGES
        })
    except Exception as e:
        logging.error(f"Error getting languages: {str(e)}")
        return jsonify({
            'success': False,
            'error': 'Failed to get languages'
        }), 500

@translation_bp.route('/translate', methods=['POST'])
def translate_text():
    """Translate text from source language to target language"""
    try:
        data = request.get_json()
        
        if not data:
            return jsonify({
                'success': False,
                'error': 'No data provided'
            }), 400
        
        text = data.get('text', '').strip()
        source_lang = data.get('source_lang', 'auto')
        target_lang = data.get('target_lang')
        
        if not text:
            return jsonify({
                'success': False,
                'error': 'Text is required'
            }), 400
        
        if not target_lang:
            return jsonify({
                'success': False,
                'error': 'Target language is required'
            }), 400
        
        if target_lang not in LANGUAGES and target_lang != 'auto':
            return jsonify({
                'success': False,
                'error': 'Invalid target language'
            }), 400
        
        # Perform translation
        if source_lang == 'auto':
            result = translator.translate(text, dest=target_lang)
            detected_lang = result.src
        else:
            result = translator.translate(text, src=source_lang, dest=target_lang)
            detected_lang = source_lang
        
        return jsonify({
            'success': True,
            'original_text': text,
            'translated_text': result.text,
            'source_language': detected_lang,
            'target_language': target_lang,
            'source_language_name': LANGUAGES.get(detected_lang, detected_lang),
            'target_language_name': LANGUAGES.get(target_lang, target_lang)
        })
        
    except Exception as e:
        logging.error(f"Translation error: {str(e)}")
        return jsonify({
            'success': False,
            'error': 'Translation failed. Please try again.'
        }), 500

@translation_bp.route('/detect', methods=['POST'])
def detect_language():
    """Detect the language of given text"""
    try:
        data = request.get_json()
        
        if not data:
            return jsonify({
                'success': False,
                'error': 'No data provided'
            }), 400
        
        text = data.get('text', '').strip()
        
        if not text:
            return jsonify({
                'success': False,
                'error': 'Text is required'
            }), 400
        
        # Detect language
        detection = translator.detect(text)
        
        return jsonify({
            'success': True,
            'text': text,
            'detected_language': detection.lang,
            'language_name': LANGUAGES.get(detection.lang, detection.lang),
            'confidence': detection.confidence
        })
        
    except Exception as e:
        logging.error(f"Language detection error: {str(e)}")
        return jsonify({
            'success': False,
            'error': 'Language detection failed. Please try again.'
        }), 500

