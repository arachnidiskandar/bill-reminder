import { Box } from '@chakra-ui/react';
import React from 'react';
import { Pie } from 'react-chartjs-2';
import ReactSelect from 'react-select';

import useChartConfig, { getMonthName } from './hooks';

const SpendForecastTab = () => {
  const { chartConfig, loading, dateRangeListFilter, setMonthFilter } =
    useChartConfig();
  const options = dateRangeListFilter.map((month, index) => ({
    value: index,
    label: getMonthName(month, 'long'),
  }));

  return (
    <div>
      <ReactSelect
        options={options}
        defaultValue={options[0]}
        onChange={(e: { value: number; label: string }) =>
          setMonthFilter(e.value)
        }
      />

      {chartConfig && (
        <Box>
          <Pie
            data={chartConfig}
            height={400}
            options={{ maintainAspectRatio: false }}
          />
        </Box>
      )}
    </div>
  );
};

export default SpendForecastTab;
