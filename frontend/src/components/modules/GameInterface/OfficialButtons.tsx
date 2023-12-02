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

interface AddPointDialogProps {
  open: boolean;
  selectedButton: string;
  handleRadioButtonClick: (event: React.ChangeEvent<HTMLInputElement>) => void;
  handlePointShowing: () => Promise<void>;
  handleOpen: (player: number) => void;
}

const OfficialButtons: React.FC<AddPointDialogProps> = ({
  open,
  selectedButton,
  handleRadioButtonClick,
  handlePointShowing,
  handleOpen
}) => {
  return (
    <div>
      <Box display="flex" gap="20px" justifyContent="center">
        <Button
          onClick={() => {
            handleOpen(1);
          }}
          variant="contained"
        >
          Add point for player 1
        </Button>
        <Button
          onClick={() => {
            handleOpen(2);
          }}
          variant="contained"
        >
          Add point for player 2
        </Button>
      </Box>
      <Dialog open={open}>
        <DialogTitle>Select a Point</DialogTitle>
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
            disabled={!selectedButton}
          >
            OK
          </Button>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default OfficialButtons;
