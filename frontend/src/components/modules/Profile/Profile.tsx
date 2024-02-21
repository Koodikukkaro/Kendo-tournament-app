import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import useToast from "hooks/useToast";
import { useAuth } from "context/AuthContext";
import { isValidPhone, isValidUsername } from "utils/form-validators";
import api from "api/axios";
import Loader from "components/common/Loader";
import ErrorModal from "components/common/ErrorModal";
import EditButtonRow from "./EditInfoButtonRow";
import ProfileHeader from "./ProfileHeader";
import type { EditUserRequest } from "types/requests";
import routePaths from "routes/route-paths";
import { useTranslation } from "react-i18next";

import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";

import {
  CheckboxElement,
  FormContainer,
  TextFieldElement,
  useForm,
  useWatch
} from "react-hook-form-mui";

const defaultValues: EditUserRequest = {
  firstName: "",
  lastName: "",
  userName: "",
  email: "",
  phoneNumber: "",
  nationality: "",
  inNationalTeam: false,
  suomisportId: "",
  clubName: "",
  danRank: "",
  underage: false,
  guardiansEmail: ""
};

const Profile: React.FC = () => {
  const navigate = useNavigate();
  const showToast = useToast();
  const { userId } = useAuth();
  const { t } = useTranslation();

  const [isLoading, setIsLoading] = useState(true);
  const [isError, setIsError] = useState(false);
  const [editingEnabled, setEditingEnabled] = useState<boolean>(false);

  const formContext = useForm<EditUserRequest>({
    defaultValues,
    mode: "onBlur",
    disabled: !editingEnabled
  });

  const { underage } = useWatch<EditUserRequest>(formContext);

  useEffect(() => {
    const fetchUserData = async (): Promise<void> => {
      try {
        if (userId !== undefined) {
          const user = await api.user.details(userId);
          formContext.reset(user);
        }
      } catch (error) {
        setIsError(true);
        showToast(error, "error");
      } finally {
        setIsLoading(false);
      }
    };

    void fetchUserData();
  }, [userId, formContext.reset]);

  if (isLoading || userId === undefined) {
    return <Loader />;
  }

  // Redirect the user back in case of an error
  if (isError) {
    return (
      <ErrorModal
        open={true}
        onClose={() => {
          navigate(routePaths.homeRoute);
        }}
        errorMessage={t("messages.error_retrieving_info")}
      />
    );
  }

  const onSubmit = async (data: EditUserRequest): Promise<void> => {
    try {
      await api.user.update(userId, data);
      showToast(t("messages.update_success"), "success");
    } catch (error) {
      showToast(error, "error");
    }
  };

  return (
    <Box display="flex" justifyContent="center">
      {/* Form for editing user info */}
      <Box
        sx={{
          padding: "1em",
          width: "500px"
        }}
      >
        <ProfileHeader />
        <FormContainer
          defaultValues={defaultValues}
          formContext={formContext}
          onSuccess={onSubmit}
        >
          {/* Container for first and last name */}
          <Grid container columnSpacing={2}>
            <Grid item xs={12} md={6}>
              <TextFieldElement
                required
                fullWidth
                name="firstName"
                label={t("user_info_labels.first_name")}
                margin="normal"
                disabled={!editingEnabled}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextFieldElement
                required
                fullWidth
                name="lastName"
                label={t("user_info_labels.last_name")}
                margin="normal"
                disabled={!editingEnabled}
              />
            </Grid>
          </Grid>

          <TextFieldElement
            required
            name="email"
            label={t("user_info_labels.email_address")}
            type="email"
            fullWidth
            margin="normal"
            disabled={!editingEnabled}
          />

          <TextFieldElement
            required
            name="phoneNumber"
            label={t("user_info_labels.phone_number")}
            type="tel"
            fullWidth
            margin="normal"
            disabled={!editingEnabled}
            validation={{
              validate: (value: string) => {
                return (
                  isValidPhone(value) || t("messages.phonenumber_validation")
                );
              }
            }}
          />

          <TextFieldElement
            name="userName"
            label={t("user_info_labels.username")}
            fullWidth
            margin="normal"
            disabled={!editingEnabled}
            validation={{
              validate: (value: string) => {
                return (
                  isValidUsername(value) || t("messages.username_validation")
                );
              }
            }}
          />

          <TextFieldElement
            name="nationality"
            label={t("user_info_labels.nationality")}
            fullWidth
            margin="normal"
            disabled={!editingEnabled}
          />

          <CheckboxElement
            name="inNationalTeam"
            label={t("user_info_labels.in_national_team")}
            disabled={!editingEnabled}
          />

          <TextFieldElement
            name="rank"
            label={t("user_info_labels.dan_rank")}
            fullWidth
            margin="normal"
            disabled={!editingEnabled}
          />

          <TextFieldElement
            name="club"
            label={t("user_info_labels.club")}
            fullWidth
            margin="normal"
            disabled={!editingEnabled}
          />

          <TextFieldElement
            name="suomisport"
            label={t("user_info_labels.suomisport_id")}
            fullWidth
            margin="normal"
            disabled={!editingEnabled}
          />

          <CheckboxElement
            name="underage"
            label={t("user_info_labels.underage")}
            disabled={!editingEnabled}
            onChange={(e) => {
              formContext.resetField("guardiansEmail");
              formContext.setValue("underage", e.target.checked);
            }}
          />
          {(underage as boolean) && (
            <TextFieldElement
              required
              name="guardiansEmail"
              label={t("user_info_labels.guardians_email")}
              type="email"
              fullWidth
              margin="normal"
              disabled={!editingEnabled}
            />
          )}
          <EditButtonRow
            editingEnabled={editingEnabled}
            setEditingEnabled={setEditingEnabled}
            formContext={formContext}
          />
        </FormContainer>
      </Box>
    </Box>
  );
};

export default Profile;
