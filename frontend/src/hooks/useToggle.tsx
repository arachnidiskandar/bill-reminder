import React, { useState } from 'react';

const useToggle = (defaultValue: boolean) => {
  const [value, setValue] = useState<boolean>(defaultValue);

  const toggleValue = setValue(currentValue => !currentValue);

  return [value, toggleValue];
};

export default useToggle;
