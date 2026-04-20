import type { EtfMetaDataProps } from "../dataTable/DataTableTypes";

export interface TopHoldingRow {
    constituent: string;
    value: number;
}

export interface HoldingsBarChartProps {
    data: EtfMetaDataProps[];
    title?: string;
}