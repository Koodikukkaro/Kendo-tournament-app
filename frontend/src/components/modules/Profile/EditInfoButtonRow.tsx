import React from "react";
import type { UseFormReturn } from "react-hook-form";
import type { EditUserRequest } from "types/requests";
import Button from "@mui/material/Button";
import Box from "@mui/material/Box";

interface EditButtonRowProps {
  editingEnabled: boolean;
  setEditingEnabled: (value: any) => void;
  formContext: UseFormReturn<EditUserRequest>;
}

const EditButtonRow: React.FC<EditButtonRowProps> = ({
  editingEnabled,
  setEditingEnabled,
  formContext
}: EditButtonRowProps) => {
  return (
    <Box
      display="flex"
      justifyContent="space-evenly"
      flexWrap="wrap"
      gap="10px"
    >
      {!editingEnabled ? (
        <Button
          type="button"
          variant="outlined"
          color="primary"
          sx={{ mt: 3, mb: 2 }}
          onClick={() => {
            setEditingEnabled(true);
          }}
        >
          Edit Info
        </Button>
      ) : (
        <Button
          type="button"
          variant="outlined"
          color="primary"
          onClick={() => {
            setEditingEnabled(() => {
              formContext.reset();
              return false;
            });
          }}
          sx={{ mt: 3, mb: 2 }}
        >
          Cancel
        </Button>
      )}
      <Button
        type="submit"
        variant="contained"
        color="primary"
        disabled={!editingEnabled || !formContext.formState.isDirty}
        sx={{ mt: 3, mb: 2 }}
      >
        Save info
      </Button>
    </Box>
  );
};

export default EditButtonRow;
