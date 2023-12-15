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
        errorMessage={
          "There was an error retrieveing your information. Close this to go back to the previous view."
        }
      />
    );
  }

  const onSubmit = async (data: EditUserRequest): Promise<void> => {
    try {
      await api.user.update(userId, data);
      showToast(
        "Your information has been updated successfully! Please refresh the page to see the changes.",
        "success"
      );
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
                label="First Name"
                margin="normal"
                disabled={!editingEnabled}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextFieldElement
                required
                fullWidth
                name="lastName"
                label="Last Name"
                margin="normal"
                disabled={!editingEnabled}
              />
            </Grid>
          </Grid>

          <TextFieldElement
            required
            name="email"
            label="Email Address"
            type="email"
            fullWidth
            margin="normal"
            disabled={!editingEnabled}
          />

          <TextFieldElement
            required
            name="phoneNumber"
            label="Phone Number"
            type="tel"
            fullWidth
            margin="normal"
            disabled={!editingEnabled}
            validation={{
              validate: (value: string) => {
                return (
                  isValidPhone(value) || "Please enter a valid phone number"
                );
              }
            }}
          />

          <TextFieldElement
            name="userName"
            label="Username"
            fullWidth
            margin="normal"
            disabled={!editingEnabled}
            validation={{
              validate: (value: string) => {
                return (
                  isValidUsername(value) ||
                  "Username must be 4-20 characters long, start and end with a letter or number, and contain only letters, numbers, dots, or underscores with no consecutive dots or underscores."
                );
              }
            }}
          />

          <TextFieldElement
            name="nationality"
            label="Nationality"
            fullWidth
            margin="normal"
            disabled={!editingEnabled}
          />

          <CheckboxElement
            name="inNationalTeam"
            label="I'm in the national team ring"
            disabled={!editingEnabled}
          />

          <TextFieldElement
            name="rank"
            label="Dan Rank"
            fullWidth
            margin="normal"
            disabled={!editingEnabled}
          />

          <TextFieldElement
            name="club"
            label="Club"
            fullWidth
            margin="normal"
            disabled={!editingEnabled}
          />

          <TextFieldElement
            name="suomisport"
            label="Suomisport ID"
            fullWidth
            margin="normal"
            disabled={!editingEnabled}
          />

          <CheckboxElement
            name="underage"
            label="I'm underage"
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
              label="Guardian's Email Address"
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
