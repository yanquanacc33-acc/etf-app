# ETF Analytics Web Application

A single-page web application that allows users to upload ETF weight data, visualize constituent prices, and analyze ETF performance.

---

## 🚀 Features

- Upload ETF weight CSV files
- Interactive data table with sorting
- Display latest prices for each constituent
- Zoomable time series chart
- Top 5 holdings bar chart

---

## 🧠 How It Works

### Data Flow

1. User uploads ETF weights CSV
2. Backend loads historical price CSV
3. Frontend combines:
   - weights
   - price data
4. Calculates:
   - ETF time series
   - top holdings

---

## 🏗️ Tech Stack

### Frontend
- React
- TypeScript
- Highcharts
- CSS

### Backend
- FastAPI
- Pandas

---

## ⚙️ Setup

### Backend

cd etf-app-server
pip install fastapi uvicorn pandas
uvicorn main:app --reload

### Frontend

cd etf-app
npm install
npm run dev

---

## Author

Aeron Chen

---

## Summary

This project demonstrates:

- Full-stack development  
- Data processing (pandas)  
- API (FastAPI)  
- Frontend (React)  
- Data visualization (Highcharts)

---
