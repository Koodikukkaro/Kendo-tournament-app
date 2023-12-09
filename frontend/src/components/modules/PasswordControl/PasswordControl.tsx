import React from "react";

import { useSearchParams } from "react-router-dom";
import PasswordResetForm from "./PasswordReset";
import PasswordRecoveryForm from "./PasswordRecover";
import Box from "@mui/material/Box";

const PasswordControl: React.FC = () => {
  const [searchParams] = useSearchParams();
  const resetToken = searchParams.get("token");
  const isPasswordReset = resetToken !== null;

  return (
    <Box>
      {isPasswordReset ? (
        <PasswordResetForm resetToken={resetToken} />
      ) : (
        <PasswordRecoveryForm />
      )}
    </Box>
  );
};

export default PasswordControl;
