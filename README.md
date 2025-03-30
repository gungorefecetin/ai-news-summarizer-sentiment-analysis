# AI-Powered News Summarizer & Sentiment Analysis Tool

This project is a modern web application that fetches news articles, generates concise summaries, and performs sentiment analysis using state-of-the-art NLP models.

## Features

- News article fetching using NewsAPI
- Article summarization using transformers
- Sentiment analysis of articles
- Clean and responsive React frontend
- FastAPI backend with async support

## Tech Stack

- **Backend**: FastAPI, Python 3.8+
- **Frontend**: React, TypeScript, Tailwind CSS
- **NLP**: Transformers (Hugging Face), NLTK
- **Other**: NewsAPI for article fetching

## Setup

### Backend Setup

1. Create a virtual environment:
```bash
python -m venv venv
source venv/bin/activate  # On Windows: .\venv\Scripts\activate
```

2. Install dependencies:
```bash
pip install -r requirements.txt
```

3. Set up environment variables:
```bash
cp .env.example .env
# Add your NewsAPI key to .env file
```

4. Run the backend:
```bash
uvicorn backend.main:app --reload
```

### Frontend Setup

1. Install dependencies:
```bash
cd frontend
npm install
```

2. Run the development server:
```bash
npm run dev
```

## API Documentation

Once the backend is running, visit `http://localhost:8000/docs` for the interactive API documentation.

## License

MIT 