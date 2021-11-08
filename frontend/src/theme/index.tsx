import { extendTheme, ThemeConfig } from '@chakra-ui/react';

const config: ThemeConfig = {
  initialColorMode: 'dark',
  useSystemColorMode: false,
};

const theme = extendTheme({
  config,
  colors: {
    brand: {
      '50': '#E8FCF2',
      '100': '#BFF7DC',
      '200': '#96F2C5',
      '300': '#6DEDAE',
      '400': '#45E897',
      '500': '#16B667',
      '600': '#11884D',
      '700': '#0B5B33',
      '800': '#062D1A',
    },
  },
});

export default theme;
