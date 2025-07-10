# Language Translation Tool

A modern, responsive web application for translating text between different languages using Google Translate API. Built with Flask backend and vanilla JavaScript frontend.

## Features

- **Real-time Translation**: Translate text between 70+ languages instantly
- **Auto Language Detection**: Automatically detect the source language
- **Language Swapping**: Easily swap source and target languages
- **Copy to Clipboard**: Copy translations with one click
- **Text-to-Speech**: Listen to translations with built-in speech synthesis
- **Character Counter**: Track input length with visual feedback
- **Responsive Design**: Works seamlessly on desktop and mobile devices
- **Modern UI**: Beautiful gradient design with smooth animations

## Screenshots

![Language Translation Tool Interface](screenshot.png)

## Technologies Used

- **Backend**: Flask (Python)
- **Frontend**: HTML5, CSS3, JavaScript (ES6+)
- **Translation API**: Google Translate (via googletrans library)
- **Styling**: Custom CSS with gradients and animations
- **Icons**: Font Awesome

## Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/language-translation-tool.git
   cd language-translation-tool
   ```

2. **Create a virtual environment**
   ```bash
   python -m venv venv
   source venv/bin/activate  # On Windows: venv\Scripts\activate
   ```

3. **Install dependencies**
   ```bash
   pip install -r requirements.txt
   ```

4. **Run the application**
   ```bash
   python src/main.py
   ```

5. **Open your browser**
   Navigate to `http://localhost:5000`

## Usage

1. **Enter Text**: Type or paste the text you want to translate in the left text area
2. **Select Languages**: Choose source language (or use auto-detect) and target language
3. **Translate**: Click the "Translate" button or use Ctrl+Enter
4. **Additional Features**:
   - Click the swap button to exchange source and target languages
   - Use "Detect Language" to identify the source language
   - Copy translation using the copy button
   - Listen to translation using the speak button

## Keyboard Shortcuts

- `Ctrl + Enter`: Translate text
- `Ctrl + D`: Detect language
- `Ctrl + Shift + C`: Copy translation
- `Ctrl + Shift + S`: Speak translation

## API Endpoints

### GET /api/languages
Returns available languages for translation.

**Response:**
```json
{
  "success": true,
  "languages": {
    "en": "English",
    "es": "Spanish",
    "fr": "French",
    ...
  }
}
```

### POST /api/translate
Translates text from source to target language.

**Request:**
```json
{
  "text": "Hello, how are you?",
  "source_lang": "auto",
  "target_lang": "es"
}
```

**Response:**
```json
{
  "success": true,
  "original_text": "Hello, how are you?",
  "translated_text": "Hola, ¿cómo estás?",
  "source_language": "en",
  "target_language": "es",
  "source_language_name": "English",
  "target_language_name": "Spanish"
}
```

### POST /api/detect
Detects the language of given text.

**Request:**
```json
{
  "text": "Bonjour le monde"
}
```

**Response:**
```json
{
  "success": true,
  "text": "Bonjour le monde",
  "detected_language": "fr",
  "language_name": "French",
  "confidence": 0.99
}
```

## Project Structure

```
language_translation_tool/
├── src/
│   ├── main.py                 # Flask application entry point
│   ├── routes/
│   │   ├── translation.py      # Translation API routes
│   │   └── user.py            # User routes (template)
│   ├── models/
│   │   └── user.py            # Database models (template)
│   ├── static/
│   │   ├── index.html         # Main HTML file
│   │   ├── style.css          # CSS styles
│   │   └── script.js          # JavaScript functionality
│   └── database/
│       └── app.db             # SQLite database
├── venv/                      # Virtual environment
├── requirements.txt           # Python dependencies
└── README.md                 # Project documentation
```

## Supported Languages

The application supports translation between 70+ languages including:

- English, Spanish, French, German, Italian
- Portuguese, Russian, Japanese, Korean, Chinese
- Arabic, Hindi, Turkish, Dutch, Swedish
- And many more...

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Acknowledgments

- Google Translate API for translation services
- Font Awesome for icons
- Flask community for the excellent web framework

## Contact

Your Name - your.email@example.com

Project Link: [https://github.com/yourusername/language-translation-tool](https://github.com/yourusername/language-translation-tool)

---

**Note**: This application uses the unofficial Google Translate API. For production use, consider using the official Google Cloud Translation API for better reliability and rate limits.

