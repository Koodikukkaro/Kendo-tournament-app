import React, { type SyntheticEvent, useState } from "react";
import DatePicker from "react-datepicker";
import {
  Typography,
  Button,
  FormControlLabel,
  TextField,
  Checkbox,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Container,
  type SelectChangeEvent
} from "@mui/material";
import "react-datepicker/dist/react-datepicker.css";
import "./createtournament.css";
import "../../common/Style/common.css";
import Footer from "components/common/Footer/Footer";

export interface FormData {
  tournamentName: string;
  location: string;
  startDate: Date;
  endDate: Date;
  description: string;
  tournamentType: string;
  maxPlayers: number | null;
  organizer: boolean;
  organizerEmail: string;
  organizerTel: string;
}

const TournamentForm: React.FC = () => {
  const [formData, setFormData] = useState<FormData>({
    tournamentName: "",
    location: "",
    startDate: new Date(),
    endDate: new Date(),
    description: "",
    tournamentType: "",
    maxPlayers: null,
    organizer: false,
    organizerEmail: "",
    organizerTel: ""
  });

  const handleFieldChange = (
    event:
      | SelectChangeEvent<string>
      | React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
    fieldName: string
  ): void => {
    let value: string | boolean;

    if ("target" in event && event.target instanceof HTMLInputElement) {
      value =
        event.target.type === "checkbox"
          ? event.target.checked
          : event.target.value;
    } else if (
      "target" in event &&
      event.target instanceof HTMLTextAreaElement
    ) {
      value = event.target.value;
    } else if ("target" in event) {
      value = event.target.value;
    } else {
      console.error("Unsupported event type");
      return;
    }

    setFormData((prevData) => ({
      ...prevData,
      [fieldName]: value
    }));
  };

  const handleDateChange = (
    date: Date | null,
    dateType: "startDate" | "endDate"
  ): void => {
    setFormData((prevData) => {
      let startDate = prevData.startDate;
      let endDate = prevData.endDate;

      if (dateType === "startDate") {
        startDate = date ?? new Date();
        endDate =
          date !== null && prevData.endDate !== null && date > prevData.endDate
            ? date
            : prevData.endDate;
      } else if (dateType === "endDate") {
        endDate = date ?? new Date();
        startDate =
          date !== null &&
          prevData.startDate !== null &&
          date < prevData.startDate
            ? date
            : prevData.startDate;
      }

      return {
        ...prevData,
        startDate,
        endDate
      };
    });
  };

  return (
    <Container component="main" maxWidth="xs">
      <form
        id="tournamentForm"
        className="form"
        onSubmit={(event: SyntheticEvent) => {
          event.preventDefault();
          /** here how tournament is actually created somewhere */
        }}
      >
        <Typography variant="h5" className="header" fontWeight="bold">
          Create a new tournament
        </Typography>
        <Typography variant="subtitle1" className="subtext">
          Fill information below.
        </Typography>
        <TextField
          variant="outlined"
          margin="normal"
          fullWidth
          id="tournamentName"
          label="Tournament name"
          name="tournamentName"
          required
          value={formData.tournamentName}
          onChange={(e) => {
            handleFieldChange(e, "tournamentName");
          }}
        />
        <TextField
          variant="outlined"
          margin="normal"
          fullWidth
          id="location"
          label="Location"
          name="location"
          required
          value={formData.location}
          onChange={(e) => {
            handleFieldChange(e, "location");
          }}
        />
        <Typography variant="subtitle1" className="subtext">
          Pick dates:
        </Typography>
        <div className="dates">
          <DatePicker
            id="start"
            selectsStart
            selected={formData.startDate}
            dateFormat="dd/MM/yyyy HH:mm"
            startDate={formData.startDate}
            endDate={formData.endDate}
            onChange={(date) => {
              handleDateChange(date, "startDate");
            }}
            showTimeSelect
            timeFormat="HH:mm"
            timeIntervals={30}
            timeCaption="Time"
          />
          <DatePicker
            id="end"
            selectsEnd
            selected={formData.endDate}
            dateFormat="dd/MM/yyyy HH:mm"
            startDate={formData.startDate}
            endDate={formData.endDate}
            minDate={formData.startDate}
            onChange={(date) => {
              handleDateChange(date, "endDate");
            }}
            showTimeSelect
            timeFormat="HH:mm"
            timeIntervals={30}
            timeCaption="Time"
          />
        </div>
        <br></br>
        <TextField
          multiline
          fullWidth
          minRows={3}
          maxRows={10}
          label="Information about tournament"
          id="description"
          name="description"
          required
          value={formData.description}
          onChange={(e) => {
            handleFieldChange(e, "description");
          }}
        />
        <FormControl fullWidth variant="outlined" margin="normal">
          <InputLabel htmlFor="tournamentType">
            Select tournament type *
          </InputLabel>
          <Select
            label="Select tournament type"
            id="tournamentType"
            value={formData.tournamentType}
            onChange={(e) => {
              handleFieldChange(e, "tournamentType");
            }}
            required
          >
            <MenuItem value="robin">Round Robin</MenuItem>
            <MenuItem value="playoff">Playoff</MenuItem>
          </Select>
        </FormControl>
        {formData.tournamentType === "playoff" && (
          <>
            <Typography>
              Playoff type works best if the number of players is 2, 4, 8, 16,
              32 etc.
            </Typography>
          </>
        )}
        <TextField
          variant="outlined"
          margin="normal"
          fullWidth
          id="maxPlayers"
          label="Maximum number of players"
          name="maxPlayers"
          required
          value={formData.maxPlayers ?? ""}
          onChange={(e) => {
            handleFieldChange(e, "maxPlayers");
          }}
        />
        <FormControlLabel
          control={
            <Checkbox
              checked={formData.organizer}
              onChange={(e) => {
                handleFieldChange(e, "organizer");
              }}
              name="organizer"
              color="primary"
            />
          }
          label="Organizer has different information than me"
        />
        {formData.organizer && (
          <>
            <TextField
              variant="outlined"
              margin="normal"
              fullWidth
              id="organizerEmail"
              label="Organizer's email"
              name="organizerEmail"
              required
              onChange={(e) => {
                handleFieldChange(e, "organizerEmail");
              }}
            />
            <TextField
              variant="outlined"
              margin="normal"
              fullWidth
              id="organizerTel"
              label="Organizer's phone number"
              name="organizerTel"
              required
              onChange={(e) => {
                handleFieldChange(e, "organizerTel");
              }}
            />
          </>
        )}
        <Button type="submit" variant="contained" id="btnCreate">
          Create
        </Button>
      </form>
      <br></br>
      <Footer />
    </Container>
  );
};

export default TournamentForm;
