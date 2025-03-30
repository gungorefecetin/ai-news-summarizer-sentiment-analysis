from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List, Optional
import os
from dotenv import load_dotenv
from newsapi import NewsApiClient
from transformers import pipeline
import nltk

# Download necessary NLTK data
nltk.download('punkt')

# Load environment variables
load_dotenv()

# Initialize FastAPI app
app = FastAPI(title="News Summarizer & Sentiment Analysis API")

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Initialize NewsAPI client
newsapi = NewsApiClient(api_key=os.getenv("NEWS_API_KEY"))

# Initialize transformers pipelines
summarizer = pipeline("summarization", model="facebook/bart-large-cnn")
sentiment_analyzer = pipeline("sentiment-analysis", model="distilbert-base-uncased-finetuned-sst-2-english")

class Article(BaseModel):
    title: str
    description: Optional[str]
    content: Optional[str]
    url: str
    source: str
    published_at: str

class ArticleResponse(BaseModel):
    article: Article
    summary: str
    sentiment: str

@app.get("/")
async def root():
    return {"message": "Welcome to the News Summarizer & Sentiment Analysis API"}

@app.get("/api/news", response_model=List[ArticleResponse])
async def get_news(query: str = "", category: str = "general"):
    try:
        # Fetch news from NewsAPI
        news = newsapi.get_top_headlines(q=query, category=category, language='en', page_size=5)
        
        results = []
        for article in news['articles']:
            # Skip articles without content
            if not article.get('content'):
                continue
                
            # Generate summary
            summary = summarizer(article['content'], max_length=130, min_length=30, do_sample=False)[0]['summary_text']
            
            # Analyze sentiment
            sentiment = sentiment_analyzer(article['content'])[0]
            sentiment_label = "positive" if sentiment['label'] == "POSITIVE" else "negative"
            
            # Create response object
            article_obj = Article(
                title=article['title'],
                description=article.get('description', ''),
                content=article.get('content', ''),
                url=article['url'],
                source=article['source']['name'],
                published_at=article['publishedAt']
            )
            
            results.append(ArticleResponse(
                article=article_obj,
                summary=summary,
                sentiment=sentiment_label
            ))
            
        return results
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/api/categories")
async def get_categories():
    return {
        "categories": [
            "general",
            "business",
            "technology",
            "science",
            "health",
            "entertainment",
            "sports"
        ]
    } 