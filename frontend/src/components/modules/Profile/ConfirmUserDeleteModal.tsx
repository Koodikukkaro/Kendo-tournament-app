import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import Typography from "@mui/material/Typography";
import React from "react";

interface ConfirmUserDeletionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
}

const ConfirmUserDeletionModal: React.FC<ConfirmUserDeletionModalProps> = ({
  isOpen,
  onClose,
  onConfirm
}) => {
  return (
    <Dialog
      open={isOpen}
      onClose={onClose}
      aria-labelledby="delete-user-info-confirmation-dialog-title"
      aria-describedby="delete-user-info-confirmation-dialog-description"
    >
      <DialogTitle id="delete-user-info-confirmation-dialog-title">
        Confirm Account Deletion
      </DialogTitle>
      <DialogContent>
        <Typography>
          Are you sure you want to delete your account and all associated
          information?
        </Typography>
      </DialogContent>
      <DialogActions>
        <Button variant="contained" color="error" onClick={onClose}>
          Cancel
        </Button>
        <Button
          type="submit"
          onClick={onConfirm}
          variant="contained"
          color="success"
        >
          Confirm
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ConfirmUserDeletionModal;
