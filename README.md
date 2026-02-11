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

```bash
VITE_GEMINI_API_KEY=YOUR_API_KEY
```

Optionally set a model (default is `gemini-2.5-flash`):

```bash
VITE_GEMINI_MODEL=gemini-2.5-flash
```

3. Install and run:

```bash
npm install
npm run dev
```

Then open `http://localhost:5173/`.