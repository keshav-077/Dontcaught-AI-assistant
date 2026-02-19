# DontCaught 🚀

> A lightning-fast, privacy-first AI assistant that works seamlessly during meetings, interviews, and conversations without getting caught.

[![Open Source](https://img.shields.io/badge/Open%20Source-❤️-blue)](https://github.com/yourusername/dontcaught)
[![Tauri](https://img.shields.io/badge/Built%20with-Tauri-orange)](https://tauri.app/)
[![React](https://img.shields.io/badge/Frontend-React%20%2B%20TypeScript-blue)](https://reactjs.org/)
[![License](https://img.shields.io/badge/License-GPL%20v3-blue.svg)](LICENSE)

---

## ⚡ The Ultimate Stealth AI Companion

**Just 10MB • Always On Display • Completely Invisible • One Click Away**

The world's most efficient AI assistant that lives on your desktop without anyone knowing.

### Key Features

- 🪶 **Ultra Lightweight** - Only ~10MB total app size
- � **Completely Invisible** - Undetecteable in video calls and screen shares
- 📺 **Always Visible to You** - Translucent overlay on any window
- ⚡ **Instant Access** - One click to activate AI assistance
- 🔒 **Privacy First** - All data stays local on your device
- 🎯 **Stealth Mode** - Screenshot-proof and recording-proof

---

## Features

### Invisibility Mode

DontCaught operates with complete stealth during sensitive scenarios. The application features a translucent overlay window that sits above all other applications, making it invisible in video calls, screen shares, and recordings. The window is designed to be screenshot-proof and undetectable in meeting platforms like Zoom, Google Meet, Microsoft Teams, and Slack Huddles. When sharing your screen or recording, DontCaught remains invisible to your audience while providing you with real-time AI assistance.

### System Audio Capture

Capture and transcribe system audio in real-time. Perfect for meetings, presentations, or any audio playing on your system. The captured audio is processed through your selected speech-to-text provider and can be automatically sent to the AI for analysis or transcription.

**Keyboard Shortcut:** `Cmd+Shift+M` (macOS) / `Ctrl+Shift+M` (Windows/Linux)

The system audio capture includes voice activity detection, real-time audio visualization, and automatic processing status indicators.

### Voice Input

Record your voice and convert it to text using advanced speech-to-text providers. Supports multiple STT providers including OpenAI Whisper, ElevenLabs, Groq Whisper, and custom providers. Voice activity detection automatically identifies when you're speaking.

**Keyboard Shortcut:** `Cmd+Shift+A` (macOS) / `Ctrl+Shift+A` (Windows/Linux)

Voice input can be used in the main overlay window or within chat conversations for hands-free interaction with AI.

### Screenshot Capture

Capture screenshots and send them to AI for visual analysis. Two modes available:

- **Screenshot Mode:** Capture the entire screen instantly
- **Selection Mode:** Click and drag to select a specific area

**Keyboard Shortcut:** `Cmd+Shift+S` (macOS) / `Ctrl+Shift+S` (Windows/Linux)

**Processing Modes:**
- **Manual Mode:** Screenshots are captured and added to your attached files for later submission
- **Auto Mode:** Screenshots are automatically submitted to AI using your custom prompt

### File Attachments

Attach files to your AI conversations for analysis, review, or context. Supports multiple files at once, including documents, images, and code files. Drag and drop files directly into the input area.

---

## Why DontCaught?

### Complete Invisibility

DontCaught is designed to be completely undetectable:

- Invisible in video calls (Zoom, Teams, Meet, etc.)
- Won't appear in screen recordings
- Screenshot-proof design
- Undetectable to screen sharing software
- Perfect for job interviews, sales calls, presentations, and meetings

### Privacy-First Architecture

Your data stays yours:

- All conversations stored locally in SQLite database
- No telemetry, tracking, or analytics
- Direct API calls to your chosen AI provider
- Encrypted credential storage
- Works offline for local features

### Blazing Fast Performance

Built with Tauri and Rust:

- Only ~10MB app size
- Launches in under 100ms
- Uses 50% less RAM than Electron apps
- Native desktop performance
- Cross-platform (macOS, Windows, Linux)

---

## Installation & Setup

### Prerequisites

- **Node.js** (v18 or higher)
- **Rust** (latest stable)
- **npm** or **yarn**

### Quick Start

```bash
# Clone the repository
git clone https://github.com/yourusername/dontcaught.git
cd dontcaught

# Install dependencies
npm install

# Start development server
npm run tauri dev
```

### Build for Production

```bash
# Build the application
npm run tauri build
```

This creates platform-specific installers in `src-tauri/target/release/bundle/`:

- **macOS**: `.dmg`
- **Windows**: `.msi`, `.exe`
- **Linux**: `.deb`, `.rpm`, `.AppImage`

---

## Configuration

### AI Providers

Configure your preferred AI provider in the Dev Space:

- OpenAI (GPT-4, GPT-3.5)
- Anthropic Claude
- Google Gemini
- xAI Grok
- Mistral AI
- Cohere
- Groq
- Perplexity
- OpenRouter
- Ollama (local, free)
- Custom providers via curl

### Speech-to-Text Providers

- OpenAI Whisper
- Groq Whisper (fast & free tier)
- ElevenLabs
- Google Speech-to-Text
- Deepgram
- Azure Speech
- Custom providers via curl

### Minimum Setup

To get started, you need:

1. **One AI Provider API Key** (e.g., OpenAI or Claude)
2. **One STT Provider API Key** (optional, for voice features)

**Recommended for beginners:**
- OpenAI API key for both GPT-4 (AI) and Whisper (voice)
- Or use Ollama (free, local) for AI + Groq (free tier) for voice

---

## Keyboard Shortcuts

All shortcuts are customizable in settings:

- **Toggle Dashboard:** `Cmd+Shift+D` / `Ctrl+Shift+D`
- **Toggle Window:** `Cmd+\` / `Ctrl+\`
- **Refocus Input:** `Cmd+Shift+I` / `Ctrl+Shift+I`
- **System Audio:** `Cmd+Shift+M` / `Ctrl+Shift+M`
- **Voice Input:** `Cmd+Shift+A` / `Ctrl+Shift+A`
- **Screenshot:** `Cmd+Shift+S` / `Ctrl+Shift+S`
- **Move Window:** Hold `Cmd`/`Ctrl` + Arrow Keys

---

## Use Cases

- **Job Interviews:** Get real-time information without detection
- **Sales Calls:** Access product details instantly while maintaining professionalism
- **Technical Meetings:** Reference documentation during live coding sessions
- **Presentations:** Get suggestions during design reviews invisibly
- **Learning:** Receive assistance during educational presentations
- **Customer Support:** Quick access to information during support calls

---

## Privacy & Security

- **100% Local Storage** - All conversations stored in local SQLite database
- **No Telemetry** - Zero tracking, analytics, or data collection
- **Direct API Calls** - Your data goes directly to your chosen AI provider
- **Encrypted Credentials** - API keys stored in secure encrypted storage
- **Offline Capable** - Works without internet for local features
- **No Proxy Servers** - No middleware between you and AI providers

---

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

### How to Contribute

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

---

## License

This project is licensed under the **GNU General Public License v3.0** - see the [LICENSE](LICENSE) file for details.

---

## Acknowledgments

- **[Tauri](https://tauri.app/)** - Amazing desktop framework
- **[tauri-nspanel](https://github.com/ahkohd/tauri-nspanel)** - macOS native panel integration
- **[shadcn/ui](https://ui.shadcn.com/)** - Beautiful UI components
- **[@ricky0123/vad-react](https://github.com/ricky0123/vad)** - Voice Activity Detection

---

## Disclaimer

This tool is designed for legitimate use cases such as accessibility, note-taking, and personal assistance. Users are responsible for complying with all applicable laws, regulations, and policies in their jurisdiction and organization. Always obtain proper consent before recording or transcribing conversations.

---

## Support

For issues, questions, or feature requests, please open an issue on GitHub.
