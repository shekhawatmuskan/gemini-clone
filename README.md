# Gemini Clone

Gemini Clone is a React-based web app that replicates the core features of Google’s Gemini AI chatbot using the Google Gemini API,using React and CSS.

## Table of Contents

- [Introduction](#introduction)
- [Features](#features)
  - [Core Features](#core-features)
  - [Additional Features](#additional-features)
  
## Introduction

This project is a simple and clean clone of the Google Gemini chatbot. It allows users to chat with AI in a smooth, interactive UI built using React and CSS. The app connects with the Google Gemini API to deliver intelligent responses.

## Features

### Core Features

- **Chat Interface:** Simple and interactive chat layout.
- **Typing Animation:** Simulated typing effect for a natural feel.
- **Gemini API Integration:** Uses real AI responses from Google’s Gemini.

### Additional Features

- Built with **React.js (Vite)**
- Responsive design with CSS styling
- Sidebar for recent conversations

## Setup & Run

1. Get a Gemini API key from Google AI Studio.
2. Create a `.env` file in the project root:

### Basic Setup (Single API Key)

```bash
VITE_GEMINI_API_KEY=YOUR_API_KEY
```

### Advanced Setup (Multiple API Keys for Free Tier)

To maximize free tier usage and avoid quota errors, you can use **multiple API keys** (each from a different Google Cloud project). Each API key has its own 20 requests/day quota.

```bash
# Multiple API keys separated by commas
VITE_GEMINI_API_KEY=KEY1,KEY2,KEY3

# Optional: Specify models (each model has separate quota)
# Default: gemini-2.5-flash, gemini-1.5-flash, gemini-1.5-pro, gemini-pro
VITE_GEMINI_MODEL=gemini-2.5-flash,gemini-1.5-flash
```

**How it works:**
- ✅ **Automatic Fallback**: If one API key/model hits quota, it automatically tries the next one
- ✅ **Response Caching**: Repeated questions use cached responses (no API calls)
- ✅ **Smart Rotation**: Tracks exhausted combinations and skips them
- ✅ **Multiple Models**: Each Gemini model has its own 20/day quota

**Example with 2 API keys × 4 models = up to 160 requests/day on free tier!**

3. Install and run:

```bash
npm install
npm run dev
```

Then open `http://localhost:5173/`.