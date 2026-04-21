# ETF Analytics Web Application

A single-page web application that allows users to upload ETF weight data, visualize constituent prices, and analyze ETF performance.

---

## Features

- Upload ETF weight CSV files
- Interactive data table with sorting
- Display latest prices for each constituent
- Zoomable time series chart
- Top 5 holdings bar chart

---

## High Level Description

### Architecture

**Frontend (React + TypeScript)**

- Handles user interactions (CSV upload, table sorting, visualization)
- Performs data transformations (e.g., merging weights with latest prices)
- Renders interactive components such as:
  - DataTable
  - TimeSeriesPlot (ETF price reconstruction over time)
  - HoldingsBarChart (top 5 holdings)

**Backend (FastAPI + Pandas)**

- Loads and preprocesses historical price CSV data
- Cleans and validates data (date parsing, numeric conversion)
- Provides a REST API returning frontend-friendly JSON

### Assumptions

- The uploaded ETF CSV file contains at least:
  - a constituent identifier
  - a weight column

- The historical price CSV contains:
  - a `DATE` column
  - one column per constituent

- The dataset size is relatively small at this stage, so the application loads all data at once for simplicity and ease of implementation.

- For larger datasets, the backend can be extended to support query parameters (e.g., start_date and end_date) to limit the returned data and improve performance.

- Styling is intentionally minimal in this implementation, as the focus is on functionality, data flow, and system design. Further UI/UX improvements can be added in future iterations.

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

## Tech Stack

### Frontend

- React
- TypeScript
- Highcharts
- CSS

### Backend

- FastAPI
- Pandas

---

## Setup

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
