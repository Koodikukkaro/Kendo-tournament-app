import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import Typography from "@mui/material/Typography";
import React from "react";
import { useTranslation } from "react-i18next";

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
  const { t } = useTranslation();

  return (
    <Dialog
      open={isOpen}
      onClose={onClose}
      aria-labelledby="delete-user-info-confirmation-dialog-title"
      aria-describedby="delete-user-info-confirmation-dialog-description"
    >
      <DialogTitle id="delete-user-info-confirmation-dialog-title">
        {t("titles.confirm_account_deletion")}
      </DialogTitle>
      <DialogContent>
        <Typography>
          {t("confirm_user_deletion_modal.confirmation_message")}
        </Typography>
      </DialogContent>
      <DialogActions>
        <Button variant="contained" color="error" onClick={onClose}>
          {t("buttons.cancel_button")}
        </Button>
        <Button
          type="submit"
          onClick={onConfirm}
          variant="contained"
          color="success"
        >
          {t("buttons.confirm_button")}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ConfirmUserDeletionModal;
