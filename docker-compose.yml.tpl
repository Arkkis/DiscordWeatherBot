version: '3'
services:
  weatherbot:
    build: .
    environment:
      - BOT_TOKEN=XXX
      - WEATHER_API_KEY=XXX
