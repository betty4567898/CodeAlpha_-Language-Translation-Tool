class LanguageTranslator {
    constructor() {
        this.languages = {};
        this.initializeElements();
        this.bindEvents();
        this.loadLanguages();
    }

    initializeElements() {
        this.sourceText = document.getElementById('source-text');
        this.targetText = document.getElementById('target-text');
        this.sourceLang = document.getElementById('source-lang');
        this.targetLang = document.getElementById('target-lang');
        this.translateBtn = document.getElementById('translate-btn');
        this.detectBtn = document.getElementById('detect-btn');
        this.swapBtn = document.getElementById('swap-btn');
        this.clearBtn = document.getElementById('clear-btn');
        this.copyBtn = document.getElementById('copy-btn');
        this.speakBtn = document.getElementById('speak-btn');
        this.charCount = document.getElementById('char-count');
        this.loading = document.getElementById('loading');
        this.errorMessage = document.getElementById('error-message');
        this.errorText = document.getElementById('error-text');
        this.resultInfo = document.getElementById('result-info');
        this.detectionText = document.getElementById('detection-text');
    }

    bindEvents() {
        this.translateBtn.addEventListener('click', () => this.translateText());
        this.detectBtn.addEventListener('click', () => this.detectLanguage());
        this.swapBtn.addEventListener('click', () => this.swapLanguages());
        this.clearBtn.addEventListener('click', () => this.clearText());
        this.copyBtn.addEventListener('click', () => this.copyTranslation());
        this.speakBtn.addEventListener('click', () => this.speakTranslation());
        
        this.sourceText.addEventListener('input', () => this.updateCharCount());
        this.sourceText.addEventListener('input', () => this.hideMessages());
        this.sourceLang.addEventListener('change', () => this.hideMessages());
        this.targetLang.addEventListener('change', () => this.hideMessages());
        
        // Enter key to translate
        this.sourceText.addEventListener('keydown', (e) => {
            if (e.ctrlKey && e.key === 'Enter') {
                this.translateText();
            }
        });
    }

    async loadLanguages() {
        try {
            const response = await fetch('/api/languages');
            const data = await response.json();
            
            if (data.success) {
                this.languages = data.languages;
                this.populateLanguageSelectors();
            } else {
                this.showError('Failed to load languages');
            }
        } catch (error) {
            this.showError('Failed to connect to the server');
            console.error('Error loading languages:', error);
        }
    }

    populateLanguageSelectors() {
        // Clear existing options (except auto-detect for source)
        this.targetLang.innerHTML = '<option value="">Select target language</option>';
        
        // Add language options
        Object.entries(this.languages).forEach(([code, name]) => {
            // Add to source language (skip auto-detect)
            if (code !== 'auto') {
                const sourceOption = document.createElement('option');
                sourceOption.value = code;
                sourceOption.textContent = name;
                this.sourceLang.appendChild(sourceOption);
            }
            
            // Add to target language
            const targetOption = document.createElement('option');
            targetOption.value = code;
            targetOption.textContent = name;
            this.targetLang.appendChild(targetOption);
        });
        
        // Set default selections
        this.targetLang.value = 'en'; // Default to English
    }

    async translateText() {
        const text = this.sourceText.value.trim();
        const sourceLang = this.sourceLang.value;
        const targetLang = this.targetLang.value;

        if (!text) {
            this.showError('Please enter text to translate');
            this.sourceText.focus();
            return;
        }

        if (!targetLang) {
            this.showError('Please select a target language');
            this.targetLang.focus();
            return;
        }

        if (sourceLang === targetLang && sourceLang !== 'auto') {
            this.showError('Source and target languages cannot be the same');
            return;
        }

        this.showLoading();
        this.hideMessages();

        try {
            const response = await fetch('/api/translate', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    text: text,
                    source_lang: sourceLang,
                    target_lang: targetLang
                })
            });

            const data = await response.json();

            if (data.success) {
                this.targetText.value = data.translated_text;
                this.showTranslationInfo(data);
                this.targetText.classList.add('success-animation');
                setTimeout(() => {
                    this.targetText.classList.remove('success-animation');
                }, 600);
            } else {
                this.showError(data.error || 'Translation failed');
            }
        } catch (error) {
            this.showError('Failed to connect to the server');
            console.error('Translation error:', error);
        } finally {
            this.hideLoading();
        }
    }

    async detectLanguage() {
        const text = this.sourceText.value.trim();

        if (!text) {
            this.showError('Please enter text to detect language');
            this.sourceText.focus();
            return;
        }

        this.showLoading();
        this.hideMessages();

        try {
            const response = await fetch('/api/detect', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    text: text
                })
            });

            const data = await response.json();

            if (data.success) {
                this.showDetectionResult(data);
                // Update source language selector
                this.sourceLang.value = data.detected_language;
            } else {
                this.showError(data.error || 'Language detection failed');
            }
        } catch (error) {
            this.showError('Failed to connect to the server');
            console.error('Detection error:', error);
        } finally {
            this.hideLoading();
        }
    }

    swapLanguages() {
        const sourceValue = this.sourceLang.value;
        const targetValue = this.targetLang.value;
        const sourceTextValue = this.sourceText.value;
        const targetTextValue = this.targetText.value;

        // Don't swap if source is auto-detect
        if (sourceValue === 'auto') {
            this.showError('Cannot swap when source language is auto-detect');
            return;
        }

        if (!targetValue) {
            this.showError('Please select a target language first');
            return;
        }

        // Swap languages
        this.sourceLang.value = targetValue;
        this.targetLang.value = sourceValue;

        // Swap text
        this.sourceText.value = targetTextValue;
        this.targetText.value = sourceTextValue;

        this.updateCharCount();
        this.hideMessages();
    }

    clearText() {
        this.sourceText.value = '';
        this.targetText.value = '';
        this.updateCharCount();
        this.hideMessages();
        this.sourceText.focus();
    }

    async copyTranslation() {
        const text = this.targetText.value;
        
        if (!text) {
            this.showError('No translation to copy');
            return;
        }

        try {
            await navigator.clipboard.writeText(text);
            this.showSuccess('Translation copied to clipboard!');
        } catch (error) {
            // Fallback for older browsers
            this.targetText.select();
            document.execCommand('copy');
            this.showSuccess('Translation copied to clipboard!');
        }
    }

    speakTranslation() {
        const text = this.targetText.value;
        const targetLang = this.targetLang.value;
        
        if (!text) {
            this.showError('No translation to speak');
            return;
        }

        if ('speechSynthesis' in window) {
            // Stop any ongoing speech
            speechSynthesis.cancel();
            
            const utterance = new SpeechSynthesisUtterance(text);
            utterance.lang = this.getLanguageCode(targetLang);
            utterance.rate = 0.8;
            utterance.pitch = 1;
            
            utterance.onstart = () => {
                this.speakBtn.innerHTML = '<i class="fas fa-stop"></i>';
                this.speakBtn.title = 'Stop speaking';
            };
            
            utterance.onend = () => {
                this.speakBtn.innerHTML = '<i class="fas fa-volume-up"></i>';
                this.speakBtn.title = 'Speak translation';
            };
            
            utterance.onerror = () => {
                this.showError('Speech synthesis failed');
                this.speakBtn.innerHTML = '<i class="fas fa-volume-up"></i>';
                this.speakBtn.title = 'Speak translation';
            };
            
            speechSynthesis.speak(utterance);
        } else {
            this.showError('Speech synthesis not supported in this browser');
        }
    }

    getLanguageCode(code) {
        // Map some language codes for speech synthesis
        const speechCodes = {
            'zh': 'zh-CN',
            'pt': 'pt-BR',
            'en': 'en-US',
            'es': 'es-ES',
            'fr': 'fr-FR',
            'de': 'de-DE',
            'it': 'it-IT',
            'ja': 'ja-JP',
            'ko': 'ko-KR',
            'ru': 'ru-RU',
            'ar': 'ar-SA',
            'hi': 'hi-IN'
        };
        
        return speechCodes[code] || code;
    }

    updateCharCount() {
        const count = this.sourceText.value.length;
        this.charCount.textContent = count;
        
        if (count > 4500) {
            this.charCount.style.color = '#f44336';
        } else if (count > 4000) {
            this.charCount.style.color = '#ff9800';
        } else {
            this.charCount.style.color = '#666';
        }
    }

    showTranslationInfo(data) {
        const sourceLanguageName = data.source_language_name || this.languages[data.source_language] || data.source_language;
        const targetLanguageName = data.target_language_name || this.languages[data.target_language] || data.target_language;
        
        this.detectionText.innerHTML = `
            <i class="fas fa-check-circle"></i>
            Translated from <strong>${sourceLanguageName}</strong> to <strong>${targetLanguageName}</strong>
        `;
        this.resultInfo.classList.remove('hidden');
        
        // Hide after 5 seconds
        setTimeout(() => {
            this.resultInfo.classList.add('hidden');
        }, 5000);
    }

    showDetectionResult(data) {
        const languageName = data.language_name || this.languages[data.detected_language] || data.detected_language;
        const confidence = Math.round(data.confidence * 100);
        
        this.detectionText.innerHTML = `
            <i class="fas fa-search"></i>
            Detected language: <strong>${languageName}</strong> (${confidence}% confidence)
        `;
        this.resultInfo.classList.remove('hidden');
        
        // Hide after 5 seconds
        setTimeout(() => {
            this.resultInfo.classList.add('hidden');
        }, 5000);
    }

    showLoading() {
        this.loading.classList.remove('hidden');
        this.translateBtn.disabled = true;
        this.detectBtn.disabled = true;
    }

    hideLoading() {
        this.loading.classList.add('hidden');
        this.translateBtn.disabled = false;
        this.detectBtn.disabled = false;
    }

    showError(message) {
        this.errorText.textContent = message;
        this.errorMessage.classList.remove('hidden');
        
        // Hide after 5 seconds
        setTimeout(() => {
            this.errorMessage.classList.add('hidden');
        }, 5000);
    }

    showSuccess(message) {
        // Temporarily change error styling to success
        this.errorMessage.style.background = '#e8f5e8';
        this.errorMessage.style.borderColor = '#4caf50';
        this.errorMessage.style.color = '#2e7d32';
        this.errorText.textContent = message;
        this.errorMessage.classList.remove('hidden');
        
        // Reset styling and hide after 3 seconds
        setTimeout(() => {
            this.errorMessage.classList.add('hidden');
            this.errorMessage.style.background = '';
            this.errorMessage.style.borderColor = '';
            this.errorMessage.style.color = '';
        }, 3000);
    }

    hideMessages() {
        this.errorMessage.classList.add('hidden');
        this.resultInfo.classList.add('hidden');
    }
}

// Initialize the translator when the page loads
document.addEventListener('DOMContentLoaded', () => {
    new LanguageTranslator();
});

// Add keyboard shortcuts
document.addEventListener('keydown', (e) => {
    // Ctrl+Enter to translate
    if (e.ctrlKey && e.key === 'Enter') {
        e.preventDefault();
        document.getElementById('translate-btn').click();
    }
    
    // Ctrl+D to detect language
    if (e.ctrlKey && e.key === 'd') {
        e.preventDefault();
        document.getElementById('detect-btn').click();
    }
    
    // Ctrl+Shift+C to copy translation
    if (e.ctrlKey && e.shiftKey && e.key === 'C') {
        e.preventDefault();
        document.getElementById('copy-btn').click();
    }
    
    // Ctrl+Shift+S to speak translation
    if (e.ctrlKey && e.shiftKey && e.key === 'S') {
        e.preventDefault();
        document.getElementById('speak-btn').click();
    }
});

