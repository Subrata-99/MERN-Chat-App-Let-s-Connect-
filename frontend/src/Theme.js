const { extendTheme } = require("@chakra-ui/react");

const theme = extendTheme({
  colors: {
    primary: {
      main: "#7bb9e8",
      50: "#e3f2fd",
      100: "#bbdefb",
      200: "#90caf9",
      300: "#64b5f6",
      400: "#42a5f5",
      500: "#0E8388",
      600: "#1e88e5",
      700: "#1976d2",
      800: "#1565c0",
      900: "#0d47a1",
    },
  },
});

export default theme;
