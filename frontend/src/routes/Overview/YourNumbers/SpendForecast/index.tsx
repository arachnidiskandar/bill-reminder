import { Box, Radio, RadioGroup } from '@chakra-ui/react';
import React, { BaseSyntheticEvent } from 'react';
import { Bar, Pie } from 'react-chartjs-2';
import ReactSelect from 'react-select';
import { getMonthName } from '../../../../helpers/DateHelpers';

import useChartConfig from './hooks';
import { VisualizationType } from './interfaces';

const SpendForecastTab = ({ future }: { future: boolean }) => {
  const {
    chartConfig,
    loading,
    dateRangeListFilter,
    setMonthFilter,
    setTypeVisualization,
    typeVisualization,
  } = useChartConfig(future);
  const options = dateRangeListFilter.map((month, index) => ({
    value: index,
    label: getMonthName(month, 'long'),
  }));

  const handleTypeVisualizationChange = (e: BaseSyntheticEvent) => {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
    setTypeVisualization(e.target.value);
  };

  return (
    <div>
      {typeVisualization === VisualizationType.BY_CATEGORY && (
        <ReactSelect
          options={options}
          defaultValue={options[0]}
          onChange={(e: { value: number; label: string }) =>
            setMonthFilter(e.value)
          }
        />
      )}
      <RadioGroup>
        <Radio
          value="byMonths"
          defaultChecked
          onChange={handleTypeVisualizationChange}
        >
          Visualizar todos os meses
        </Radio>
        <Radio value="byCategory" onChange={handleTypeVisualizationChange}>
          Ver gastos por categoria
        </Radio>
      </RadioGroup>

      {chartConfig && (
        <Box>
          {typeVisualization === VisualizationType.BY_CATEGORY && (
            <Pie
              data={chartConfig}
              height={400}
              options={{ maintainAspectRatio: false }}
            />
          )}
          {typeVisualization === VisualizationType.BY_MONTHS && (
            <Bar
              data={chartConfig}
              height={400}
              options={{
                maintainAspectRatio: false,
              }}
            />
          )}
        </Box>
      )}
    </div>
  );
};

export default SpendForecastTab;
