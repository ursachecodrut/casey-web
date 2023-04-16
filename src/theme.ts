import { createTheme } from '@mui/material';

const theme = createTheme({
  palette: {
    primary: {
      main: '#f9f9f9',
    },
    secondary: {
      main: '#ffd7c9',
    },
    info: {
      main: '#e3f1ff',
    },
    warning: {
      main: '#ff642f',
    },
    background: {
      default: '#f9f9f9',
    },
    text: {
      primary: '#000000',
      disabled: '#f7f7f7',
    },
    common: {
      black: '#000000',
      white: '#ffffff',
    },
  },
});

export default theme;
