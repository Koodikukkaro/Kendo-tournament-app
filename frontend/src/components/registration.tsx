import React, { type SyntheticEvent, useState } from "react";
import "./registration.css";

const RegisterForm: React.FC = () => {
  const [formData, setFormData] = useState({
    firstname: "",
    lastname: "",
    username: "",
    email: "",
    tel: "",
    password: "",
    passwordConfirmation: "",
    rank: "",
    club: "",
    suomisport: "",
    underage: false,
    guardianEmail: "",
    conditions: false
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

  return (
    <form
      id="registerForm"
      className="form"
      onSubmit={(event: SyntheticEvent) => {
        event.preventDefault();
        /** here how user is actually added somewhere */
      }}
    >
      <h1 className="header">Create a KendoApp account</h1>
      <p className="subtext">
        Already have an account? <a href="url">Log in</a>{" "}
      </p>
      <p className="subtext">
        {" "}
        Fill in the fields below. Fields marked with * are required.
      </p>

      <div className="field">
        <input
          type="text"
          name="firstname"
          placeholder="First name *"
          required
          value={formData.firstname}
          onChange={(e) => {
            handleInputChange(e, "firstname");
          }}
        />
      </div>
      <div className="field">
        <br />
        <label htmlFor="lastname"></label>
        <input
          type="text"
          name="lastname"
          placeholder="Last name *"
          required
          value={formData.lastname}
          onChange={(e) => {
            handleInputChange(e, "lastname");
          }}
        />
      </div>
      <div className="field">
        <br />
        <label htmlFor="username"></label>
        <input
          type="text"
          name="username"
          placeholder="Username *"
          required
          value={formData.username}
          onChange={(e) => {
            handleInputChange(e, "username");
          }}
        />
      </div>
      <div className="field">
        <br />
        <label htmlFor="email"></label>
        <input
          type="email"
          name="email"
          placeholder="Email *"
          required
          value={formData.email}
          onChange={(e) => {
            handleInputChange(e, "email");
          }}
        />
      </div>
      <div className="field">
        <br />
        <label htmlFor="tel"></label>
        <input
          type="tel"
          name="tel"
          placeholder="Phone number * (e.g. +358...)"
          required
          value={formData.tel}
          onChange={(e) => {
            handleInputChange(e, "tel");
          }}
        />
      </div>
      <div className="field">
        <br />
        <label htmlFor="password"></label>
        <input
          type="password"
          name="password"
          placeholder="Password *"
          required
          value={formData.password}
          onChange={(e) => {
            handleInputChange(e, "password");
          }}
        />
        <i className="fa-solid fa-eye" id="eye" />
      </div>
      <div className="field">
        <br />
        <label htmlFor="passwordConfirmation"></label>
        <input
          type="password"
          name="passwordConfirmation"
          placeholder="Password again *"
          required
          value={formData.passwordConfirmation}
          onChange={(e) => {
            handleInputChange(e, "passwordConfirmation");
          }}
        />
        <i className="fa-solid fa-eye" id="eye" />
      </div>
      <div className="field">
        <br />
        <label htmlFor="rank"></label>
        <input
          type="text"
          name="rank"
          placeholder="Rank"
          value={formData.rank}
          onChange={(e) => {
            handleInputChange(e, "rank");
          }}
        />
      </div>
      <div className="field">
        <br />
        <label htmlFor="club"></label>
        <input
          type="text"
          name="club"
          placeholder="Club"
          value={formData.club}
          onChange={(e) => {
            handleInputChange(e, "club");
          }}
        />
      </div>
      <div className="field">
        <br />
        <label htmlFor="suomisport"></label>
        <input
          type="text"
          name="suomisport"
          placeholder="Suomisport ID"
          value={formData.suomisport}
          onChange={(e) => {
            handleInputChange(e, "suomisport");
          }}
        />
      </div>
      <div className="field-checkbox">
        <input
          type="checkbox"
          name="underage"
          checked={formData.underage}
          onChange={(e) => {
            handleInputChange(e, "underage");
          }}
        />
        <label htmlFor="underage">I&apos;m underage</label>
        {formData.underage && (
          <div className="field">
            <br />
            <label htmlFor="guardianEmail"></label>
            <input
              type="text"
              name="guardianEmail"
              placeholder="Guardian's email"
              required
            />
          </div>
        )}
      </div>
      <div className="field-checkbox">
        <input
          type="checkbox"
          name="consent"
          required
          checked={formData.conditions}
          onChange={(e) => {
            handleInputChange(e, "conditions");
          }}
        />
        <label htmlFor="conditions">
          By checking this box I agree to the{" "}
          <a href="url">terms and conditions</a> *
        </label>
      </div>
      <div className="field">
        <button type="submit" id="btnRegister">
          Register
        </button>
      </div>
    </form>
  );
};

export default RegisterForm;
