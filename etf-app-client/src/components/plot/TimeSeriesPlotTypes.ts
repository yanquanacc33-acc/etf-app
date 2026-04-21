import type { EtfMetaDataProps } from "../dataTable/DataTableTypes";

export interface TimeSeriesPointProps {
  date: string;
  price: number;
}

export interface TimeSeriesPlotProps {
  priceData: TimeSeriesPointProps[];
  etfData: EtfMetaDataProps[];
  title?: string;
}
