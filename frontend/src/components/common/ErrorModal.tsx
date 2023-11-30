import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import React from "react";

interface ErrorModalProps {
  open: boolean;
  onClose: () => void;
  errorMessage?: string;
}

const ErrorModal: React.FC<ErrorModalProps> = ({
  open,
  onClose,
  errorMessage
}) => {
  return (
    <Dialog
      open={open}
      onClose={onClose}
      aria-labelledby="error-dialog-title"
      fullWidth
    >
      <DialogTitle id="error-dialog-title">Unexpected error</DialogTitle>
      <DialogContent>
        <DialogContentText>{errorMessage}</DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} color="primary">
          close
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ErrorModal;
