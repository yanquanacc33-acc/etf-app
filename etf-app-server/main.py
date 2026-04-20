from pathlib import Path
from typing import Any

import pandas as pd
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware

# Initialize FastAPI app
app = FastAPI(title="ETF Price CSV API")

# Path to the local CSV file (update this path if needed)
CSV_PATH = Path("./data/bankofmontreal-e134q-1arsjzss-prices.csv")

# Enable CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


def load_prices_df() -> pd.DataFrame:
    """
    Load and clean the price CSV into a pandas DataFrame.

    Steps:
    1. Check file existence
    2. Parse DATE column to datetime
    3. Remove invalid dates
    4. Sort data chronologically
    5. Convert all price columns to numeric
    """
    # Ensure file exists
    if not CSV_PATH.exists():
        raise HTTPException(status_code=404, detail=f"CSV file not found: {CSV_PATH}")

    # Read CSV into DataFrame
    df = pd.read_csv(CSV_PATH)

    # Remove invalid dates
    if "DATE" not in df.columns:
        raise HTTPException(status_code=400, detail="CSV must contain a DATE column")

    # Convert DATE column to datetime
    df["DATE"] = pd.to_datetime(df["DATE"], errors="coerce")

    # Drop rows with invalid dates and sort
    df = df.dropna(subset=["DATE"]).sort_values("DATE").reset_index(drop=True)

    # Convert all price columns to numeric
    price_columns = [col for col in df.columns if col != "DATE"]
    for col in price_columns:
        df[col] = pd.to_numeric(df[col], errors="coerce")

    return df


@app.get("/api/prices")
def get_prices() -> dict[str, Any]:
    """
    Response structure:
    {
      "columns": ["DATE", "A", "B", ...],
      "rows": [
        {"DATE": "2017-01-01", "A": 27.657, "B": 3.707, ...},
        ...
      ],
      "latest_prices": [
        {"name": "A", "price": 24.123},
        {"name": "B", "price": 5.456},
        ...
      ]
    }
    """
    try:
        # Load and preprocess CSV
        df = load_prices_df()

        # Format DATE as string
        rows_df = df.copy()
        rows_df["DATE"] = rows_df["DATE"].dt.strftime("%Y-%m-%d")
        rows = rows_df.to_dict(orient="records")

        latest_row = df.iloc[-1]

        # Build latest prices list
        latest_prices = [
            {
                "name": col,
                "price": None if pd.isna(latest_row[col]) else float(latest_row[col]),
            }
            for col in df.columns
            if col != "DATE"
        ]

        return {
            "columns": df.columns.tolist(),
            "rows": rows,
            "latest_prices": latest_prices,
        }

    except HTTPException:
        raise

    except Exception:
        raise HTTPException(
            status_code=500,
            detail="Internal server error"
        )