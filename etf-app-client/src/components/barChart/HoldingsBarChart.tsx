import React from 'react';
import { Chart, Series, Title } from '@highcharts/react';
import type { HoldingsBarChartProps } from './BarChartTypes';

// The bar chart that displays the top 5 holdings of the selected ETF as of the market close
const HoldingsBarChart: React.FC<HoldingsBarChartProps> = ({
  data,
  title,
}) => {

  // For each constituent, multiply the 
  // filter out the holdings with invalid value and sort to obtain the biggest 5
  const barChartData = data
    .map((item) => {

      if (item.latestClosePrice === undefined || Number.isNaN(item.latestClosePrice)) {
        return null;
      }

      return {
        name: item.name,
        value: item.weight * item.latestClosePrice,
      };
    })
    .filter((item): item is { name: string; value: number } => item !== null)
    .sort((a, b) => b.value - a.value)
    .slice(0, 5);

  // Render the bar chart of the top 5 holdings 
  return (
    <div>
      <Chart
        options={{
          chart: {
            type: 'column',
          },
          xAxis: {
            categories: barChartData.map((item) => item.name),
          },
          yAxis: {
            title: {
              text: 'Holding Size',
            },
          },
          tooltip: {
            pointFormat: '<b>${point.y:.2f}</b>',
          },
          legend: {
            enabled: false,
          },
        }}
      >
        <Title>{title}</Title>
        <Series
          type="column"
          data={barChartData.map((item) =>
            Number(item.value.toFixed(2))
          )}
        />
      </Chart>
    </div>
  );
};

export default HoldingsBarChart;