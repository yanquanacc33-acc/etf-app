export interface SortableThProps {
    label: string;
    active: boolean;
    direction: SortDirection;
    onClick: () => void;
    align?: "left" | "right";
};

export interface EtfMetaDataProps {
    name: string;
    weight: number;
    latestClosePrice: number;
};

export interface DataTableProps {
    tableData: EtfMetaDataProps[];
};
  
export enum SortKey {
    Constituent = 'constituent',
    Weight = 'weight',
    LatestClose = 'latestClose'
}

export enum SortDirection {
    Asc = 'ascending',
    Desc = 'descending'
}

export interface LatestPrice { 
    name: string;
    price: number;
}
