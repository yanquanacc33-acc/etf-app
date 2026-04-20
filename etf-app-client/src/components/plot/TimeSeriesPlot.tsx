import React, { useMemo } from 'react';
import { Chart, Series, Title } from '@highcharts/react';
import type { TimeSeriesPlotProps } from './TimeSeriesPlotTypes';

// Render the zoomable time series plot
const TimeSeriesPlot: React.FC<TimeSeriesPlotProps> = ({
  priceData,
  etfData,
  title = 'title'
}) => {
  // Build Highcharts data in [timestamp, price] format
  // ETF price for each day = sum of (weight * constituent price)
  const timeSeriesData = useMemo(() => {
    return priceData.map((row) => {
      let sum = 0;

      etfData.forEach((item) => {
        const raw = row[item.name];

        const price =
          typeof raw === 'number'
            ? raw
            : parseFloat(String(raw));

        // Skip invalid values to avoid NaN propagation
        if (!Number.isNaN(price)) {
          sum += item.weight * price;
        }
      });

      return [
        new Date(row['DATE']).getTime(),
        Number(sum.toFixed(4)),
      ];
    });
  }, [priceData, etfData]);

  return (
    <div>
      <Chart
        options={{
          chart: {
            zooming: {
              type: 'x',
            },
          },
          xAxis: {
            type: 'datetime',
          },
          yAxis: {
            title: {
              text: 'Price',
            },
          },
          tooltip: {
            xDateFormat: '%Y-%m-%d',
            pointFormat: '<b>${point.y:.2f}</b>',
          },
          legend: {
            enabled: false,
          },
        }}
      >
        <Title>{title}</Title>
        <Series type="area" data={timeSeriesData} />
      </Chart>
    </div>
  );
};

export default TimeSeriesPlot;