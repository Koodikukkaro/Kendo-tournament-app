import { red, blue } from "@mui/material/colors";
import { createTheme } from "@mui/material/styles";

const theme = createTheme({
  palette: {
    primary: {
      main: red[500]
    },
    secondary: {
      main: blue[500]
    }
  },
  typography: {
    fontSize: 16
  }
});

export default theme;
