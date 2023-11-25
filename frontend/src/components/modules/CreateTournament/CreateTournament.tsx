import React, { type SyntheticEvent, useState } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import "./createtournament.css";

export interface FormData {
  tournamentName: string;
  location: string;
  startDate: Date;
  endDate: Date;
  description: string;
  tournamentType: string;
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
    organizer: false,
    organizerEmail: "",
    organizerTel: ""
  });

  const handleInputChange = (
    event: React.ChangeEvent<HTMLInputElement>,
    fieldName: string
  ): void => {
    const value =
      event.target.type === "checkbox"
        ? event.target.checked
        : event.target.value;
    setFormData((prevData) => ({
      ...prevData,
      [fieldName]: value
    }));
  };

  const handleSelectChange = (
    event: React.ChangeEvent<HTMLSelectElement>,
    fieldName: string
  ): void => {
    const value = event.target.value;
    setFormData((prevData) => ({
      ...prevData,
      [fieldName]: value
    }));
  };

  const handleStartDateChange = (date: Date | null): void => {
    setFormData((prevData) => ({
      ...prevData,
      startDate: date ?? new Date(),
      endDate:
        date !== null && prevData.endDate !== null && date > prevData.endDate
          ? date
          : prevData.endDate
    }));
  };

  const handleEndDateChange = (date: Date | null): void => {
    setFormData((prevData) => ({
      ...prevData,
      endDate: date ?? new Date(),
      startDate:
        date !== null &&
        prevData.startDate !== null &&
        date < prevData.startDate
          ? date
          : prevData.startDate
    }));
  };

  return (
    <form
      id="tournamentForm"
      className="form"
      onSubmit={(event: SyntheticEvent) => {
        event.preventDefault();
        /** here how tournament is actually created somewhere */
      }}
    >
      <h1 className="header">Create a new tournament</h1>
      <p className="subtext">Fill information below.</p>
      <div className="field">
        <label htmlFor="tournamentName"></label>
        <input
          type="text"
          name="tournamentName"
          id="tournamentName"
          placeholder="Tournament name"
          required
          value={formData.tournamentName}
          onChange={(e) => {
            handleInputChange(e, "tournamentName");
          }}
        />
      </div>
      <div className="field">
        <br />
        <label htmlFor="location"></label>
        <input
          type="text"
          name="location"
          id="location"
          placeholder="Location"
          required
          value={formData.location}
          onChange={(e) => {
            handleInputChange(e, "location");
          }}
        />
      </div>
      <p className="subtext">Pick dates:</p>
      <div className="field">
        <div className="dates">
          <label htmlFor="startDate"></label>
          <DatePicker
            selectsStart
            selected={formData.startDate}
            dateFormat="dd/MM/yyyy"
            startDate={formData.startDate}
            endDate={formData.endDate}
            onChange={handleStartDateChange}
          />
          <label htmlFor="endDate"></label>
          <DatePicker
            selectsEnd
            selected={formData.endDate}
            dateFormat="dd/MM/yyyy"
            startDate={formData.startDate}
            endDate={formData.endDate}
            minDate={formData.startDate}
            onChange={handleEndDateChange}
          />
        </div>
      </div>
      <p className="subtext">Description:</p>
      <div className="field">
        <label htmlFor="description"></label>
        <input
          type="text"
          name="description"
          id="description"
          placeholder="Information about tournament"
          required
          value={formData.description}
          onChange={(e) => {
            handleInputChange(e, "description");
          }}
        />
      </div>
      <div className="field">
        <br />
        <label htmlFor="tournamentType">Select tournament type:</label>
        <br />
        <select
          id="tournamentType"
          onChange={(e) => {
            handleSelectChange(e, "tournamentType");
          }}
          value={formData.tournamentType}
        >
          <option value="robin">Round Robin</option>
          <option value="playoff">Playoff</option>
          <option value="preAndPlayoff">Premilinary + playoff</option>
        </select>
      </div>
      <br />
      <div className="field-checkbox">
        <input
          type="checkbox"
          name="organizer"
          id="organizer"
          checked={formData.organizer}
          onChange={(e) => {
            handleInputChange(e, "organizer");
          }}
        />
        <label htmlFor="organizer">
          Organizer has different information than me
        </label>
        {formData.organizer && (
          <div className="field">
            <br />
            <label htmlFor="organizerEmail"></label>
            <input
              type="text"
              name="organizerEmail"
              id="organizerEmail"
              placeholder="Organizer's email"
              required
            />
            <br />
            <br />
            <label htmlFor="organizerTel"></label>
            <input
              type="tel"
              name="organizerTel"
              id="organizerTel"
              placeholder="Organizer's phone number"
              required
            />
          </div>
        )}
      </div>
      <br />
      <div className="field">
        <button type="submit" id="btnCreate">
          Create
        </button>
      </div>
    </form>
  );
};

export default TournamentForm;
