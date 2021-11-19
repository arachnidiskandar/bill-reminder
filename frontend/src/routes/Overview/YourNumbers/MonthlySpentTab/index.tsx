import React from 'react';
import { Pie } from 'react-chartjs-2';

import useChartConfig from './hooks';

const MonthlySpentTab = () => {
  const { chartConfig, loading } = useChartConfig();

  return (
    <div>
      {chartConfig && (
        <Pie
          data={chartConfig}
          height={400}
          options={{ maintainAspectRatio: false }}
        />
      )}
    </div>
  );
};

export default MonthlySpentTab;
