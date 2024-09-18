import { createTheme } from '@mui/material/styles';

// Define your custom theme
const theme = createTheme({
  palette: {
    background: {
      paper: '#ffffea',  // Light background color for paper elements
    },
    primary: {
      main: '#1976d2',  // Primary color
    },
    secondary: {
      main: '#dc004e',  // Secondary color
    },
    text: {
      primary: '#000000',  // Primary text color
      secondary: '#555555', // Secondary text color
    },
  },
  typography: {
    fontFamily: 'Roboto, Arial, sans-serif',
    h6: {
      fontSize: '1.25rem',
      fontWeight: 700,
    },
    // Add other typography settings as needed
  },
  spacing: 8, // Default spacing unit (8px)
  breakpoints: {
    values: {
      xs: 0,   // Extra small devices
      sm: 600, // Small devices (landscape phones)
      md: 900, // Medium devices (tablets)
      lg: 1200, // Large devices (desktops)
      xl: 1536, // Extra large devices (large desktops)
    },
  },
  shadows: [
    'none', // Shadow for level 0 (no shadow)
    '0px 1px 3px rgba(0,0,0,0.2), 0px 1px 2px rgba(0,0,0,0.14)', // Shadow for level 1
    '0px 1px 5px rgba(0,0,0,0.2), 0px 1px 3px rgba(0,0,0,0.12)', // Shadow for level 2
    '0px 3px 5px rgba(0,0,0,0.2), 0px 1px 10px rgba(0,0,0,0.14)', // Shadow for level 3
    '0px 4px 5px rgba(0,0,0,0.2), 0px 1px 15px rgba(0,0,0,0.14)', // Shadow for level 4
    '0px 6px 10px rgba(0,0,0,0.2), 0px 1px 20px rgba(0,0,0,0.14)', // Shadow for level 5
    '0px 10px 15px rgba(0,0,0,0.2), 0px 1px 25px rgba(0,0,0,0.14)', // Shadow for level 6
    '0px 15px 20px rgba(0,0,0,0.2), 0px 1px 30px rgba(0,0,0,0.14)', // Shadow for level 7
    '0px 20px 25px rgba(0,0,0,0.2), 0px 1px 35px rgba(0,0,0,0.14)', // Shadow for level 8
    '0px 25px 30px rgba(0,0,0,0.2), 0px 1px 40px rgba(0,0,0,0.14)', // Shadow for level 9
    '0px 30px 35px rgba(0,0,0,0.2), 0px 1px 45px rgba(0,0,0,0.14)', // Shadow for level 10
    '0px 35px 40px rgba(0,0,0,0.2), 0px 1px 50px rgba(0,0,0,0.14)', // Shadow for level 11
    '0px 40px 45px rgba(0,0,0,0.2), 0px 1px 55px rgba(0,0,0,0.14)', // Shadow for level 12
    '0px 45px 50px rgba(0,0,0,0.2), 0px 1px 60px rgba(0,0,0,0.14)', // Shadow for level 13
    '0px 50px 55px rgba(0,0,0,0.2), 0px 1px 65px rgba(0,0,0,0.14)', // Shadow for level 14
    '0px 55px 60px rgba(0,0,0,0.2), 0px 1px 70px rgba(0,0,0,0.14)', // Shadow for level 15
    '0px 60px 65px rgba(0,0,0,0.2), 0px 1px 75px rgba(0,0,0,0.14)', // Shadow for level 16
    '0px 1px 80px rgba(0,0,0,0.2)', // Shadow for level 17
    '0px 1px 85px rgba(0,0,0,0.2)', // Shadow for level 18
    '0px 1px 90px rgba(0,0,0,0.2)', // Shadow for level 19
    '0px 1px 95px rgba(0,0,0,0.2)', // Shadow for level 20
    '0px 1px 100px rgba(0,0,0,0.2)', // Shadow for level 21
    '0px 1px 105px rgba(0,0,0,0.2)', // Shadow for level 22
    '0px 1px 110px rgba(0,0,0,0.2)', // Shadow for level 23
    '0px 1px 115px rgba(0,0,0,0.2)', // Shadow for level 24
     // Shadow for level 25
  ],
});

export default theme;
