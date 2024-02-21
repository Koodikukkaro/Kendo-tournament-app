import React from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  Radio,
  RadioGroup,
  FormControlLabel,
  Button,
  Box
} from "@mui/material";
import { useTranslation } from "react-i18next";

interface AddPointDialogProps {
  open: boolean;
  selectedButton: string;
  handleRadioButtonClick: (event: React.ChangeEvent<HTMLInputElement>) => void;
  handlePointShowing: () => Promise<void>;
  handleOpen: (player: number) => void;
  handleClose: () => void;
}

const OfficialButtons: React.FC<AddPointDialogProps> = ({
  open,
  selectedButton,
  handleRadioButtonClick,
  handlePointShowing,
  handleOpen,
  handleClose
}) => {
  const { t } = useTranslation();

  return (
    <div>
      <Box display="flex" gap="20px" justifyContent="center">
        <Button
          onClick={() => {
            handleOpen(1);
          }}
          variant="contained"
        >
          {t("buttons.add_point_player_1")}
        </Button>
        <Button
          onClick={() => {
            handleOpen(2);
          }}
          variant="contained"
        >
          {t("buttons.add_point_player_2")}
        </Button>
      </Box>
      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>{t("game_interface.dialog_title")}</DialogTitle>
        <DialogContent>
          <RadioGroup
            aria-label="point"
            name="point"
            value={selectedButton}
            onChange={handleRadioButtonClick}
          >
            <FormControlLabel value="M" control={<Radio />} label="M" />
            <FormControlLabel value="K" control={<Radio />} label="K" />
            <FormControlLabel value="D" control={<Radio />} label="D" />
            <FormControlLabel value="T" control={<Radio />} label="T" />
            <FormControlLabel value="Δ" control={<Radio />} label="Δ" />
          </RadioGroup>
          <Button
            onClick={async () => {
              await handlePointShowing();
            }}
            disabled={selectedButton === ""}
          >
            {t("buttons.ok_button")}
          </Button>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default OfficialButtons;
