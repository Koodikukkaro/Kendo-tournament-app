import React, { useState } from "react";
import type { Dayjs } from "dayjs";
import dayjs from "dayjs";
import { isValidPhone } from "utils/form-validators";
import api from "api/axios";
import useToast from "hooks/useToast";
import { useNavigate } from "react-router-dom";
import { type TournamentType } from "types/models";
import { useTranslation } from "react-i18next";
import {
  Typography,
  Button,
  Container,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Stack,
  Box
} from "@mui/material";

// Readily defined components from the react-hook-form-mui library.
import {
  CheckboxElement,
  DateTimePickerElement,
  FormContainer,
  SelectElement,
  TextFieldElement,
  useForm,
  useWatch
} from "react-hook-form-mui";

import routePaths from "routes/route-paths";

const MIN_PLAYER_AMOUNT = 3;
const now = dayjs();

export interface CreateTournamentFormData {
  name: string;
  location: string;
  startDate: Dayjs;
  endDate: Dayjs;
  description: string;
  type: TournamentType;
  maxPlayers: number;
  differentOrganizer: boolean;
  organizerEmail?: string;
  organizerTel?: string;
}

const defaultValues: CreateTournamentFormData = {
  name: "",
  location: "",
  startDate: now,
  endDate: now.add(1, "week"),
  description: "",
  type: "Round Robin",
  maxPlayers: MIN_PLAYER_AMOUNT,
  differentOrganizer: false
};

const CreateTournamentForm: React.FC = () => {
  const showToast = useToast();
  const navigate = useNavigate();
  const { t } = useTranslation();
  const formContext = useForm<CreateTournamentFormData>({
    defaultValues,
    mode: "onBlur"
  });
  const { differentOrganizer, startDate } =
    useWatch<CreateTournamentFormData>(formContext);
  const [isConfirmationDialogOpen, setConfirmationDialogOpen] = useState(false);

  const onSubmit = async (data: CreateTournamentFormData): Promise<void> => {
    try {
      await api.tournaments.createNew({
        ...data,
        startDate: data.startDate.toString(),
        endDate: data.endDate.toString()
      });
      showToast(
        t("messages.creations_success", { name: data.name }),
        "success"
      );
      navigate(routePaths.homeRoute, {
        replace: true,
        state: { refresh: true }
      });
    } catch (error) {
      showToast(error, "error");
    }
  };

  const handleConfirm = async (): Promise<void> => {
    setConfirmationDialogOpen(false);
    await formContext.handleSubmit(onSubmit)();
  };

  return (
    <Container component="main" maxWidth="xs">
      <Box display="flex" flexDirection="column" gap="5px" width="100%">
        <Typography variant="h5" className="header" fontWeight="bold">
          {t("titles.create_tournament")}
        </Typography>
        <Typography variant="subtitle1" className="subtext">
          {t("create_tournament_form.info")}
        </Typography>
      </Box>
      <FormContainer defaultValues={defaultValues} formContext={formContext}>
        <TextFieldElement
          required
          name="name"
          label={t("create_tournament_form.tournament_name")}
          fullWidth
          margin="normal"
        />

        <TextFieldElement
          required
          name="location"
          label={t("create_tournament_form.location")}
          fullWidth
          margin="normal"
        />

        <Stack spacing={2} marginY={2}>
          <DateTimePickerElement
            required
            name="startDate"
            label={t("create_tournament_form.start_date_time")}
            minDateTime={now}
            format="DD/MM/YYYY HH:mm"
          />
          <DateTimePickerElement
            required
            name="endDate"
            label={t("create_tournament_form.end_date_time")}
            minDateTime={startDate}
            format="DD/MM/YYYY HH:mm"
          />
        </Stack>

        <TextFieldElement
          required
          multiline
          name="description"
          label={t("create_tournament_form.description")}
          fullWidth
          margin="normal"
        />

        <SelectElement
          required
          label={t("create_tournament_form.select_tournament_type")}
          name="type"
          options={[
            {
              id: "Round Robin",
              label: t("create_tournament_form.round_robin")
            },
            { id: "Playoff", label: t("create_tournament_form.playoff") }
          ]}
          fullWidth
          margin="normal"
        />

        <TextFieldElement
          required
          name="maxPlayers"
          type="number"
          label={t("create_tournament_form.max_players")}
          fullWidth
          margin="normal"
          validation={{
            validate: (value: number) => {
              return (
                value >= MIN_PLAYER_AMOUNT ||
                `${t("messages.minimum_players_error")}${MIN_PLAYER_AMOUNT}`
              );
            }
          }}
        />

        <CheckboxElement
          name="differentOrganizer"
          label={t("create_tournament_form.different_organizer_info")}
          onChange={(e) => {
            formContext.resetField("organizerEmail");
            formContext.resetField("organizerTel");
            formContext.setValue("differentOrganizer", e.target.checked);
          }}
        />

        {differentOrganizer !== undefined && differentOrganizer && (
          <React.Fragment>
            <TextFieldElement
              required
              name="organizerEmail"
              type="email"
              label={t("create_tournament_form.organizer_email")}
              fullWidth
              margin="normal"
            />

            <TextFieldElement
              required
              name="organizerTel"
              type="tel"
              label={t("create_tournament_form.organizer_phone_number")}
              fullWidth
              margin="normal"
              validation={{
                validate: (value: string) => {
                  return (
                    isValidPhone(value) || t("messages.phonenumber_validation")
                  );
                }
              }}
            />
          </React.Fragment>
        )}
        <Box textAlign="center">
          <Button
            variant="contained"
            color="primary"
            onClick={() => {
              setConfirmationDialogOpen(true);
            }}
            disabled={!formContext.formState.isValid}
            fullWidth
            sx={{ mt: 3, mb: 2 }}
          >
            {t("buttons.create_button")}
          </Button>
        </Box>

        <Dialog
          open={isConfirmationDialogOpen}
          onClose={() => {
            setConfirmationDialogOpen(false);
          }}
          aria-labelledby="confirmation-dialog-title"
          aria-describedby="confirmation-dialog-description"
        >
          <DialogTitle id="confirmation-dialog-title">
            Confirm tournament creation
          </DialogTitle>
          <DialogContent>
            <Typography>
              {t("create_tournament_form.confirmation_message")}
            </Typography>
          </DialogContent>
          <DialogActions>
            <Button
              variant="contained"
              color="error"
              onClick={() => {
                setConfirmationDialogOpen(false);
              }}
            >
              {t("buttons.cancel_button")}
            </Button>
            <Button
              type="submit"
              onClick={handleConfirm}
              variant="contained"
              color="success"
            >
              {t("buttons.confirm_button")}
            </Button>
          </DialogActions>
        </Dialog>
      </FormContainer>
    </Container>
  );
};

export default CreateTournamentForm;
