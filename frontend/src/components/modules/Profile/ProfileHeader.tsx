import React, { useState } from "react";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import Link from "@mui/material/Link";

import routePaths from "routes/route-paths";
import useToast from "hooks/useToast";
import { useAuth } from "context/AuthContext";
import api from "api/axios";
import ConfirmUserDeletionModal from "./ConfirmUserDeleteModal";
import { Link as RouterLink, useNavigate } from "react-router-dom";

const ProfileHeader: React.FC = () => {
  const showToast = useToast();
  const navigate = useNavigate();
  const { userId, logout } = useAuth();
  const [isConfirmationDialogOpen, setConfirmationDialogOpen] = useState(false);

  const handleDeleteUser = async (): Promise<void> => {
    try {
      // This whole component wont be rendered if this is undefined.
      // eslint-disable-next-line  @typescript-eslint/no-non-null-assertion
      await api.user.delete(userId!);
      await logout();
      showToast("Your information has been deleted successfully", "success");
      navigate(routePaths.homeRoute, {
        replace: true,
        state: { refresh: true }
      });
    } catch (error) {
      showToast(error, "error");
    }
  };

  return (
    <Box
      display="flex"
      flexWrap="wrap"
      justifyContent="space-between"
      gap={2}
      marginBottom={1}
    >
      <ConfirmUserDeletionModal
        isOpen={isConfirmationDialogOpen}
        onClose={() => {
          setConfirmationDialogOpen(false);
        }}
        onConfirm={handleDeleteUser}
      />

      <Box display="flex" flexDirection="column">
        <Typography component="h1" variant="h5" fontWeight="bold">
          Profile info
        </Typography>

        <Typography variant="body2">
          <Link component={RouterLink} to={routePaths.passwordRecovery}>
            Change password
          </Link>
        </Typography>
      </Box>

      <Button
        type="button"
        variant="contained"
        color="error"
        size="small"
        onClick={() => {
          setConfirmationDialogOpen(true);
        }}
        sx={{ alignSelf: "flex-end" }}
      >
        Delete account
      </Button>
    </Box>
  );
};

export default ProfileHeader;
