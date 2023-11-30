import React from "react";
import Box from "@mui/material/Box";
import CircularProgress, {
  type CircularProgressProps
} from "@mui/material/CircularProgress";

const Loader = (props?: CircularProgressProps): React.ReactElement => {
  return (
    <Box textAlign="center">
      <CircularProgress className="loader-icon" {...props} />
    </Box>
  );
};

export default Loader;
