import React, { useEffect, useState } from "react";
import Papa from "papaparse";
import DataTable from "./components/dataTable/DataTable";
import { type EtfMetaDataProps, type LatestPrice } from "./components/dataTable/DataTableTypes";
import TimeSeriesPlot from "./components/plot/TimeSeriesPlot";
import HoldingsBarChart from "./components/barChart/HoldingsBarChart";
import './styles/mainpage.css'
import type { TimeSeriesPointProps } from "./components/plot/TimeSeriesPlotTypes";

// Main page that conditionally renders data visualization components
const MainPage: React.FC = () => {
  const [etfMetaData, setEtfMetaData] = useState<EtfMetaDataProps[]>([]);
  const [latestPrices, setLatestPrices] = useState<LatestPrice[]>([]);
  const [priceData, setPriceData] = useState<TimeSeriesPointProps[]>([]);

  // Fetch price data from backend on component mount
  useEffect(() => {
    const fetchPriceMetaData = async () => {
      const res = await fetch("http://localhost:8000/api/prices");
      const data = await res.json();
      if (data.latest_prices) {
        setLatestPrices(data.latest_prices);
        setPriceData(data.rows);
      }
    }
    fetchPriceMetaData();
  }, [])

  // Handle ETF CSV upload
  // Parse CSV using PapaParse
  // Extract name + weight
  // Find each constituent's latestClosePrice from latestPrices array
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    Papa.parse(file, {
      header: true,
      skipEmptyLines: true,
      complete: (results) => {
        const parsed = results.data.map((row: any) => ({
          name: row.constituent || row.name || row.symbol,
          weight: parseFloat(row.weight),
          latestClosePrice: latestPrices.find((item) => item.name === row.name).price
        }));
        setEtfMetaData(parsed)
      },
    });
  };

  return (
    <div className="container">
      <div className="content">
        <h1 className="title">ETF Holdings Analyzer</h1>

        <div className="card">
          <h3>Upload CSV</h3>

          <input
            type="file"
            accept=".csv"
            onChange={handleFileUpload}
          />
        </div>

        {/* Data Table */}
        {etfMetaData.length > 0 && 
          <div>
            <DataTable tableData={etfMetaData} />
          </div>
        }
        {/* Time Series Plot (requires both price data and ETF weights) */}
        {priceData.length > 0 && etfMetaData.length > 0 && 
          <div>
            <TimeSeriesPlot priceData={priceData} etfData={etfMetaData} title="Reconstructed ETF Price"/>
          </div>
        }
        {/* Top 5 Holdings Bar Chart */}
        {etfMetaData.length > 0 && 
          <div>
            <HoldingsBarChart data={etfMetaData} title="Top 5 Holdings"/>
          </div>
        }
      </div>
    </div>
  );
};

export default MainPage;
