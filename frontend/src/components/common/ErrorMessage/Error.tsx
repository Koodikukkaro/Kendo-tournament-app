// ErrorMessage.tsx
import React, { useState, useEffect } from "react";
import Paper from "@mui/material/Paper";
import CloseIcon from "@mui/icons-material/Close";
import "./error.css";

interface ErrorMessageProps {
  message: string;
}

const ErrorMessage: React.FC<ErrorMessageProps> = (props) => {
  const [errorMessage, setErrorMessage] = useState<string>("");

  console.log("error", errorMessage);
  // Effect hook to update state when new message prop is received
  useEffect(() => {
    if (props.message !== "" && props.message !== undefined) {
      setErrorMessage(props.message);
    }
  }, [props.message]); // Only re-run the effect if the message prop changes

  const handleClose = (): void => {
    setErrorMessage("");
  };

  if (errorMessage === "" || errorMessage === undefined) {
    return null;
  }

  return (
    <Paper className="error-message">
      <p>{errorMessage}</p>
      <CloseIcon className="cross-icon" onClick={handleClose} />
    </Paper>
  );
};

export default ErrorMessage;
