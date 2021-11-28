export interface ChartDataSet {
  label: string;
  data: number[];
  backgroundColor: string[];
  borderColor: string[];
  borderWidth: 1;
}
export interface ChartConfig {
  labels: string[];
  datasets: ChartDataSet[];
}
export interface UpcomingBill {
  value: number;
  date: Date;
  billId: string;
  bill: {
    category: string;
  };
}

export interface ResponseUpcomingBills {
  payments: UpcomingBill[];
}

export interface BillsGroupedByCategory {
  [key: string]: UpcomingBill[];
}

export enum VisualizationType {
  BY_CATEGORY = 'byCategory',
  BY_MONTHS = 'byMonths',
}

export interface ChartState {
  bills: UpcomingBill[];
  chartConfig: ChartConfig | null;
  typeVisualization: VisualizationType;
  filteredBills: UpcomingBill[];
  monthFilter: number | null;
  setChartConfig: (chartConfig: ChartConfig) => void;
  setFilteredBills: (bills: UpcomingBill[]) => void;
  setMonthFilter: (filter: number | null) => void;
  setTypeVisualization: (type: VisualizationType) => void;
  setBills: (bills: UpcomingBill[]) => void;
}
